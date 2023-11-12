import { Camera } from "./Camera";
import { CameraController } from "./CameraController";
import { Coub } from "./Coub";
import { Render } from "./Render";
import { EventManager } from "./EventSystem/EventManager";
import InputSystem from "./InputSystem";
import { Plane } from "./Plane";

window.onload = function ()
{

    let camera = new Camera([0, 10, -10])
    let eventManager = new EventManager()
  
    let canvas = document.getElementById('glcanvas') as HTMLCanvasElement
  
    new InputSystem(canvas, eventManager)
    
    window.cameraController = new CameraController(camera, eventManager)
    window.render = new Render()
  
    //start animation
    requestAnimationFrame(animate)
    
}

let coubs : Coub[] = []
let staticObjects = [new Plane(), new Coub()]

for(let i = 1; i < 10; i++)    
{
    let coub = new Coub().Translate(i * 5, 0, 10)
    
    if( i % 2 === 0)
    {
        coub.isGradientColor(true)
    }   

    coubs.push(coub)
}  


let previous = Date.now()
let times = 0

function animate(time)
{
    let now = Date.now() 
    let duration = 16

    let render = window.render
    let currentCamera = window.cameraController.Camera
    
    if( (now - previous) / duration >= 1)
    {
        times++
        previous = now
        
        let animateCoubsAssets = coubs.map( coub => coub.yRotate(0.1).RenderAssets )
        let staticAssets = staticObjects.map( item => item.RenderAssets )   
        let sceneObjects = animateCoubsAssets.concat( staticAssets as any )
        
        render.DrawScence(currentCamera, sceneObjects) 
    }
   
    //if(times !== 300)
    {
        requestAnimationFrame(animate)
    }
}

