import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { VERTEX_SHADER_SOURCE_SPHERE } from "../GLShaders/ShaderSources";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";

export class Sphere{
    private _degreeOfTessellation : number    

    constructor(degreeOfTessellation : number = 3)
    { 
        this._degreeOfTessellation = degreeOfTessellation
    }

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {       
         let positionsOfPyramid = [
              //up
             -1.0,  0, -1.0,
                0,  2,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0,  2,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0,  2,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0,  2,    0,
             -1.0,  0, -1.0,
             
             // bot
             -1.0,  0, -1.0,   
                0, -2,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0, -2,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0, -2,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0, -2,    0,
             -1.0,  0, -1.0,
         ]

        let positionsAfterTesselation : any = []
        let pyramidSidesCount = 8 

        for(let i = 0; i < pyramidSidesCount; i++)
        {
          let leftVertex = [ positionsOfPyramid[i * 9 + 0], positionsOfPyramid[i * 9 + 1], positionsOfPyramid[i * 9 + 2] ]
          let rightVertex = [ positionsOfPyramid[i * 9 + 0 + 3], positionsOfPyramid[i * 9 + 1 + 3], positionsOfPyramid[i * 9 + 2 + 3] ]
          let centerVertex = [ positionsOfPyramid[i * 9 + 0 + 6], positionsOfPyramid[i * 9 + 1 + 6], positionsOfPyramid[i * 9 + 2 + 6] ]

          positionsAfterTesselation = positionsAfterTesselation.concat(this.TesselationTriangle(leftVertex, rightVertex, centerVertex, this._degreeOfTessellation))
        } 

        let positions : number[] = positionsAfterTesselation

        let opacity = 0.5
        const faceColors = [
            [1.0,  0.0,  0.0,  opacity],    // Back face: red /
            [0.0,  1.0,  0.0,  opacity],    // Top face: green /
            [1.0,  1.0,  0.0,  opacity]    // Bottom face: blue
          ]
          
          let colors : any = [];
          
          let value = 0
          for (let j = 0; j < positions.length / 3; ++j, value++ ) {
            
            if(value > 2)
               value = 0

            const c = faceColors[value]
            
            colors = colors.concat(c)
          }

        const indexes = Array.from(Array(positions.length).keys())

        const inputIndexes= renderMode === glContext.LINES ? IndexBufferHelper.GetIdexesForRenderModeLines(indexes) :  indexes
        
        let count = inputIndexes.length
 
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_SPHERE),
          modelMatrix: [1,0,0,10, 0,1,0,5, 0,0,1,0, 0,0,0,1],
          attributes: {
             position: new PositionBuffer(positions).buffer,
             color: new ColorBuffer(colors).buffer,
             indices: new IndexBuffer(inputIndexes).buffer
          },
          countVertex: count,
          renderMode,
          type:ObjectsEnum.Sphere
        };
    }
    
    private TesselationTriangle(leftVertex, centerVertex, rightVertex, degreeOfTessellation)  
    {          
      // линейная интерполяция
      // 3
      let leftMiddleSegment = [
        (leftVertex[0] + centerVertex[0]) / 2,
        (leftVertex[1] + centerVertex[1]) / 2,
        (leftVertex[2] + centerVertex[2]) / 2
      ]   

      // 4
      let rightMiddleSegment = [
        (centerVertex[0] + rightVertex[0]) / 2, 
        (centerVertex[1] + rightVertex[1]) / 2,
        (centerVertex[2] + rightVertex[2]) / 2
      ]

      // 5
      let centerMiddleSegment = [
        (rightVertex[0] + leftVertex[0]) / 2, 
        (rightVertex[1] + leftVertex[1]) / 2,
        (rightVertex[2] + leftVertex[2]) / 2
      ]
      
      let positions : number[] = [] 

      if(degreeOfTessellation === 1)
      {
        positions = positions.concat(leftVertex, leftMiddleSegment, centerMiddleSegment,
                                     leftMiddleSegment, centerVertex, rightMiddleSegment,
                                     centerMiddleSegment, rightMiddleSegment, rightVertex,
                                     leftMiddleSegment, rightMiddleSegment, centerMiddleSegment)
        return positions
      }

      positions = positions.concat(
                this.TesselationTriangle(leftVertex, leftMiddleSegment, centerMiddleSegment, degreeOfTessellation - 1),
                this.TesselationTriangle(leftMiddleSegment, centerVertex, rightMiddleSegment, degreeOfTessellation - 1),
                this.TesselationTriangle(centerMiddleSegment, rightMiddleSegment, rightVertex, degreeOfTessellation - 1),
                this.TesselationTriangle(leftMiddleSegment, rightMiddleSegment, centerMiddleSegment, degreeOfTessellation - 1))

      return positions
    }
}