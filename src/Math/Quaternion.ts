
export class Quaternion{

    private  _w : number
    private  _x : number
    private  _y : number
    private  _z : number
    
    constructor(w : number = 1, x : number = 0, y : number = 0, z : number = 0)
    {
        this._w = w
        this._x = x
        this._y = y
        this._z = z
    }
    
    public length() : number
    {
        const length = Math.sqrt(
            this._w * this._w + 
            this._x * this._x + 
            this._y * this._y +
            this._z * this._z 
        )
        
        if (length < 0.00001) {
            return 0;
        } 

        return length;
    }

    public normalize() : Quaternion
    {
        const length = this.length()
        
        if(length === 0)
        {
            throw new Error("normalize: length quaternion is 0")
        }

        return new Quaternion(
            this._w / length,
            this._x / length,
            this._y / length,
            this._z / length,
        )
    }

    public addition(q : Quaternion) : Quaternion
    {
        return new Quaternion(
            this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
            this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
            this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z,
            this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x
        ) 
    }

    public multiply(q : Quaternion) : Quaternion
    {
        return new Quaternion(
            this.w + q.w,
            this.w + q.x,
            this.w + q.y,
            this.w + q.z
        ) 
    }
    
    /*
    сопряженный
    */
    public conjugate() : Quaternion
    {
        return new Quaternion(this._w, -this._x, -this._y, -this._z)
    }

    /*
    обратный
    */
    public inverse() : Quaternion
    {
        const length = this.length()

        if(length === 0)
        {
            throw new Error("inverse:length quaternion is 0")
        }

        return new Quaternion(this.w / length, -this.x / length, -this.y / length, -this.z / length)
    }

    public get matrix() : number[]
    {
        const quadraticX = this.x * this.x
        const quadraticY = this.y * this.y
        const quadraticZ = this.z * this.z
        
        const wx = this.w * this.x
        const wy = this.w * this.y
        const wz = this.w * this.z
        const xy = this.x * this.y
        const xz = this.x * this.z
        const yz = this.y * this.z
       
        return [
            1 - 2 * quadraticY - 2 * quadraticZ,                     2 * xy - 2 * wz,                    2 * xz + 2 * wy,  0,
                                2 * xy + 2 * wz, 1 - 2 * quadraticX - 2 * quadraticZ,                    2 * yz - 2 * wx,  0,
                                2 * xz - 2 * wy,                     2 * yz + 2 * wx, 1 - 2 * quadraticX - 2 * quadraticY, 0,
                                              0,                                   0,                                   0, 1
        ]
    }

    public get w() 
    {
        return this._w
    }

    public get x() 
    {
        return this._x
    }

    public get y() 
    {
        return this._y
    }

    public get z() 
    {
        return this._z
    }
}