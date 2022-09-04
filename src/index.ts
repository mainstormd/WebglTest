let additionVectors = function(a: any, b: any){
    return  [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

let degToRad = (d : any ) => d * Math.PI / 180;

let normalize = function normalize(v : any) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
}

let subtractVectors = function (a : any, b : any) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

window.onload =  function (){
    let engine = new MainProgram.Engine()

    //engine.Camera = new MainProgram.Camera([-1.5, -86, 122])
    engine.Camera = new MainProgram.Camera([0, 95, 10])
    let currentCamera = engine.Camera
    
    engine.DrawScence(currentCamera)
    window.engine = engine; 
}

document.addEventListener("keypress", KeyPressHandler)
let degree = 0
function KeyPressHandler(event : any)
{
    //Add drawScence function
    let key = event.key
    let engine = window.engine
    let currentCamera = engine.Camera
    let delta = 2;

    switch(key)
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
        case "q":
        { 
            let degToRad = (d : any ) => d * Math.PI / 180;

            let length = function(v: any) : number
            {
                let l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
                if (l > 0.00001) {
                    return l;
                } else {
                    return 0;
                }
            }  

            let subtractVectors = function (a : any, b : any) {
                return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
            }

            let r = length(currentCamera._cameraPosition)
            degree += 1
            let yaw = 270;
            let pitch = degree;

            let directionInCoordinateCamera = ([
                r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)),
                r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), 
                r * Math.cos(degToRad(pitch))
            ])

            let direction = subtractVectors(directionInCoordinateCamera, currentCamera._cameraPosition)
            console.log('mouse test', directionInCoordinateCamera)
            currentCamera = new MainProgram.Camera(directionInCoordinateCamera)
        }
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

         //yaw = 270;
         //pitch = 30;
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
    
/*
    let r = length(currentCamera._cameraPosition)

    let newDirectionSpherical = ([
        r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)),
        r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), 
        r * Math.cos(degToRad(pitch))
    ])

    let direction = subtractVectors(newDirectionSpherical, currentCamera._cameraPosition)
*/
    let length = function(v: any) : number
    {
        let l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (l > 0.00001) {
            return l;
        } else {
            return 0;
        }
    }
    let newDirection = normalize([
        Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
        Math.sin(degToRad(pitch)),
        Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
    ])
    
    let direction = additionVectors(currentCamera._cameraPosition, newDirection)
    console.log('pitch=%s, yaw=%s', pitch, yaw)
    ///Странный баг
    currentCamera = new MainProgram.Camera(currentCamera._cameraPosition, direction)
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

    let length = function(v: any) : number
    {
        let l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (l > 0.00001) {
            return l;
        } else {
            return 0;
        }
    } 

    let r = length(currentCamera._cameraPosition)

    let newPosition = ([
        r * Math.sin(degToRad(pitch)) * Math.cos(degToRad(yaw)),
        r * Math.sin(degToRad(pitch)) * Math.sin(degToRad(yaw)), 
        r * Math.cos(degToRad(pitch))
    ])

    ///Странный баг
    currentCamera = new MainProgram.Camera(newPosition)
    engine.Camera = currentCamera
    
   engine.DrawScence(currentCamera)
}