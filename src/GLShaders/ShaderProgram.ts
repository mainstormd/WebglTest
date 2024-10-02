import { glContext } from "../Utils/GLUtilities"
import { Shader } from "./Shader";

export class ShaderProgram{

    private _shaderProgram : WebGLProgram | null
    
    constructor(VERTEX_SHADER_SOURCE: string, FRAGMENT_SHADER_SOURCE: string)
    {
        this._shaderProgram = glContext.createProgram()

        let vertexShader = new Shader(glContext.VERTEX_SHADER, VERTEX_SHADER_SOURCE).shader;
        let fragmentShader = new Shader(glContext.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE).shader;  

        if(this._shaderProgram == null)
        {
            throw "Can't init shader program"
        }

        // прикрепляем к ней шейдеры
        glContext.attachShader(this._shaderProgram , vertexShader)
        glContext.attachShader(this._shaderProgram, fragmentShader)
        // связываем программу с контекстом webgl
        glContext.linkProgram(this._shaderProgram)
        this.validate()
    }

    private validate() : void
    {
        if(this._shaderProgram == null)
        {
            throw "Can't init shader program"
        }

        if(!glContext.getProgramParameter(this._shaderProgram, glContext.LINK_STATUS))
        {
            console.error(glContext.getProgramInfoLog(this._shaderProgram));
            throw new Error('Failed to link program');
        }
    }

    public get program() : WebGLProgram
    {
        if(this._shaderProgram == null)
        {
            throw "Can't init shader program"
        }

        return this._shaderProgram
    }
}