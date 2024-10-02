import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { VERTEX_SHADER_SOURCE_CYLINDER } from "../GLShaders/ShaderSources";
import { degToRad, m3 } from "../Math/math";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { glContext } from "../Utils/GLUtilities";
import { ObjectsEnum } from "./ObjectEnum";

export class Cylinder{

    private modelMatrix : number[] | null = m3.IdentityMatrix() 

    public GetCirclePoint( radius: number, height: number) : number []
    {
        let points : number[] = []
        const delta = 5

        for(let angle = 0; angle <= 360; angle += delta)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            points.push(radius * cos, height, radius * sin)
        }
        
        return points
    }

    public GetReactanglesPositions(circlePositionA : number [], circlePositionB : number[]) : number []
    {
      let rectanglesPostions : number[] = []

      for( let i = 0; i < circlePositionA.length / 3; i++ )
      {
        const nextI = i + 1 < circlePositionA.length / 3 ? i + 1 : 0

        // first triangle
        rectanglesPostions.push(circlePositionA[i * 3], circlePositionA[i * 3 + 1], circlePositionA[i * 3 + 2])
        rectanglesPostions.push(circlePositionA[(nextI) * 3], circlePositionA[(nextI) * 3 + 1], circlePositionA[(nextI) * 3 + 2])
        rectanglesPostions.push(circlePositionB[i * 3], circlePositionB[i * 3 + 1], circlePositionB[i * 3 + 2])

        // second triangle
        rectanglesPostions.push(circlePositionA[(nextI) * 3], circlePositionA[(nextI) * 3 + 1], circlePositionA[(nextI) * 3 + 2])
        rectanglesPostions.push(circlePositionB[(nextI) * 3], circlePositionB[(nextI) * 3 + 1], circlePositionB[(nextI) * 3 + 2])
        rectanglesPostions.push(circlePositionB[i * 3], circlePositionB[i * 3 + 1], circlePositionB[i * 3 + 2])
      }

      return rectanglesPostions
    }

    public GetDiscPosition(circlePosition : number[], height: number) : number []
    {
       let position : number[] = []

       for( let i = 0; i < circlePosition.length / 3; i++ )
       {
          const nextI = i + 1 < circlePosition.length / 3 ? i + 1 : 0

          position.push(circlePosition[i * 3], circlePosition[i * 3 + 1], circlePosition[i * 3 + 2])
          position.push(0, height, 0)
          position.push(circlePosition[nextI * 3], circlePosition[nextI * 3 + 1], circlePosition[nextI * 3 + 2])  
        }

       return position
    }

    public GetCircleIdexesForRenderModeLines(indexesOld : number [])
    {
      let indexes = indexesOld.reduce((reducer : number [], item : number, index: number) => {
       
        if((index + 1) % 3 !== 0)
        {
           reducer.push(item,item)
           return reducer
        } 
          
        if(index === indexesOld.length)
        {
          reducer.push(item,indexesOld[0])
          return reducer
        }
        
        reducer.push(item,item,indexesOld[(index + 1) - 3]);
        return reducer
      },[])

      let firstItem : number | undefined = indexes.shift()
      
      if(firstItem != null)
      {
        indexes.push(firstItem)
      }

      return indexes
    }

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {  
        let height = 1
        let radius = 2
        const positions = this.GetDiscPosition(this.GetCirclePoint(radius, height), height) //this.GetReactanglesPositions(this.GetCirclePoint(4, 0),this.GetCirclePoint(4, 0.5))

        const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
        
        let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColor, positions.length / 3)
        
        const indexes = Array.from(Array(positions.length).keys())
        const count = indexes.length

        const inputIndexes= renderMode === glContext.LINES ? this.GetCircleIdexesForRenderModeLines(indexes) :  indexes
 
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_CYLINDER),
          attributes:{
            position: new PositionBuffer(positions).buffer,
            color: new ColorBuffer(colors).buffer,
            indices: new IndexBuffer(inputIndexes).buffer
          },
          modelMatrix: this.modelMatrix,
          countVertex: count,
          renderMode: renderMode,
          type: ObjectsEnum.Cylinder,
        };
    }

    public Animate(time : number)
    {
      let alpha = (Math.sin(time) + 1) / 2
    }
}