import { Camera } from "./Camera";
import { glContext, GlUtilities } from "./Utils/GLUtilities";
import { degToRad, m3 } from "./Math/math";
import { ObjectsEnum } from "./Objects/ObjectEnum";
import AttributeAndUniformSetter from "./Utils/AttributeAndUniformSetter";

export class Render{
    
    constructor()
    {
        let canvas = GlUtilities.GetOrInitializeCanvaasElement("glcanvas")
        GlUtilities.InitializeGLContext(canvas)

        if (glContext) {
            glContext.clearColor(0.1, 0.3, 0.1, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
            glContext.enable(glContext.DEPTH_TEST);  // включает использование буфера глубины
            glContext.depthFunc(glContext.LESS);    // определяет работу буфера глубины: более ближние объекты перекрывают дальние
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
            glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
        }
    }

    public DrawScence(camera : Camera, sceneObjects: any = [], time : number) : void
    {
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.disable(glContext.CULL_FACE);

      glContext.enable(glContext.BLEND)
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
        
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
        let {count, attributes, modelMatrix, renderMode, shaderProgram, type } = sceneObject;

        if(modelMatrix == null)
        {
          throw "ModelMatrix is null"
        }

        glContext.useProgram(shaderProgram.program)

        let resultMatrix = m3.MultiplyMatrix(viewMatrix, modelMatrix)
        
        switch(type)
        {
          case ObjectsEnum.Sphere:
            AttributeAndUniformSetter.SetSphereAttrAndUniforms(time,attributes,resultMatrix,shaderProgram.program);
          break;
          
          case ObjectsEnum.Cylinder:
            AttributeAndUniformSetter.SetCylinderAttrAndUniforms(attributes,resultMatrix,shaderProgram.program);
          break;

          default:
            AttributeAndUniformSetter.SetCommonAttrAndUniforms(attributes,resultMatrix,shaderProgram.program);
          break;
        }
      
        // draw
        let offset = 0;
          
        if(sceneObject.type === ObjectsEnum.Sphere)
        {
          glContext.enable(glContext.CULL_FACE);
          glContext.cullFace(glContext.BACK);
          glContext.drawElements(renderMode, count, glContext.UNSIGNED_SHORT, offset);
          glContext.cullFace(glContext.FRONT);
          glContext.drawElements(renderMode, count, glContext.UNSIGNED_SHORT, offset);
          glContext.disable(glContext.CULL_FACE);
          continue
        }

        glContext.drawElements(renderMode, count, glContext.UNSIGNED_SHORT, offset);
      }
    }
}
