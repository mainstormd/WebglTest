import { EventManager } from "./EventSystem/EventManager";
import { Coub } from "./Objects/Coub";
import { Plane } from "./Objects/Plane";
import { Sphere } from "./Objects/Sphere";
import { Cylinder } from "./Objects/Cylinder";
import { TexturedImage } from "./Objects/TexturedImage";
import { TexturedSphere } from "./Objects/TexturedSphere";
import { SohoTexturedSphere } from "./Objects/SohoTexturedSphere";
import { DoubleTexturedImage } from "./Objects/DoubleTexturedImage";

export enum RenderMode {
    NoFog = 'noFog',
    SolidWireframe = 'solidWireframe',
    Normales = 'normales',
    Default = 'default'
}

export class Scene
{
    private _eventBus: EventManager 
    private _renderMode : RenderMode = RenderMode.Default

    private _staticObjects = [
        new Plane(), 
        
        new Coub().Translate(0.0, 0.5, -5.0),
        new Coub().Translate(-2.0, 0.5, -4.0),
        new Coub().Translate(2.0, 0.5, -4.0),

        new Coub().Translate(0.0, 0.5, -7.0),
        new Coub().Translate(-2.0, 0.5, -6.0),
        new Coub().Translate(2.0, 0.5, -6.0),

        new Coub().Translate(0.0, 0.5, -9.0),
        new Coub().Translate(-2.0, 0.5, -8.0),
        new Coub().Translate(2.0, 0.5, -8.0),

        new Coub().Translate(0.0, 0.5, -11.0),
        new Coub().Translate(-2.0, 0.5, -10.0),
        new Coub().Translate(2.0, 0.5, -10.0),

        new Coub().Translate(0.0, 0.5, -13.0),
        new Coub().Translate(-2.0, 0.5, -12.0),
        new Coub().Translate(2.0, 0.5, -12.0),

        new Coub().Translate(0.0, 0.5, -15.0),
        new Coub().Translate(-2.0, 0.5, -14.0),
        new Coub().Translate(2.0, 0.5, -14.0),

        new Coub().Translate(0.0, 0.5, -17.0),
        new Coub().Translate(-2.0, 0.5, -16.0),
        new Coub().Translate(2.0, 0.5, -16.0),
        new Coub().Translate(2.0, 0.5, -16.0),

        new Coub().Translate(3.5, 1.0, 1.0).Scale(0.3, 0.3, 0.3), // image light
        new Coub().Translate(-3.0, 0.5, -5.0).Scale(0.3, 0.3, 0.3), //coubs light
        new Coub().Translate(3.5, 0.5, -4.0).Scale(0.3, 0.3, 0.3),  // spot light     
    ]

    private _dynamicObjects : Coub [] = []
    private _animateObjects = [new Cylinder(), new Sphere(3,0.5)]
    private _texturedObjects = [new TexturedImage(), new TexturedSphere(), new DoubleTexturedImage()]

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
            if(this._renderMode === RenderMode.NoFog)
            {
                this._renderMode = RenderMode.SolidWireframe
                return
            }

            if(this._renderMode === RenderMode.SolidWireframe)
            {
                this._renderMode = RenderMode.Normales
                return
            }
            
            if(this._renderMode === RenderMode.Normales)
            {
                this._renderMode = RenderMode.Default
                return
            }

            if(this._renderMode === RenderMode.Default)
            {
                this._renderMode = RenderMode.NoFog
                return
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

        if(this._texturedObjects.every(item => item.isReadyToRender))
        {
            renderAssets.push(...this._texturedObjects.map(item => item.GetRenderAssets()))
        }

        renderAssets.push(...this._dynamicObjects.map(item => item.GetRenderAssets()))
        renderAssets.push(...this._staticObjects.map(item => item.GetRenderAssets()))
        renderAssets.push(...this._animateObjects.map(item => item.GetRenderAssets()))

        if(this._renderMode === RenderMode.SolidWireframe)
        {
            renderAssets.push(...this._staticObjects.map(item => item.GetWireframeRenderAssets()))
            renderAssets.push(...this._animateObjects.map(item => item.GetWireframeRenderAssets()))
        }
        
        if(this._renderMode === RenderMode.Normales)
        {
            renderAssets.push(...this._staticObjects.map(item => item.GetNormalsRenderAssets()))
            renderAssets.push(...this._animateObjects.map(item => item.GetNormalsRenderAssets()))
        }
        //renderAssets.push(...[new Sphere(3,0.5).GetRenderLineOfNormalsAssets()])renderAssets.push(...[new Coub().Translate(0.0, 0.5, -3.0).GetRenderLineOfNormalsAssets()])
        return renderAssets
    }

    public get IsFogEnabled() : boolean
    {
        return this._renderMode !== RenderMode.NoFog
    }

}