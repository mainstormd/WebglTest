import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";

export class TextureImageAttribureAndUniformSetter{

    private _matrixLocation : WebGLUniformLocation | null;
    private _modelMatrixLocation : WebGLUniformLocation | null;
    private _cameraPosition : WebGLUniformLocation | null;
    public textureLocation : WebGLUniformLocation | null;
    
 
    private _positionAttributeLocation : GLint;
    private _positionInTextureAttribute : GLint;
   

    constructor(shaderProgram : WebGLProgram)
    {
        this._matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
        this._modelMatrixLocation = glContext.getUniformLocation(shaderProgram, "ModelMatrix");
        this._cameraPosition = glContext.getUniformLocation(shaderProgram, "cameraPosition");
        
        this._positionAttributeLocation = glContext.getAttribLocation(shaderProgram, "position");
        this._positionInTextureAttribute = glContext.getAttribLocation(shaderProgram, "positionInTexture");
        this.textureLocation = glContext.getUniformLocation(shaderProgram, "texture");
    }

    public Set(attributes, _, ModelViewProjectionMatrix, ModelMatrix, camera : Camera) : void
    {
        glContext.uniformMatrix4fv(this._matrixLocation, false, ModelViewProjectionMatrix);
        
        const { position, positionInTexture, indices } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);
        glContext.vertexAttribPointer(this._positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionAttributeLocation);
        
        glContext.bindBuffer(glContext.ARRAY_BUFFER, positionInTexture);
        glContext.vertexAttribPointer(this._positionInTextureAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionInTextureAttribute);

        glContext.uniform1i(this.textureLocation, 0);

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)  
    }
}