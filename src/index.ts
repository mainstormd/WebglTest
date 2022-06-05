
window.onload =  function (){
    let engine = new MainProgram.Engine()
    engine.DrawScence(null)
    window.engine = engine; 
}

document.addEventListener("keypress", KeyPressHandler)

function KeyPressHandler(event : any)
{
    //Add drawScence function
    let key = event.key
    let engine = window.engine
    let currentCameraPosition = engine.OldCameraPosition
    let delta = 3;
    switch(key)
    {
        case "w":
            currentCameraPosition[2] = currentCameraPosition[2] + delta 
            break;
        case "a":
            currentCameraPosition[0] = currentCameraPosition[0] - delta; 
            break;
        case "s":
            currentCameraPosition[2] = currentCameraPosition[2] - delta
            break; 
        case "d":
            currentCameraPosition[0] = currentCameraPosition[0] + delta;
            break;                    
    }
    
   engine.DrawScence(currentCameraPosition)
}