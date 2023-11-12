import { Camera } from "./Camera";
import { glContext, GlUtilities } from "./GLUtilities";
import { degToRad, m3 } from "./Math/math";
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from "./Shaders";

export class Render{
    
    private _canvas: HTMLCanvasElement;
    private _shaderProgram: WebGLProgram;

    constructor()
    {
        this._canvas = GlUtilities.initialize("glcanvas")

        if (glContext) {
            glContext.clearColor(0.1, 0.3, 0.1, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
            glContext.enable(glContext.DEPTH_TEST);                               // включает использование буфера глубины
            glContext.depthFunc(glContext.LESS);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
          
          //TODO add draw scene
        }

        this._shaderProgram = this.InitShadersAndGetProgram();
    }
    
    private InitShadersAndGetProgram()
    {
        //Init shaders
        let vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
        let fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER); 
        
        if(!!vertexShader && !!fragmentShader)
        {
            glContext.shaderSource(vertexShader, VERTEX_SHADER_SOURCE);
            glContext.compileShader(vertexShader);

            glContext.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
            glContext.compileShader(fragmentShader);
        }
        else 
            throw "Can't init shaders" 

        //создаем объект программы шейдеров
        let shaderProgram : WebGLProgram = glContext.createProgram()  as WebGLProgram;
        
        if(shaderProgram != null )
        {
            // прикрепляем к ней шейдеры
            glContext.attachShader(shaderProgram , vertexShader);
            glContext.attachShader(shaderProgram, fragmentShader);
            // связываем программу с контекстом webgl
            glContext.linkProgram(shaderProgram);
            glContext.useProgram(shaderProgram);
        }
        else
            throw "Can't init shader program"
        
        return shaderProgram
    }

    public DrawScence(camera : Camera, sceneObjects: any = []) : void
    {
      glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.enable(glContext.CULL_FACE);
      
      glContext.depthFunc(glContext.LESS);   
      glContext.useProgram(this._shaderProgram);
        
      let matrixLocation = glContext.getUniformLocation(this._shaderProgram, "u_matrix");
      
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
        let { position, countVertex : count, color, indices, modelMatrix } = sceneObject;

        let resultMatrix = viewMatrix 
        
        if(modelMatrix != null)
         resultMatrix = m3.MultiplyMatrix(viewMatrix, modelMatrix) 

         // Set the matrix.
        glContext.uniformMatrix4fv(matrixLocation, false, resultMatrix);

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
          glContext.drawElements(glContext.TRIANGLES, count, glContext.UNSIGNED_SHORT, offset);
      }
    }
}
