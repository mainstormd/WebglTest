window.onload =  function (){
    let engine = new MainProgram.Engine()
    
    let currentCamera = engine.Camera
    
    //currentCamera.yaw(-20);
    //currentCamera.pitch(20);

    //currentCamera.yaw(20);
    //currentCamera.pitch(-20);

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
        currentCamera.pitch(-delta);
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
    //console.log('x=%s, y=%s',xoffset,yoffset)
    let sensitivity = 0.1;
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

    let newDirection = [
            Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
            Math.sin(degToRad(pitch)),
            Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
    ]

    let newTarget = normalize(newDirection)
    let camera = new MainProgram.Camera(currentCamera._cameraPosition, newTarget)
   */ engine.DrawScence(currentCamera)
}