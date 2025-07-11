import { Camera } from "../Camera"
import { CommonAttribureAndUniformSetter } from "./CommonAttribureAndUniformSetter"
import { glContext } from "./GLUtilities";

export class PlaneBumpPhongAttribureAndUniformSetter extends CommonAttribureAndUniformSetter
{
    private _normalAttributeLocation : GLint;
    private _tangentAttributeLocation : GLint;
    private _biTangentAttributeLocation : GLint;

    private _textureObject : WebGLUniformLocation | null;
    private _textureNormalMapObject : WebGLUniformLocation | null;
    private _positionInTextureAttribute : GLint;


    constructor(shaderProgram : WebGLProgram)
    {
        super(shaderProgram)
        this._normalAttributeLocation = glContext.getAttribLocation(shaderProgram, "normal");
        this._tangentAttributeLocation = glContext.getAttribLocation(shaderProgram, "tangent");
        this._biTangentAttributeLocation = glContext.getAttribLocation(shaderProgram, "biTangent");

        this._positionInTextureAttribute = glContext.getAttribLocation(shaderProgram, "positionInTexture");
        this._textureObject = glContext.getUniformLocation(shaderProgram, "textureObject");
        this._textureNormalMapObject = glContext.getUniformLocation(shaderProgram, "textureNormalMapObject");
    }

    public Set(attributes: any, uniforms: any, ModelViewProjectionMatrix: any, ModelMatrix: any, camera: Camera): void 
    {
        super.Set(attributes, uniforms, ModelViewProjectionMatrix, ModelMatrix, camera)

        const { normals, tangents, biTangents, positionInTexture, textureObject, textureNormalMapObject } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, positionInTexture);
        glContext.vertexAttribPointer(this._positionInTextureAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionInTextureAttribute);

        //вектора атрибуты!!! tbn  normal, tangent biTangent
        glContext.bindBuffer(glContext.ARRAY_BUFFER, normals);
        glContext.vertexAttribPointer(this._normalAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._normalAttributeLocation);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, tangents);
        glContext.vertexAttribPointer(this._tangentAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._tangentAttributeLocation);

        
        glContext.bindBuffer(glContext.ARRAY_BUFFER, biTangents);
        glContext.vertexAttribPointer(this._biTangentAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._biTangentAttributeLocation);

        //текстуры юниформы!!! textureNormalMapObject textureObject;

        glContext.uniform1i(this._textureNormalMapObject, 0);
        glContext.activeTexture(glContext.TEXTURE0);
        glContext.bindTexture(glContext.TEXTURE_2D, textureNormalMapObject);
        
        glContext.uniform1i(this._textureObject, 1);
        glContext.activeTexture(glContext.TEXTURE1);
        glContext.bindTexture(glContext.TEXTURE_2D, textureObject)
        
    }
}