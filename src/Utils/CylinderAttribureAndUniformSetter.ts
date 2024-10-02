import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";
import { PhongAttribureAndUniformSetter } from "./PhongAttribureAndUniformSetter";

export class CylinderAttribureAndUniformSetter extends PhongAttribureAndUniformSetter
{
    private _weightAttributeLocation : GLint;

    private _matrixIdentityBoneUniformLocation : WebGLUniformLocation | null;
    private _matrixRotateBoneUniformLocation : WebGLUniformLocation | null;

    constructor(shaderProgram : WebGLProgram)
    {
        super(shaderProgram)

        this._weightAttributeLocation = glContext.getAttribLocation(shaderProgram, "weight");
        
        this._matrixIdentityBoneUniformLocation = glContext.getUniformLocation(shaderProgram, "IdentityBone");
        this._matrixRotateBoneUniformLocation = glContext.getUniformLocation(shaderProgram, "RotateBone");
    }

    public override Set(attributes : any, uniforms : any, ModelViewProjectionMatrix : any, ModelMatrix : any, camera : Camera) : void 
    {
        super.Set(attributes, uniforms, ModelViewProjectionMatrix, ModelMatrix, camera)

        const { weights } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, weights);
        glContext.vertexAttribPointer(this._weightAttributeLocation, 1, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._weightAttributeLocation);

        const { IdentityBone, RotateBone } = uniforms
        //  uniform mat4 IdentityBone;
        //  uniform mat4 RotateBone; 
        glContext.uniformMatrix4fv(this._matrixIdentityBoneUniformLocation, false, IdentityBone);
        glContext.uniformMatrix4fv(this._matrixRotateBoneUniformLocation, false, RotateBone);
    }

}