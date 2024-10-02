import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_COMMON } from "../GLShaders/ShaderSources";
import { m3 } from "../Math/math";
import { glContext } from "../Utils/GLUtilities";
import { ObjectsEnum } from "./ObjectEnum";

export class Pyramid{

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {  
         let positions = [
              //up
             -1.0,  0, -1.0,
                0,  4,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0,  4,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0,  4,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0,  4,    0,
             -1.0,  0, -1.0,
             
             // bot
             -1.0,  0, -1.0,   
                0, -4,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0, -4,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0, -4,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0, -4,    0,
             -1.0,  0, -1.0,
         ]

        const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
        
        let colors : any = [];
        
        for (let j = 0; j < positions.length / 3; ++j ) {

          const c = faceColor
          
          colors = colors.concat(c)
        }
        
        const indexes = Array.from(Array(positions.length).keys())
        let count = indexes.length
 
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON,FRAGMENT_SHADER_SOURCE),
          attributes: {
            position: new DefaultBuffer(positions).buffer,
            color: new DefaultBuffer(colors).buffer,
            indices: new IndexBuffer(indexes).buffer
          },
          modelMatrix: m3.IdentityMatrix(),
          countVertex: count,
          renderMode,
          type:ObjectsEnum.Common
        };
    }
}