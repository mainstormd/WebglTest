import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { FRAGMENT_SHADER_NOLIGHT_SOURCE, FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_LINE_NORMAL, VERTEX_SHADER_SOURCE_SPHERE } from "../GLShaders/ShaderSources";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";
import { degToRad, m3 } from "../Math/math";
import { NormalsBuffer } from "../GLBuffers/NormalsBuffer";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";

export class Sphere{
    private _radius : number
    private _degreeOfTessellation : number 
    private _interpolationCoeff : number = 1 
    private _positions : number[] // Positions of pyramid after tesselation
    private _normals: number[]
    private _modelMatrix: number[] = [
      1, 0, 0,   0, 
      0, 1, 0, 1.5, 
      0, 0, 1,   0, 
      0, 0, 0,   1
    ]

    constructor(degreeOfTessellation : number = 3, radius : number = 3)
    { 
        this._degreeOfTessellation = degreeOfTessellation
        this._radius = radius
        this._positions = this.ComputePositions()
        this._normals = this.ComputeNormals()
    }

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {       
        let opacity = 0.5

        const faceColors = [
            [1.0,  0.0,  0.0,  opacity],    // Back face: red /
            [0.0,  1.0,  0.0,  opacity],    // Top face: green /
            [1.0,  1.0,  0.0,  opacity]    // Bottom face: blue
          ]
          
        let colors : any = [];
        
        let value = 0
        for (let j = 0; j < this._positions.length / 3; ++j, value++ ) {
          
          if(value > 2)
              value = 0

          const c = faceColors[value]
          
          colors = colors.concat(c)
        }

        const indexes = Array.from(Array(this._positions.length).keys())

        const inputIndexes= renderMode === glContext.LINES ? this.GetIdexesForLinesRenderMode(indexes) :  indexes
        
        let count = inputIndexes.length
 
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_SPHERE,FRAGMENT_SHADER_SOURCE),
          modelMatrix: this._modelMatrix,
          attributes: {
             position: new PositionBuffer(this._positions).buffer,
             color: new ColorBuffer(colors).buffer,
             indices: new IndexBuffer(inputIndexes).buffer,
             normals: new NormalsBuffer(this._normals).buffer
          },
          uniforms: {
            interpolationCoeff: this._interpolationCoeff,
            radius : this._radius
          }, 
          countVertex: count,
          renderMode,
          type:ObjectsEnum.Sphere
        };
    }

    private ComputePositions() : number []
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

        positionsAfterTesselation.push(...this.TesselationTriangle(leftVertex, rightVertex, centerVertex, this._degreeOfTessellation))
      }

      return positionsAfterTesselation
    }

  public GetRenderLineOfNormalsAssets()
  {
    const lengthLine = 0.2
    const vectorDimention = 3

    let positions : number [] = []

    for(let i = 0; i < this._positions.length / vectorDimention; i++)
    {
      const startPositionOfLine = m3.multiplyScalarOnVector(
                                            this._radius,
                                            [
                                              this._normals[ i * 3 ], 
                                              this._normals[ i * 3 + 1 ], 
                                              this._normals[ i * 3 + 2 ]
                                            ]
      )

      const endPositionOfLine = m3.additionVectors(startPositionOfLine, 
                                  m3.multiplyScalarOnVector(
                                    lengthLine,
                                    [
                                      this._normals[ i * 3 ], 
                                      this._normals[ i * 3 + 1 ], 
                                      this._normals[ i * 3 + 2 ]
                                    ]
                                  )
      )
      
      positions.push(...startPositionOfLine, ...endPositionOfLine)
    }

    const faceColors = [0.0,  1.0,  0.0, 1.0] 

    const colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, positions.length / vectorDimention )
    
    const indexes = Array.from(Array(positions.length).keys())
    
    const count = indexes.length

    return {
      shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_LINE_NORMAL,FRAGMENT_SHADER_NOLIGHT_SOURCE),
      modelMatrix: this._modelMatrix,
      attributes:{
        position: new PositionBuffer(positions).buffer,
        color: new ColorBuffer(colors).buffer,
        indices: new IndexBuffer(indexes).buffer,
      },
      type: ObjectsEnum.Common,
      countVertex: count,
      renderMode: glContext.LINES
    };
  }
    
    private ComputeNormals() : number[]
    {
        let normals : number [] = []  

        for(let i = 0; i < this._positions.length / 3; i ++ )
        {
          let vec = m3.normalize([
                                  this._positions[ i * 3 ], 
                                  this._positions[ i * 3 + 1 ], 
                                  this._positions[ i * 3 + 2 ]
          ])

          normals.push(vec[0], vec[1], vec[2]) 
        }

        return normals
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
        positions =  positions.concat(leftVertex, leftMiddleSegment, centerMiddleSegment,
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

    public GetIdexesForLinesRenderMode(oldIndexes : number[])
    {
      let indexes : number [] = []   
      let countVertexInTriangle = 3
      for(let i = 0; i < oldIndexes.length / countVertexInTriangle; i++)
      {
        indexes.push(...IndexBufferHelper.GetIdexesForRenderModeLines([oldIndexes[i * 3], oldIndexes[i * 3 + 1], oldIndexes[i * 3 + 2]]))
      }  

      return indexes
    }

    public Animate(time : number)
    {
      const speedOfAnimation = 10
      const alpha = degToRad(time / speedOfAnimation)
      this._interpolationCoeff = (Math.sin(alpha) + Math.sin(3.0 * alpha) / 3.0 + 1) / 2.0
    }
}