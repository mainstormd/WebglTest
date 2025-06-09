import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";

export class DoubleTextureImageAttribureAndUniformSetter{

    private _matrixLocation : WebGLUniformLocation | null;
    private _modelMatrixLocation : WebGLUniformLocation | null;
    private _cameraPosition : WebGLUniformLocation | null;
    public textureLocation0 : WebGLUniformLocation | null;
    public textureLocation1 : WebGLUniformLocation | null;
    
    private _positionAttributeLocation : GLint;
    private _positionInTextureAttribute : GLint;
   

    constructor(shaderProgram : WebGLProgram)
    {
        this._matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
        this._modelMatrixLocation = glContext.getUniformLocation(shaderProgram, "ModelMatrix");
        this._cameraPosition = glContext.getUniformLocation(shaderProgram, "cameraPosition");
        
        this._positionAttributeLocation = glContext.getAttribLocation(shaderProgram, "position");
        this._positionInTextureAttribute = glContext.getAttribLocation(shaderProgram, "positionInTexture");
        this.textureLocation0 = glContext.getUniformLocation(shaderProgram, "texture0");
        this.textureLocation1 = glContext.getUniformLocation(shaderProgram, "texture1");
    }

    public Set(attributes, _, ModelViewProjectionMatrix, ModelMatrix, camera : Camera) : void
    {
        glContext.uniformMatrix4fv(this._matrixLocation, false, ModelViewProjectionMatrix);
        
        const { position, positionInTexture, indices, texture0, texture1 } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);
        glContext.vertexAttribPointer(this._positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionAttributeLocation);
        
        glContext.bindBuffer(glContext.ARRAY_BUFFER, positionInTexture);
        glContext.vertexAttribPointer(this._positionInTextureAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionInTextureAttribute);

        glContext.uniform1i(this.textureLocation0, 0);
        glContext.activeTexture(glContext.TEXTURE0);
        glContext.bindTexture(glContext.TEXTURE_2D, texture0);
        
        glContext.uniform1i(this.textureLocation1, 1);
        glContext.activeTexture(glContext.TEXTURE1);
        glContext.bindTexture(glContext.TEXTURE_2D, texture1)
        
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)  
    }
}