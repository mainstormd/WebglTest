import Light from "./Light"
import { LightType } from "./LightEnum"

interface iPointLight
{
    position: [number, number, number],
    color:  [number, number, number], 
    ambientStrength:  number, 
    diffuseStrength:  number, 
    specularStrength: number, 
    constant: number, 
    linear: number, 
    quadratic: number  
}

export default class PointLight extends Light 
{
    private _pointLigtFields:iPointLight
    
    constructor(pointLightArgs: iPointLight)
    {
        super(LightType.Point)
        this._pointLigtFields = pointLightArgs
    }

    get uniforms(): iPointLight
    {
        return this._pointLigtFields
    }
}