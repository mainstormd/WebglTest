import { Camera } from "./Camera";
import { EventManager } from "./EventSystem/EventManager";
import { degToRad, m3 } from "./Math/math";
import config from "./Config/config.json"

export class CameraController{
    private _eventManager: EventManager  
    private _camera: Camera
    private _pitch: number = 0
    private _yaw: number = 10

    constructor( camera : Camera, eventManager: EventManager)
    {
        this._camera = camera
        this._eventManager = eventManager

        this._eventManager.Subscribe('mousemove',this.HandleMouseMove.bind(this))
        this._eventManager.Subscribe('keypress',this.HandleKeyPress.bind(this))
    }

     //FPS - first person camera 

    private HandleTestFPSCamera(dPitch: number, dYaw: number)
    {
         if(this._pitch > 89.0)
         {
             this._pitch = 89
             dPitch = 0;
         }        
         
         if(this._pitch < -89.0)
         {
             this._pitch  = -89
             dPitch = 0;
         }   
 
         console.log('FPS normalize pitch=%s , yaw=%s', dPitch, dYaw)    
         
         this._camera.yRotate(dYaw)     
         this._camera.Pitch(dPitch)          
    } 
     
    private HandleFPSCamera(pitch: number, yaw: number)
    {
        if(pitch > 89.0)
        {
            pitch = 89.0;
        }
        
        if(pitch < -89.0)
        {
            pitch = -89.0;
        }

        console.log('FPS normalize pitch=%s , yaw=%s', pitch, yaw)    

        let newDirection = m3.normalize([
            Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
            Math.sin(degToRad(pitch)),
            Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
        ])
        
        let direction = m3.additionVectors(this._camera.position, newDirection)  
        
        this._camera = new Camera(this._camera.position, direction)
    }

    private HandleCameraOrbit(pitch: number, yaw: number)
    {
        if(pitch > 89.0)
              pitch = 87.0;
    
        if(pitch < 0)
              pitch = 4;
  
        let r = m3.length(this._camera.position)

        let newPosition = ([
            r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)), //x
            r * Math.cos(degToRad(pitch)), //y
            r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), //z
        ])
       
        this._camera.position = newPosition
    }

    public HandleKeyPress({ key })
    {        
        const delta = 2
         
        switch( key )
        {
            case "KeyW":
                this._camera.MoveForward(delta)
                break;
            case "KeyA":
                this._camera.MoveLeft(delta)
                break;
            case "KeyS":
                this._camera.MoveBack(delta)
                break; 
            case "KeyD":
                this._camera.MoveRight(delta);
                break;      
        }
    }

    public HandleMouseMove({ offsetX, offsetY, rightMouseButtonDown })
    {
        const sensitivity = config.sensitivity

        let dPitch = offsetY * sensitivity
        let dYaw = offsetX * sensitivity 

        this._pitch += dPitch
        this._yaw += dYaw

        console.log('FPS desh pitch=%s , yaw=%s', this._pitch, this._yaw)

        if(rightMouseButtonDown)
            this.HandleCameraOrbit( this._pitch, this._yaw )
        else 
            this.HandleTestFPSCamera(dPitch,dYaw)
           //this.HandleFPSCamera( this._pitch, this._yaw )
    }

    public get Camera()
    {
        return this._camera
    }
}