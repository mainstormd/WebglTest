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
    let delta = 2;
    let angle = currentCamera._angle;

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
        case "f":
            currentCamera.roll(delta);
            break;                        
    }
    
   engine.DrawScence(currentCamera)
}