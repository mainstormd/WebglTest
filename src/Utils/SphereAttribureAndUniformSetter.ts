import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";
import { PhongAttribureAndUniformSetter } from "./PhongAttribureAndUniformSetter";

export class SphereAttribureAndUniformSetter extends PhongAttribureAndUniformSetter
{
    private _radiusUniformLocation : WebGLUniformLocation | null; 
    private _interpolationCoeffUniformLocation : WebGLUniformLocation | null;

    constructor(shaderProgram : WebGLProgram)
    {
        super(shaderProgram)

        this._radiusUniformLocation = glContext.getUniformLocation(shaderProgram, "radius")
        this._interpolationCoeffUniformLocation = glContext.getUniformLocation(shaderProgram, "interpolationCoeff");
    }

    public Set(attributes: any, uniforms:any, ModelViewProjectionMatrix: any, ModelMatrix: any, camera: Camera): void 
    {
        super.Set(attributes,uniforms, ModelViewProjectionMatrix, ModelMatrix, camera)

        const { radius, interpolationCoeff } = uniforms

        glContext.uniform1f(this._radiusUniformLocation, radius)
        glContext.uniform1f(this._interpolationCoeffUniformLocation, interpolationCoeff)
    }

}