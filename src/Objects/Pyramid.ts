import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities";

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
        
        for (var j = 0; j < positions.length / 3; ++j ) {

          const c = faceColor
          
          colors = colors.concat(c)
        }
        
        const indexes = Array.from(Array(positions.length).keys())
        let count = indexes.length
 
        return {
          modelMatrix: null,
          position: new PositionBuffer(positions).buffer,
          countVertex: count,
          color: new ColorBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
          renderMode: glContext.TRIANGLES
        };
    }
}