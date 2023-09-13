import { Camera } from "./Camera";
import { CameraController } from "./CameraController";
import { Coub } from "./Coub";
import { Engine } from "./Engine";
import InputSystem from "./InputSystem";

window.onload =  function ()
{
    let camera = new Camera([0, 10, -10])
    let cameraConroller = new CameraController(camera)
    let canvas = document.getElementById('glcanvas') as HTMLCanvasElement
    let inputSystem = new InputSystem(canvas, cameraConroller)
    let engine = new Engine(inputSystem)
    engine.DrawScence(camera)
    window.engine = engine; 

    //start animation
    requestAnimationFrame(animate)
}

let previous = Date.now()
//let times = 0

let coubs: Coub[] = []

for(let i = 1; i < 10; i++)    
{
    let coub = new Coub().Translate(i * 5, 0, 10)
    
    if( i % 2 === 0)
    {
        coub.isGradientColor(true)
    }   

    coubs.push(coub)
}    

function animate(time)
{
    let now = Date.now() 
    let duration = 16

    let engine = window.engine
    let inputSystem = engine.InputSystem
    let currentCamera = inputSystem.CameraController.Camera

    
    if((now - previous) / duration >= 1)
    {
       // times++
        previous = now
        engine.DrawScence(currentCamera, coubs.map( coub => coub.yRotate(0.1).RenderAssets )) 
    }
   
    //if(times !== 300)
    {
        requestAnimationFrame(animate)
    }

}

// document.addEventListener("keypress", KeyPressHandler)

// function KeyPressHandler(event)
// {
//     //Add drawScence function
//     let key = event.key
//     let engine = window.engine
//     let currentCamera = engine.Camera
//     let delta = 2;

//     switch( key )
//     {
//         case "w":
//             currentCamera.slide( 0, 0, -delta)
//             break;
//         case "a":
//             currentCamera.slide(-delta) 
//             break;
//         case "s":
//             currentCamera.slide( 0, 0, delta )
//             break; 
//         case "d":
//             currentCamera.slide(delta);
//             break;   
//         case "e":
//             currentCamera.TaitBryanAngles(delta,0);
//             break; 
//         case "r":
//             currentCamera.TaitBryanAngles(0,delta);
//             break; 
//     }
    
//    engine.DrawScence(currentCamera)
// }

// let canvas = document.getElementById('glcanvas')
// canvas?.addEventListener("mousemove", mouseHandlerFirstPersonCamera)

// let lastX = 0;
// let lastY = 0;

// let yaw = 270;
// let pitch = -20;

// let firstMouse = true;

// function mouseHandlerFirstPersonCamera( event )
// {
//     let xpos = event.x;
//     let ypos = event.y;

//     let engine = window.engine
//     let currentCamera = engine.Camera

//     if (firstMouse)
//     {
//         lastX = xpos;
//         lastY = ypos;

//         firstMouse = false;

//         yaw = 270;
//         pitch = 70;
  
//     }
  
//     let xoffset = xpos - lastX;
//     let yoffset = lastY - ypos; 
   
//     lastX = xpos;
//     lastY = ypos;

//     let sensitivity = 0.5;
   
//     xoffset *= sensitivity;
//     yoffset *= sensitivity;

//      yaw   += xoffset;
//      pitch += yoffset;

//     if(pitch > 89.0)
//         pitch = 89.0;
//     if(pitch < -89.0)
//         pitch = -89.0;
    
//     let newDirection = m3.normalize([
//         Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
//         Math.sin(degToRad(pitch)),
//         Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
//     ])
    
//     let direction = m3.additionVectors(currentCamera._cameraPosition, newDirection)
//     console.log('pitch=%s, yaw=%s', pitch, yaw)
//     ///Странный баг
//     currentCamera = new Camera(currentCamera._cameraPosition, direction)

//    engine.DrawScence(currentCamera)
// }

// function mouseHandlerOrbitCamera( event )
// {
//     //orbit camera
//     let xpos = event.x;
//     let ypos = event.y;

//     let engine = window.engine
//     let currentCamera = engine.Camera

//     if (firstMouse)
//     {
//         lastX = xpos;
//         lastY = ypos;
//         firstMouse = false;
//     }
  
//     let xoffset = xpos - lastX;
//     let yoffset = lastY - ypos;
     
//     lastX = xpos;
//     lastY = ypos;

//     let sensitivity = 0.5;
//     xoffset *= sensitivity;
//     yoffset *= sensitivity;
    
//      yaw   += xoffset;
//      pitch += yoffset;

//      if(pitch > 89.0)
//         pitch = 87.0;
    
//      if(pitch < 0)
//         pitch = 4;
  
//     let r = m3.length(currentCamera._cameraPosition)

//     let newPosition = ([
//         r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)), //x
//         r * Math.cos(degToRad(pitch)), //y
//         r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), //z
//     ])
//     console.log('pitch=%s, yaw=%s', pitch, yaw)
//     ///Странный баг
//     currentCamera = new Camera(newPosition)

//     engine.DrawScence(currentCamera)
// }


// canvas?.addEventListener('mousedown', mouseDownHandler)
// canvas?.addEventListener('mouseup', mouseUpHandler)
// canvas?.addEventListener('contextmenu', (event) => event.preventDefault())

// function mouseDownHandler( event )
// {
//     console.log('mouseDownHandler', event.button)

//     if(event.button === 2)
//     {
//         canvas?.removeEventListener("mousemove",mouseHandlerFirstPersonCamera)
//         canvas?.addEventListener('mousemove', mouseHandlerOrbitCamera)
//     }
// }

// function mouseUpHandler( event )
// {
//     console.log('mouseup', event.button)

//     if(event.button === 2)
//     {
//         canvas?.removeEventListener("mousemove",mouseHandlerOrbitCamera)
//         canvas?.addEventListener('mousemove', mouseHandlerFirstPersonCamera)
//     }
// }
