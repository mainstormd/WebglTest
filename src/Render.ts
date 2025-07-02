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
            glContext.clearColor(0, 0, 0, 1); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
            glContext.enable(glContext.DEPTH_TEST);  // включает использование буфера глубины
            glContext.depthFunc(glContext.LESS);    // определяет работу буфера глубины: более ближние объекты перекрывают дальние
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
            glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
        }
    }

    public DrawScence(camera : Camera, sceneObjects: any = [], effects: any) : void
    {
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
      glContext.disable(glContext.CULL_FACE);

      glContext.enable(glContext.BLEND)
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
        
      // Compute the matrix
      const zNear = 1;
      const zFar = 2000;
      const fieldOfViewRadians = degToRad(60);
      const aspect = glContext.canvas.width / glContext.canvas.height;

      const projectionMatrix = m3.perspective(fieldOfViewRadians, aspect, zNear, zFar);
      const viewMatrix = m3.MultiplyMatrix(projectionMatrix, camera.matrix);
 
      for(let sceneObject of sceneObjects)
      {
        let {
          countVertex:count, 
          attributes, 
          modelMatrix:ModelMatrix, 
          renderMode, 
          shaderProgram, 
          uniforms
        } = sceneObject;

        if(ModelMatrix == null)
        {
          throw "ModelMatrix is null"
        }

        glContext.useProgram(shaderProgram.program)

        const ModelViewProjectionMatrix = m3.MultiplyMatrix(viewMatrix, ModelMatrix)
      
        sceneObject.assetSetter.Set(
          attributes,
          uniforms, 
          ModelViewProjectionMatrix,
          ModelMatrix,
          camera, 
          shaderProgram.program
        );

        let countPointLightsUniform = glContext.getUniformLocation(shaderProgram.program, "countPointLights");
        glContext.uniform1i(countPointLightsUniform, 2);

        AttributeAndUniformSetter.SetEffectsUnifoms(effects, shaderProgram.program)

        const offset = 0;
          
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
