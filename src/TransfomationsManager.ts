import { m3 } from "./Math/math"
import { Quaternion } from "./Math/Quaternion"

export class TransfomationsManager{

    private _modelMatrix:number[] = m3.IdentityMatrix()
    private quaternion = new Quaternion()

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
        // let q = new Quaternion(Math.cos(angle/2), 0, Math.sin(angle/2) * 0.1, 0)
        // let mat1 =  [1, 0, 0, 1,  0, 1, 0, 0,  0, 0, 1, 1,  0, 0, 0, 1]
        // let mat2 =  [1, 0, 0, -1,  0, 1, 0, 0,  0, 0, 1, -1,  0, 0, 0, 1]
        // let multres = m3.MultiplyMatrix(mat1 , q.matrix)
        
        // let matRes = m3.MultiplyMatrix(multres , mat2)

        // this._modelMatrix = m3.MultiplyMatrix(this._modelMatrix, matRes) 

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