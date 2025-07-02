
export enum FogMode
{
    'Linear' = 1,
    'Exp' = 2,
    'Exp2' = 3,
}

interface iFog
{ 
    color: [number, number, number],
    start: number, // параметр работает только для 0 мода
    end: number, // параметр работает только для 0 мода
    density: number, // параметр работают только для 1 и 2 мода, для него управлять расстояния нельзя
    mode: number, // 
    isEnabled: Boolean
}

export default class Fog
{
    private _fogFields:iFog
    
    constructor(fogArgs: iFog)
    {
        this._fogFields = fogArgs
    }

    get uniforms(): iFog
    {
        return this._fogFields
    }

    set isEnabled(isEnabled: Boolean)
    {
        this._fogFields.isEnabled = isEnabled
    }
}