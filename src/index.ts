import { Camera } from "./Camera"
import { CameraController } from "./CameraController"
import { Render } from "./Render"
import { EventManager } from "./EventSystem/EventManager"
import InputSystem from "./InputSystem"
import { Scene } from "./Scene"

window.render = new Render()

window.onload = function ()
{
    // coordinates to see  on texture [3,1.1,1],[5,1.1,1]
    let camera = new Camera([0, 10, -10])
    let eventManager = new EventManager()
  
    let canvas = document.getElementById('glcanvas') as HTMLCanvasElement
    new InputSystem(canvas, eventManager)
    
    window.cameraController = new CameraController(camera, eventManager)
    window.scene = new Scene(eventManager)
    //start animation
    requestAnimationFrame(animate)
}

let previous = Date.now()
let times = 0

function animate(time)
{
    const now = Date.now() 
    const duration = 16

    let render = window.render
    let currentCamera = window.cameraController.Camera
    let scene = window.scene

    if( (now - previous) / duration >= 1)
    {
        times++
        previous = now
        scene.Update(time)
        window.cameraController.Update()
        render.DrawScence(currentCamera, scene.GetRenderAssets(), scene.IsFogEnabled) 
    }
   
    //if(times !== 300)
    {
        requestAnimationFrame(animate)
    }
}

