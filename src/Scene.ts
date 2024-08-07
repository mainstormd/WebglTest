import { EventManager } from "./EventSystem/EventManager";
import { glContext } from "./Utils/GLUtilities";
import { Coub } from "./Objects/Coub";
import { Plane } from "./Objects/Plane";
import { Sphere } from "./Objects/Sphere";
import { Cylinder } from "./Objects/Cylinder";

export class Scene
{
    private _eventBus: EventManager 

    private _staticObjects = [new Plane(), new Coub().Translate(5,0,5) ] 
    private _dynamicObjects : Coub [] = []
    private _animateObjects = [new Cylinder(), new Sphere(2)]

    private _renderMode : GLenum = glContext.TRIANGLES

    constructor(eventBus: EventManager)
    {
       this._eventBus = eventBus
       this._dynamicObjects = this.GenerateCoubs()
       this._eventBus.Subscribe('keypress', this.HandleKeyPress.bind(this))
    }

    private HandleKeyPress({ key })
    {
        if(key ===  "KeyF")
        {
            if(this._renderMode === glContext.TRIANGLES)
            {
                this._renderMode = glContext.LINES
            }
            else
            {
                this._renderMode = glContext.TRIANGLES
            }
        }
    }

    private GenerateCoubs() : Coub []
    {
        let coubs : Coub [] =  []

        for(let i = 1; i < 10; i++)    
        {
            let coub = new Coub().Translate(i * 5, 0, 10)
            
            if( i % 2 === 0)
            {
                coub.isGradientColor(true)
            }   
        
            coubs.push(coub)
        }  

        return coubs
    }

    public Update(time : number)
    {
        this._dynamicObjects.forEach( item => item.yRotate(0.1))
        this._animateObjects.forEach( item => item.Animate(time))
        return this
    }

    public GetRenderAssets()
    {
        let renderAssets : any [] = []
        //renderAssets.push(...this._dynamicObjects.map(item => item.GetRenderAssets(this._renderMode)))
        renderAssets.push(...this._staticObjects.map(item => item.GetRenderAssets(this._renderMode)))
        //renderAssets.push(...this._animateObjects.map(item => item.GetRenderAssets(this._renderMode)))
        return renderAssets
    }

}