import { Camera } from "../Camera"
import { CommonAttribureAndUniformSetter } from "./CommonAttribureAndUniformSetter"
import { glContext } from "./GLUtilities";


export class PhongAttribureAndUniformSetter extends CommonAttribureAndUniformSetter
{
    private _normalAttributeLocation : GLint;

    constructor(shaderProgram : WebGLProgram)
    {
        super(shaderProgram)
        this._normalAttributeLocation = glContext.getAttribLocation(shaderProgram, "normal");
    }

    public Set(attributes: any, uniforms: any, ModelViewProjectionMatrix: any, ModelMatrix: any, camera: Camera): void 
    {
        super.Set(attributes, uniforms, ModelViewProjectionMatrix, ModelMatrix, camera)

        const { normals } = attributes
        
        glContext.bindBuffer(glContext.ARRAY_BUFFER, normals);
        glContext.vertexAttribPointer(this._normalAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._normalAttributeLocation);
    }
}