import { Camera } from "./Camera";
import { degToRad, Engine, m3 } from "./Engine";

window.onload =  function (){
    let engine = new Engine()

    //engine.Camera = new MainProgram.Camera([-1.5, -86, 122])
    engine.Camera = new Camera([0, 95, 10])
    let currentCamera = engine.Camera
    
    engine.DrawScence(currentCamera)
    window.engine = engine; 
}

document.addEventListener("keypress", KeyPressHandler)

function KeyPressHandler(event : any)
{
    //Add drawScence function
    let key = event.key
    let engine = window.engine
    let currentCamera = engine.Camera
    let delta = 2;

    switch( key )
    {
        case "w":
            currentCamera.slide( 0, 0, -delta)
            break;
        case "a":
            currentCamera.slide(-delta) 
            break;
        case "s":
            currentCamera.slide( 0, 0, delta )
            break; 
        case "d":
            currentCamera.slide(delta);
            break;   
        case "e":
            currentCamera.pitch(delta);
            break; 
        case "r":
            currentCamera.yaw(delta);
            break; 
    }
    
   engine.DrawScence(currentCamera)
}

let canvas = document.getElementById('glcanvas')
canvas?.addEventListener("mousemove", mouseHandlerOrbitCamera)

let lastX = 0;
let lastY = 0;

let yaw = 270;
let pitch = -20;

let firstMouse = true;

function mouseHandler( event : any)
{
    let xpos = event.x;
    let ypos = event.y;

    let engine = window.engine
    let currentCamera = engine.Camera

    if (firstMouse)
    {
        lastX = xpos;
        lastY = ypos;

        firstMouse = false;

        yaw = 270;
        pitch = 70;
    }
  
    let xoffset = xpos - lastX;
    let yoffset = lastY - ypos; 
    lastX = xpos;
    lastY = ypos;

    let sensitivity = 0.5;
    xoffset *= sensitivity;
    yoffset *= sensitivity;

     yaw   += xoffset;
     pitch += yoffset;

    if(pitch > 89.0)
        pitch = 89.0;
    if(pitch < -89.0)
        pitch = -89.0;
    
    let newDirection = m3.normalize([
        Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
        Math.sin(degToRad(pitch)),
        Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
    ])
    
    let direction = m3.additionVectors(currentCamera._cameraPosition, newDirection)
    console.log('pitch=%s, yaw=%s', pitch, yaw)
    ///Странный баг
    currentCamera = new Camera(currentCamera._cameraPosition, direction)
    engine.Camera = currentCamera

   engine.DrawScence(currentCamera)
}

function mouseHandlerOrbitCamera( event : any)
{
    //orbit camera
    let xpos = event.x;
    let ypos = event.y;

    let engine = window.engine
    let currentCamera = engine.Camera

    if (firstMouse)
    {
        lastX = xpos;
        lastY = ypos;
        firstMouse = false;
    }
  
    let xoffset = xpos - lastX;
    let yoffset = lastY - ypos;
     
    lastX = xpos;
    lastY = ypos;

    let sensitivity = 0.5;
    xoffset *= sensitivity;
    yoffset *= sensitivity;
    
     yaw   += xoffset;
     pitch += yoffset;

    if(pitch > 89.0)
        pitch = 89.0;
    if(pitch < -89.0)
        pitch = -89.0;
  
    let r = m3.length(currentCamera._cameraPosition)

    let newPosition = ([
        r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)),
        r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), 
        r * Math.cos(degToRad(pitch))
    ])

    ///Странный баг
    currentCamera = new Camera(newPosition)
    engine.Camera = currentCamera
    
   engine.DrawScence(currentCamera)
}