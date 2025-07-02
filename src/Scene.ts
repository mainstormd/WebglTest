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

    private _effects = {   
        fog: new Fog({
            color: [0.5, 0.5, 0.5],
            start: 0.1, // параметр работает только для 0 мода
            end: 10.0, // параметр работает только для 0 мода
            density: 0.35, // параметр работают только для 1 и 2 мода, для него управлять расстояния нельзя
            mode: 0, // 
            isEnabled: this.IsFogEnabled
          }),

        directionalLight: new DirectionalLight({ 
            color:  [1.0, 1.0, 1.0], 
            direction: [1.0, 0.3, 0.5],
            ambientStrength:  0.1, 
            diffuseStrength:  1.0, 
            specularStrength: 0.5, 
        }),

        spotLight: new SpotLight({ 
            color:  [1.0, 1.0, 1.0], 
            position: [3.5, 0.5, -4.0],
            direction: m3.subtractVectors([3.5, 0.5, -4.0],  [0, 0.5, -4]),
            ambientStrength:  0.1, 
            diffuseStrength:  1.0, 
            specularStrength: 0.5, 
            constant: 1.0, 
            linear: 0.0014, 
            quadratic:  0.000007,
            cosOfCutoff: Math.cos(degToRad(12.5)),
            cosOfOuterCutoff: Math.cos(degToRad(27))
        }),

        pointLigts: [
            new PointLight({ 
                position: [3.5, 2.5, 1.0],
                color:  [1.0, 1.0, 1.0], 
                ambientStrength:  0.1, 
                diffuseStrength:  1.0, 
                specularStrength: 0.5, 
                constant: 1.0, 
                linear: 0.0014, 
                quadratic:  0.000007
            }),
            new PointLight({ 
                position: [-3.0, 0.5, -5.0],
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
                return this.effects.fog.isEnabled = this.IsFogEnabled
            }

            if(this._renderMode === RenderMode.SolidWireframe)
            {
                this._renderMode = RenderMode.Normales
                return this.effects.fog.isEnabled = this.IsFogEnabled
            }
            
            if(this._renderMode === RenderMode.Normales)
            {
                this._renderMode = RenderMode.Default
                return this.effects.fog.isEnabled = this.IsFogEnabled
            }

            if(this._renderMode === RenderMode.Default)
            {
                this._renderMode = RenderMode.NoFog
                return this.effects.fog.isEnabled = this.IsFogEnabled
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

    public get effects()
    {
        return this._effects
    }

}