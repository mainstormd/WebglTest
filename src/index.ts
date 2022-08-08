window.onload =  function (){
    let engine = new MainProgram.TestEngine()
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
    let position = currentCamera._cameraPosition;
    let delta = 2;
  
    switch(key)
    {
        case "w":
            currentCamera.slide( 0, 0, -delta)
            break;
        case "a":
            currentCamera.slide(delta) 
            break;
        case "s":
            currentCamera.slide( 0, 0, delta )
            break; 
        case "d":
            currentCamera.slide(-delta);
            break;                    
    }
    
   engine.DrawScence(currentCamera)
}