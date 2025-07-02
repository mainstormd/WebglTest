import Light from "./Light"
import { LightType } from "./LightEnum"

interface iDirectionalLight
{ 
    color: [number, number, number], 
    direction: [number, number, number],
    ambientStrength: number, 
    diffuseStrength: number, 
    specularStrength: number 
}

export default class DirectionalLight extends Light 
{
    private _directionalLigtFields:iDirectionalLight
    
    constructor(pointLightArgs: iDirectionalLight)
    {
        super(LightType.Directional)
        this._directionalLigtFields = pointLightArgs
    }

    get uniforms(): iDirectionalLight
    {
        return this._directionalLigtFields
    }
}