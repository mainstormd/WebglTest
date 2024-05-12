import { Camera } from "./Camera";
import { glContext, GlUtilities } from "./Utils/GLUtilities";
import { degToRad, m3 } from "./Math/math";
import { ShaderProgram } from "./GLShaders/ShaderProgram";

export class Render{
    
    private _shaderProgram: WebGLProgram;

    constructor()
    {
        let canvas = GlUtilities.GetOrInitializeCanvaasElement("glcanvas")
        GlUtilities.InitializeGLContext(canvas)

        if (glContext) {
            glContext.clearColor(0.1, 0.3, 0.1, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
            glContext.enable(glContext.DEPTH_TEST);                               // включает использование буфера глубины
            glContext.depthFunc(glContext.LESS);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
        }

        this._shaderProgram = new ShaderProgram().program;
    }

    public DrawScence(camera : Camera, sceneObjects: any = [], time : number) : void
    {
      glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.disable(glContext.CULL_FACE);
      
      glContext.depthFunc(glContext.LESS);   
      glContext.useProgram(this._shaderProgram);

      glContext.enable(glContext.BLEND)
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
        
      let matrixLocation = glContext.getUniformLocation(this._shaderProgram, "modelViewProjection_matrix");
      let objectTypeUniform = glContext.getUniformLocation(this._shaderProgram, "isSphere");
      let objectTimeUniforn = glContext.getUniformLocation(this._shaderProgram, "time");
      
      // Compute the matrix
      let zNear = 1;
      let zFar = 2000;
      let fieldOfViewRadians = degToRad(60);
      let aspect = glContext.canvas.width / glContext.canvas.height;

      let projectionMatrix = m3.perspective(fieldOfViewRadians, aspect, zNear, zFar);
      let cameraMatrix = camera.matrix;
      let viewMatrix = m3.MultiplyMatrix(projectionMatrix, cameraMatrix);
 
      for(let sceneObject of sceneObjects)
      {
        let { position, countVertex : count, color, indices, modelMatrix, renderMode } = sceneObject;

        let resultMatrix = viewMatrix 
        
        if(modelMatrix != null)
        {
          resultMatrix = m3.MultiplyMatrix(viewMatrix, modelMatrix)
        }  

         // Set the matrix.
        glContext.uniformMatrix4fv(matrixLocation, false, resultMatrix);

        //set objectType field
        glContext.uniform1f(objectTypeUniform, sceneObject?.isSphere ?? false)
        
        //set objectType time
        glContext.uniform1f(objectTimeUniforn, time)

        //order important, first use bind, second enable attr pointer 
        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);

          let positionAttributeLocation = glContext.getAttribLocation(this._shaderProgram, "a_Position");
          glContext.vertexAttribPointer(positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
          glContext.enableVertexAttribArray(positionAttributeLocation);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, color);

          let vertexColorAttribute = glContext.getAttribLocation(this._shaderProgram, "u_color");
          glContext.vertexAttribPointer(vertexColorAttribute, 4, glContext.FLOAT, false, 0, 0);
          glContext.enableVertexAttribArray(vertexColorAttribute);
          
        if(indices != null)
        {
          glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)
        }  
      
        // draw
        let offset = 0;
          // glContext.drawArrays(glContext.TRIANGLES, offset, count);
          glContext.drawElements(renderMode, count, glContext.UNSIGNED_SHORT, offset);
      }
    }
}
