import { glContext } from "../Utils/GLUtilities"

export class Shader{
   
    private _shader:  WebGLShader | null

    constructor( shaderType : GLenum, shaderSource : string)
    {
        this._shader = glContext.createShader(shaderType)
        
        if(this._shader == null)
        {
            throw "Can't init shaders"  
        }

        glContext.shaderSource(this._shader, shaderSource)
        glContext.compileShader(this._shader)
       
        const compileStatus = glContext.getShaderParameter(this._shader, glContext.COMPILE_STATUS)
       
        if(!compileStatus)
        {
            const infoLog = glContext.getShaderInfoLog(this._shader)
            throw "Shader error log: \n" + infoLog
        }
    }

    public get shader() : WebGLShader
    {
        if(this._shader == null)
        {
            throw "Can't init shaders"  
        }

        return this._shader
    }

}