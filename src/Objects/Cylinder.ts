import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { degToRad } from "../Math/math";
import { glContext } from "../Utils/GLUtilities";

export class Cylinder{

    public GetCirclePoint( radius: number) : number []
    {
        let points : number[] = []
        const delta = 5

        for(let angle = 0; angle < 360; angle = angle + delta)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            points.push(radius * cos, 0, radius * sin)
        }

        return points
    }

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {  

        const positions = this.GetCirclePoint(4)

        const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
        
        let colors : any = [];
        
        for (var j = 0; j < positions.length / 3; ++j ) {

          const c = faceColor
          
          colors = colors.concat(c)
        }
        
        const indexes = Array.from(Array(positions.length).keys())
        const count = indexes.length
 
        return {
          modelMatrix: null,
          position: new PositionBuffer(positions).buffer,
          countVertex: count,
          color: new ColorBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
          renderMode: glContext.LINES
        };
    }
}