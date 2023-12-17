import { m3 } from "./Math/math"


export class TransfomationsManager{

    private _modelMatrix:number[] = m3.IdentityMatrix()

    Translate( tx : number, ty : number, tz : number )
    {
       this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.translation(tx, ty, tz))
    }

    Scale( sx : number, sy : number, sz : number)
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.scaling(sx, sy, sz))
    }

    xRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.xRotation(angle))
    }

    yRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.yRotation(angle))
    }

    zRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.zRotation(angle))
    }

    get ModelMatrix()
    {
        return this._modelMatrix
    }
}