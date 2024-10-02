import { glContext } from "../Utils/GLUtilities";

export class GLBuffer<T>{

    protected _buffer : WebGLBuffer | null;
    protected _data : T[]; 

    constructor(bindingTarget : GLenum, data : T[])
    {
        this._buffer = glContext.createBuffer();
        glContext.bindBuffer(bindingTarget, this._buffer);
        
        //maybe clear link later?
        this._data = data
    }

    get buffer() : WebGLBuffer | null
    {
       return this._buffer;
    }

    get data() : T[]
    {
        return this._data
    }
}

