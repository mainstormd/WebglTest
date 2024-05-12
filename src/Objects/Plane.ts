import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";

export class Plane{

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {

        const positions = [
            70,  0, -50, 
           -70,  0, -50,
           -70,  0,  50, 
            70,  0,  50,
        ]
  
        const faceColors = [0.0,  0.0,  1.0,  0.5]           
        
        let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, 4)
        
        const indexes = [0, 1, 2, 0, 2, 3]

        const inputIndexes= renderMode === glContext.LINES ? IndexBufferHelper.GetIdexesForRenderModeLines(indexes) :  indexes
        
        let count = inputIndexes.length
  
        return {
          modelMatrix: null,
          position: new PositionBuffer(positions).buffer,
          countVertex: count,
          color: new ColorBuffer(colors).buffer,
          indices: new IndexBuffer(inputIndexes).buffer,
          renderMode
        };
    }
    
}