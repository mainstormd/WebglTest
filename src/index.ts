window.onload =  function (){
    let engine = new MainProgram.Engine()
    
    let currentCamera = engine.Camera
    
   // currentCamera.yaw(-20);
    //currentCamera.pitch(20);

   // currentCamera.yaw(20);
   // currentCamera.pitch(-20);

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
        case "q":
       { 
           let target = currentCamera._targetCoordinate; 
           target[0] += 1; 
           currentCamera = new MainProgram.Camera(currentCamera._cameraPosition, target)
       }
        break;                       
    }
    
   engine.DrawScence(currentCamera)
}

let canvas = document.getElementById('glcanvas')
canvas?.addEventListener("mousemove", mouseHandler)

let lastX = 0;
let lastY = 0;
let firstMouse = true;
function mouseHandler( event : any)
{
    let yaw = 0;
    let pitch = 0;

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

   
    currentCamera.yaw(-yaw);
    currentCamera.pitch(pitch);
   
  /* my idea
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

    let additionVectors = function(a: any, b: any)
    {
        return  [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }  

    let multiply = function(a: any, b: any)
    {
        return  [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
    }  

    let newDirection = normalize([
            Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
            Math.sin(degToRad(pitch)),
            Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
    ])
 
    let newTarget = additionVectors(currentCamera._targetCoordinate, newDirection)
  
    console.log('site: cameraTarget old', currentCamera._targetCoordinate)   
    console.log('site: deltaDirection', newDirection)
    console.log('site: new target', newTarget)  

    //let target = currentCamera._targetCoordinate; 
    //target[1] += 0.1; 

    ///Странный баг
    engine.Camera  = new MainProgram.Camera(currentCamera._cameraPosition, newDirection)
    currentCamera = engine.Camera
    console.log('site: camera', currentCamera)
    console.log('site: camera Engine', engine.Camera)
    //debugger
    */
   engine.DrawScence(currentCamera)
}