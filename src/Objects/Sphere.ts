import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";
import { degToRad, m3 } from "../Math/math";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter";
import { SphereAttribureAndUniformSetter } from "../Utils/SphereAttribureAndUniformSetter";
import NoLightSourse from "../GLShaders/Sourses/NoLightSourse.frag"
import LineNormalSourse from "../GLShaders/Sourses/LineNormalSourse.vert"
import SphereSourse from "../GLShaders/Sourses/SphereSourse.vert"
import LightAndFogSourse from "../GLShaders/Sourses/LightAndFogSourse.frag"

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

    private _shaderProgram = new ShaderProgram(SphereSourse, LightAndFogSourse)
    public assetSetter = new SphereAttribureAndUniformSetter(this._shaderProgram.program)

    constructor(degreeOfTessellation : number = 3, radius : number = 3)
    { 
        this._degreeOfTessellation = degreeOfTessellation
        this._radius = radius
        this._positions = this.ComputePositions()
        this._normals = this.ComputeNormals()
    }

    public GetRenderAssets() 
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
        
        let count = indexes.length
 
        return {
          shaderProgram: this._shaderProgram,
          assetSetter: this.assetSetter,
          modelMatrix: this._modelMatrix,
          attributes: {
             position: new DefaultBuffer(this._positions).buffer,
             color: new DefaultBuffer(colors).buffer,
             indices: new IndexBuffer(indexes).buffer,
             normals: new DefaultBuffer(this._normals).buffer
          },
          uniforms: {
            interpolationCoeff: this._interpolationCoeff,
            radius : this._radius
          }, 
          countVertex: count,
          renderMode : glContext.TRIANGLES,
          type: ObjectsEnum.Sphere
        };
    }

    private _wireframeShaderProgram = new ShaderProgram(SphereSourse, NoLightSourse)
    private _wireframeAssetSetter = new SphereAttribureAndUniformSetter(this._wireframeShaderProgram.program)

    public GetWireframeRenderAssets() 
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

        const inputIndexes = this.GetIdexesForLinesRenderMode(indexes) 
        
        let count = inputIndexes.length
 
        return {
          shaderProgram: this._wireframeShaderProgram,
          assetSetter: this._wireframeAssetSetter,
          modelMatrix: this._modelMatrix,
          attributes: {
             position: new DefaultBuffer(this._positions).buffer,
             color: new DefaultBuffer(colors).buffer,
             indices: new IndexBuffer(inputIndexes).buffer,
             normals: new DefaultBuffer(this._normals).buffer
          },
          uniforms: {
            interpolationCoeff: this._interpolationCoeff,
            radius : this._radius
          }, 
          countVertex: count,
          renderMode : glContext.LINES,
          type: ObjectsEnum.Sphere
        };
    }

    private _normalesShaderProgram = new ShaderProgram(LineNormalSourse, NoLightSourse) 
    private _normalesAssetSetter = new CommonAttribureAndUniformSetter(this._normalesShaderProgram.program)

    public GetNormalsRenderAssets()
    {
      const lengthLine = 0.1
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
        shaderProgram : this._normalesShaderProgram,
        modelMatrix: this._modelMatrix,
        attributes:{
          position: new DefaultBuffer(positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
        },
        assetSetter : this._normalesAssetSetter,
        type: ObjectsEnum.Common,
        countVertex: count,
        renderMode: glContext.LINES
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

    public Animate(time : number, isEnabledAnimation: boolean = false)
    {
      const speedOfAnimation = 10
      const alpha = degToRad(time / speedOfAnimation)
      this._interpolationCoeff = isEnabledAnimation ? (Math.sin(alpha) + Math.sin(3.0 * alpha) / 3.0 + 1) / 2.0 : 1
    }
}