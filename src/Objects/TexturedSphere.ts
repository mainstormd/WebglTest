import { DefaultBuffer } from "../GLBuffers/DefaultBuffer"
import { IndexBuffer } from "../GLBuffers/IndexBuffer"
import { m3 } from "../Math/math"
import { glContext } from "../Utils/GLUtilities"
import { ObjectsEnum } from "./ObjectEnum"
import TextureSourseVert from "../GLShaders/Sourses/TextureSourseVert.vert"
import TextureSourseFrag from "../GLShaders/Sourses/TextureSourseFrag.frag"
import { GLTexture } from "../GLBuffers/GLTexture";
import { ImageCreator } from "../Utils/ImageCreator";
import EarthImage from "../../resourses/debug_texture.jpg"
import { TextureImageAttribureAndUniformSetter } from "../Utils/TextureImageAttribureAndUniformSetter";
import { ShaderProgram } from "../GLShaders/ShaderProgram"
import { SphereAttribureAndUniformSetter } from "../Utils/SphereAttribureAndUniformSetter"
import LineNormalSourse from "../GLShaders/Sourses/LineNormalSourse.vert"
import NoLightSourse from "../GLShaders/Sourses/NoLightSourse.frag"
import { IndexBufferHelper } from "../Utils/IndexBufferHelper"
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter"

export class TexturedSphere {
    private _radius: number
    private _degreeOfTessellation: number 
    
    private _positions: number[] // Positions of pyramid after tesselation
    private _positionInTexture: number[]

    private _modelMatrix: number[] = [
        1, 0, 0,   0, 
        0, 1, 0,   10, 
        0, 0, 1,   0, 
        0, 0, 0,   1
    ]

    private _shaderProgram = new ShaderProgram(TextureSourseVert, TextureSourseFrag)
    private _imageLoader = new ImageCreator(EarthImage)
    private _texture : WebGLTexture | null = null

    public assetSetter = new TextureImageAttribureAndUniformSetter(this._shaderProgram.program)


    constructor(degreeOfTessellation : number = 3, radius : number = 3)
    { 
        this._degreeOfTessellation = degreeOfTessellation
        this._radius = radius
        // let p = this.ComputePositions()
        //  let d1 = p.slice(36 * 0,36*1).slice(3*3*0,3*3*1)
        //  let d2 = p.slice(36 * 6,36*7).slice(3*3*2,3*3*3)
        //  .slice(9*16 * 3,9*16 * 4)
        // d1.concat(d2)//.slice(9,27)
        //.slice(0, this.ComputePositions().length / 2)//.slice(36 * (32 + 16), 36 * 64)  //36*4)

        this._positions = this.ComputePositions()

        this._positionInTexture = this.ComputePositionInTexture()

    }

    public GetRenderAssets() 
    {       
        const indexes = Array.from(Array(this._positions.length).keys())
        
        let count = indexes.length

  
        if(this._texture == null)
        {
            this._texture = new GLTexture(this._imageLoader.img).texture
        }

        return {
            shaderProgram: this._shaderProgram,
            assetSetter: this.assetSetter,
            modelMatrix: m3.translation(0,10,0),
            attributes: {
                position: new DefaultBuffer(this._positions).buffer,
                positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
                texture: this._texture,
                indices: new IndexBuffer(indexes).buffer
            },
            countVertex: count,
            renderMode : glContext.TRIANGLES,
            type: ObjectsEnum.Test
        };
    }

    private ComputePositions(): number []
    {
      let positionsOfPyramid = [
        //up
         -1.0,  0,    0,
            0,  1,    0,   
            0,  0,  1.0, // back face
          
            0,  0,  1.0,
            0,  1,    0, 
          1.0,  0,    0, // right face
          
          1.0,  0,    0,
            0,  1,    0,
            0,  0, -1.0, // font face
        
            0,  0, -1.0,
            0,  1,    0,
          -1.0,  0,   0, // left face
        
        // // bot
         -1.0,  0,    0,
            0, -1,    0,   
            0,  0,  1.0, // back face
          
            0,  0,  1.0,
            0, -1,    0, 
          1.0,  0,    0, // right face
          
          1.0,  0,    0,
            0, -1,    0,
            0,  0, -1.0, // font face
        
            0,  0, -1.0,
            0, -1,    0,
          -1.0, 0,   0, // left face
        ]

      let positionsAfterTesselation : any = []
      let pyramidSidesCount = 8 

      for(let i = 0; i < pyramidSidesCount && this._degreeOfTessellation !== 0; i++)
      {
        let leftVertex = [ positionsOfPyramid[i * 9 + 0], positionsOfPyramid[i * 9 + 1], positionsOfPyramid[i * 9 + 2] ]
        let rightVertex = [ positionsOfPyramid[i * 9 + 0 + 3], positionsOfPyramid[i * 9 + 1 + 3], positionsOfPyramid[i * 9 + 2 + 3] ]
        let centerVertex = [ positionsOfPyramid[i * 9 + 0 + 6], positionsOfPyramid[i * 9 + 1 + 6], positionsOfPyramid[i * 9 + 2 + 6] ]

        positionsAfterTesselation.push(...this.TesselationTriangle(leftVertex, rightVertex, centerVertex, this._degreeOfTessellation))
      }
      
      
      if(this._degreeOfTessellation === 0)
      {
        positionsAfterTesselation = positionsOfPyramid
      }

      let positions : number[] = []

      for(let i = 0; i < positionsAfterTesselation.length / 3; i++ )
        {
          let normal = m3.normalize([
                positionsAfterTesselation[ i * 3 ], 
                positionsAfterTesselation[ i * 3 + 1 ], 
                positionsAfterTesselation[ i * 3 + 2 ]
          ])

          let position = m3.multiplyScalarOnVector(this._radius, normal) 
  
          positions.push(position[0], position[1], position[2]) 
        }

      return positions
    }

    private TesselationTriangle(leftVertex, centerVertex, rightVertex, degreeOfTessellation)  
    {          

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

    private ComputePositionInTexture(): number []
    {
      let positionInTexture: number[] = []
      let countOfVectors = this._positions.length / 3
      
      for(let i = 0; i < countOfVectors; i++)
      {
          let unitVector = m3.normalize([
            this._positions[ i * 3 ], 
            this._positions[ i * 3 + 1 ], 
            this._positions[ i * 3 + 2 ]
          ])
          
          let u = 0.5 + Math.atan2(unitVector[0], unitVector[2]) / (2 * Math.PI)
          let v = 0.5 + Math.asin(unitVector[1]) / Math.PI

          //  === fix bugs seam at sphere  ===
          if( ( i >=  countOfVectors * 7 / 8 ) && u === 1)
          {
            u = 0.0
          }

          if( ( i <= countOfVectors / 2 )  && (i >=  countOfVectors * 3 / 8 ) && u === 1)
          {
            u = 0.0
          }

          positionInTexture.push(u, v)
      }

      //fix artefacts on poles
      for(let i = 0; i < countOfVectors ; i++)
      {
         let u = positionInTexture[i * 2]  
         let v = positionInTexture[i * 2 + 1] 
        
         if(u === 0.5 && (v === 1 || v === 0))
         {
            let prevU = positionInTexture[ (i - 1) * 2]  
            let nextU = positionInTexture[ (i + 1) * 2]  
            positionInTexture[i * 2] = prevU + (nextU - prevU) / 2
         }
      }
      
      return positionInTexture
    }

    get isReadyToRender() : boolean
    {
      return this._imageLoader.isLoaded
    }

    private _wireframeShaderProgram = new ShaderProgram(LineNormalSourse, NoLightSourse)
    private _wireframeAssetSetter = new CommonAttribureAndUniformSetter(this._wireframeShaderProgram.program)

    public GetWireframeRenderAssets() 
    {       
        const faceColors = [0.0,  1.0,  0.0,  1] // green
          
        let colors : any = [];
        
        for (let j = 0; j < this._positions.length / 3; ++j ) {
          colors = colors.concat(faceColors)
        }

        const indexes = Array.from(Array(this._positions.length).keys())

        const inputIndexes = this.GetIdexesForLinesRenderMode(indexes) 
        
        let count = inputIndexes.length
 
        return {
          shaderProgram: this._wireframeShaderProgram,
          assetSetter: this._wireframeAssetSetter,
          modelMatrix: m3.translation(0,10,0),//m3.IdentityMatrix(),
          attributes: {
             position: new DefaultBuffer(this._positions).buffer,
             color: new DefaultBuffer(colors).buffer,
             indices: new IndexBuffer(inputIndexes).buffer,
          },
          countVertex: count,
          renderMode : glContext.LINES,
          type: ObjectsEnum.Common
        };
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

    
}