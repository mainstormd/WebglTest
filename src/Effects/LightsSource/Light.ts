import { LightType } from "./LightEnum";

export default abstract class Light
{
    private _type: LightType;

    constructor(type:LightType)
    {
        this._type = type
    }


    get LightType()
    {
        return this._type
    }

}