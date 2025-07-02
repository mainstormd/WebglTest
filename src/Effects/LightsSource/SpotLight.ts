import Light from "./Light"
import { LightType } from "./LightEnum"

interface iSpotLight
{ 
    color: [number, number, number], 
    position: [number, number, number],
    direction: [number, number, number],
    ambientStrength: number, 
    diffuseStrength: number, 
    specularStrength: number, 
    constant: number, 
    linear: number, 
    quadratic: number,
    cosOfCutoff: number,
    cosOfOuterCutoff: number
}

export default class SpotLight extends Light 
{
    private _spotLigtFields: iSpotLight
    
    constructor(pointLightArgs: iSpotLight)
    {
        super(LightType.Point)
        this._spotLigtFields = pointLightArgs
    }

    get uniforms(): iSpotLight
    {
        return this._spotLigtFields
    }
}