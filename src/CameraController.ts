import { Camera } from "./Camera";
import { degToRad, m3 } from "./Engine";

export class CameraController{
    private _camera: Camera
    private _pitch: number = 30
    private _yaw: number = 30

    constructor( camera : Camera)
    {
        this._camera = camera
    }

     //FPS - first person camera 
    private HandleFPSCamera(pitch: number, yaw: number)
    {
        if(pitch > 89.0)
            pitch = 89.0;
        
        if(pitch < -89.0)
            pitch = -89.0;

        let newDirection = m3.normalize([
            Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
            Math.sin(degToRad(pitch)),
            Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
        ])
        
        let direction = m3.additionVectors(this._camera._cameraPosition, newDirection)  
        
        this._camera = new Camera(this._camera._cameraPosition, direction)
    }

    private HandleCameraOrbit(pitch: number, yaw: number)
    {
        if(pitch > 89.0)
              pitch = 87.0;
    
        if(pitch < 0)
              pitch = 4;
  
        let r = m3.length(this._camera._cameraPosition)

        let newPosition = ([
            r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)), //x
            r * Math.cos(degToRad(pitch)), //y
            r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), //z
        ])
       
        ///Странный баг
        this._camera = new Camera(newPosition)
    }

    public HandleKeyPress(key : string)
    {
        const delta = 2
         
        switch( key )
        {
            case "w":
                this._camera.slide( 0, 0, -delta)
                break;
            case "a":
                this._camera.slide(-delta) 
                break;
            case "s":
                this._camera.slide( 0, 0, delta )
                break; 
            case "d":
                this._camera.slide(delta);
                break;   
            case "e":
                this._camera.TaitBryanAngles(delta,0);
                break; 
            case "r":
                this._camera.TaitBryanAngles(0,delta);
                break; 
        }

    }

    public HandleMouseMove(offsetX: number, offsetY: number, rightMouseButtonDown:boolean)
    {
        const sensitivity = 0.5

        this._pitch += offsetY * sensitivity
        this._yaw += offsetX * sensitivity

        console.log('desh pitch=%s , yaw=%s', this._pitch, this._yaw)

        if(rightMouseButtonDown)
            this.HandleCameraOrbit(this._pitch, this._yaw)
        else 
            this.HandleFPSCamera(this._pitch, this._yaw)
    }

    public get Camera()
    {
        return this._camera
    }
}