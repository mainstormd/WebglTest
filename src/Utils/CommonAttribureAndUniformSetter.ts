import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";

export class CommonAttribureAndUniformSetter{

    private _matrixLocation : WebGLUniformLocation | null;
    private _modelMatrixLocation : WebGLUniformLocation | null;
    private _cameraPosition : WebGLUniformLocation | null;
    
    private _positionAttributeLocation :GLint;
    private _vertexColorAttribute : GLint;

    constructor(shaderProgram : WebGLProgram)
    {
        this._matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
        this._modelMatrixLocation = glContext.getUniformLocation(shaderProgram, "ModelMatrix");
        this._cameraPosition = glContext.getUniformLocation(shaderProgram, "cameraPosition");
        
        this._positionAttributeLocation = glContext.getAttribLocation(shaderProgram, "position");
        this._vertexColorAttribute = glContext.getAttribLocation(shaderProgram, "color");

        // а можно ли по getAttribLocation понять есть ли такой атрибут в шейдере????
    }

    public Set(attributes, _, ModelViewProjectionMatrix, ModelMatrix, camera : Camera) : void
    {
        glContext.uniformMatrix4fv(this._matrixLocation, false, ModelViewProjectionMatrix);
        glContext.uniformMatrix4fv(this._modelMatrixLocation, false, ModelMatrix);
        glContext.uniform3fv(this._cameraPosition, camera.position);

        const { position, color, indices } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);
        glContext.vertexAttribPointer(this._positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(this._positionAttributeLocation);

        if(color != null)
        {    
           glContext.bindBuffer(glContext.ARRAY_BUFFER, color);
           glContext.vertexAttribPointer(this._vertexColorAttribute, 4, glContext.FLOAT, false, 0, 0);
           glContext.enableVertexAttribArray(this._vertexColorAttribute);
        }

        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)  
    }
}