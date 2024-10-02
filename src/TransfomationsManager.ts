import { m3 } from "./Math/math"

export class TransfomationsManager{

    private _modelMatrix:number[] = m3.IdentityMatrix()

    Translate( tx : number, ty : number, tz : number )
    {
       this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.translation(tx, ty, tz))
       return this
    }

    Scale( sx : number, sy : number, sz : number)
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.scaling(sx, sy, sz))
        return this
    }

    xRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.xRotation(angle))
        return this
    }

    yRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.yRotation(angle))
        return this
    }

    zRotate( angle : number )
    {
        this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix , m3.zRotation(angle))
        return this
    }

    get ModelMatrix()
    {
        return this._modelMatrix
    }
}