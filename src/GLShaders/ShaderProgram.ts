import { glContext } from "../Utils/GLUtilities"
import { Shader } from "./Shader";
import { FRAGMENT_SHADER_SOURCE } from "./ShaderSources";

export class ShaderProgram{

    private _shaderProgram : WebGLProgram | null
    
    constructor(VERTEX_SHADER_SOURCE: string)
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
        glContext.useProgram(this._shaderProgram)
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