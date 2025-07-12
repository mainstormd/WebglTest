import { EventManager } from "./EventSystem/EventManager";
import { Coub } from "./Objects/Coub";
import { Plane } from "./Objects/Plane";
import { Sphere } from "./Objects/Sphere";
import { Cylinder } from "./Objects/Cylinder";
import { TexturedImage } from "./Objects/TexturedImage";
import { TexturedSphere } from "./Objects/TexturedSphere";
import { SohoTexturedSphere } from "./Objects/SohoTexturedSphere";
import { DoubleTexturedImage } from "./Objects/DoubleTexturedImage";
import Fog from "./Effects/Fog";
import DirectionalLight from "./Effects/LightsSource/DirectionalLight";
import SpotLight from "./Effects/LightsSource/SpotLight";
import { degToRad, m3 } from "./Math/math";
import PointLight from "./Effects/LightsSource/PointLight";
import { PlaneBumpMapping } from "./Objects/PlaneBumpMapping";

export enum RenderMode {
    NoFog = 'noFog',
    SolidWireframe = 'solidWireframe',
    Normales = 'normales',
    Default = 'default'
}

export class BumpScene
{
    private _eventBus: EventManager 
    private _renderMode : RenderMode = RenderMode.Default

    private _staticObjects = [
         new Plane(), 
         new Coub().Translate(7.5, 1.5, 1.0).Scale(0.3, 0.3, 0.3), // image light
    ]

    private _texturedObjects = [new PlaneBumpMapping()]

    private _effects = {   
        pointLigts: [
            new PointLight({ 
                position: [7.5, 1.5, 1.0],
                color:  [1.0, 1.0, 1.0], 
                ambientStrength:  0.1, 
                diffuseStrength:  1.0, 
                specularStrength: 0.5, 
                constant: 1.0, 
                linear: 0.0014, 
                quadratic:  0.000007
            })
        ]
    }


    constructor(eventBus: EventManager)
    {
       this._eventBus = eventBus
       this._eventBus.Subscribe('keypress', this.HandleKeyPress.bind(this))
    }

    private HandleKeyPress({ key })
    {
        if(key ===  "KeyF")
        {
            if(this._renderMode === RenderMode.NoFog)
            {
                this._renderMode = RenderMode.SolidWireframe
            }

            if(this._renderMode === RenderMode.SolidWireframe)
            {
                this._renderMode = RenderMode.Normales
            }
            
            if(this._renderMode === RenderMode.Normales)
            {
                this._renderMode = RenderMode.Default
            }

            if(this._renderMode === RenderMode.Default)
            {
                this._renderMode = RenderMode.NoFog
            }
        }
    }

    public Update(time)
    {
        
    }

    public GetRenderAssets()
    {
        let renderAssets : any [] = []

        if(this._texturedObjects.every(item => item.isReadyToRender))
        {
            renderAssets.push(...this._texturedObjects.map(item => item.GetRenderAssets()))
        }

         renderAssets.push(...this._staticObjects.map(item => item.GetRenderAssets()))

        // if(this._renderMode === RenderMode.SolidWireframe)
        // {
        //     renderAssets.push(...this._staticObjects.map(item => item.GetWireframeRenderAssets()))
        // }
        
        // if(this._renderMode === RenderMode.Normales)
        // {
        //     renderAssets.push(...this._staticObjects.map(item => item.GetNormalsRenderAssets()))
        // }
        //renderAssets.push(...[new Sphere(3,0.5).GetRenderLineOfNormalsAssets()])renderAssets.push(...[new Coub().Translate(0.0, 0.5, -3.0).GetRenderLineOfNormalsAssets()])
        return renderAssets
    }

    public get effects()
    {
        return this._effects
    }

}