import { glContext } from "../Utils/GLUtilities";

export class GLBuffer{

    protected _buffer : WebGLBuffer | null;

    constructor(bindingTarget : GLenum)
    {
        this._buffer = glContext.createBuffer();
        glContext.bindBuffer(bindingTarget, this._buffer);
    }

    get buffer() : WebGLBuffer | null
    {
       return this._buffer;
    }
}

