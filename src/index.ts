
window.onload =  function (){
    let engine = new MainProgram.Engine()
    engine.DrawScence(engine.Camera)
    window.engine = engine; 
}

document.addEventListener("keypress", KeyPressHandler)

function KeyPressHandler(event : any)
{
    //Add drawScence function
    let key = event.key
    let engine = window.engine
    let currentCamera = engine.Camera
    let delta = 0.3;
  
    switch(key)
    {
        case "w":
            currentCamera.slide( undefined, undefined, -delta)
            break;
        case "a":
            currentCamera.slide(-delta); 
            break;
        case "s":
            currentCamera.slide( undefined, undefined, delta )
            break; 
        case "d":
            currentCamera.slide(delta);
            break;                    
    }
    
   engine.DrawScence(currentCamera)
}