import { DefaultBuffer } from "../GLBuffers/DefaultBuffer"
import { IndexBuffer } from "../GLBuffers/IndexBuffer"
import { m3 } from "../Math/math"
import { glContext } from "../Utils/GLUtilities"
import { ObjectsEnum } from "./ObjectEnum"
import BumbMappingPlaneVertexShader from "../GLShaders/Sourses/BumbMappingPlaneVertexShader.vert"
import BumbMappingPlaneFragmentShader from "../GLShaders/Sourses/BumbMappingPlaneFragmentShader.frag"
import { GLTexture } from "../GLBuffers/GLTexture";
import { ImageCreator } from "../Utils/ImageCreator";
import EarthImage from "../../resourses/Earth/earth_color_map.png"
import EarthHeightMapImage from "../../resourses/Earth/earth_height_map.png"
import EarthNormalMapImage from "../../resourses/Earth/normal_earth.jpg"
import { ShaderProgram } from "../GLShaders/ShaderProgram"
import LineNormalSourse from "../GLShaders/Sourses/LineNormalSourse.vert"
import NoLightSourse from "../GLShaders/Sourses/NoLightSourse.frag"
import { IndexBufferHelper } from "../Utils/IndexBufferHelper"
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter"
import { PlaneBumpPhongAttribureAndUniformSetter } from "../Utils/PlaneBumpPhongAttribureAndUniformSetter"


export class BumpedTexturedSphere {
    private _radius: number
    private _degreeOfTessellation: number 
    
    private _positions: number[] 
    private _positionInTexture: number[]

    private _modelMatrix: number[] = [
        1, 0, 0,   0, 
        0, 1, 0,   10, 
        0, 0, 1,   0, 
        0, 0, 0,   1
    ]

    private _tangents: number[] = []
    private _biTangents: number[] = []
    private _normals: number[] = []
  
    private _shaderProgram = new ShaderProgram(BumbMappingPlaneVertexShader, BumbMappingPlaneFragmentShader)
    public assetSetter = new PlaneBumpPhongAttribureAndUniformSetter(this._shaderProgram.program)
    
    private _imageLoaderNormalMap= new ImageCreator(EarthNormalMapImage)
    private _imageLoaderHeightMap= new ImageCreator(EarthHeightMapImage)
    private _imageLoaderEarthImage = new ImageCreator(EarthImage)

    private _textureNormalMap : WebGLTexture | null = null
    private _textureHeightMap : WebGLTexture | null = null
    private _textureEarth: WebGLTexture | null = null

    private CalculateTBNVectors()
    {
        const countVertex = this._positions.length / 3
        const countTriangles = countVertex / 3
        
        for(let i = 0;  i < countTriangles; i++)
        {
          let pos1 = [this._positions[0 + i * 9], this._positions[1 + i * 9], this._positions[2 + i * 9]]
          let pos2 = [this._positions[3 + i * 9], this._positions[4 + i * 9], this._positions[5 + i * 9]]
          let pos3 = [this._positions[6 + i * 9], this._positions[7 + i * 9], this._positions[8 + i * 9]]

          let texture1 = [this._positionInTexture[0 + i * 6], this._positionInTexture[1 + i * 6]]
          let texture2 = [this._positionInTexture[2 + i * 6], this._positionInTexture[3 + i * 6]]
          let texture3 = [this._positionInTexture[4 + i * 6], this._positionInTexture[5 + i * 6]]

          let edge1 =  m3.subtractVectors(pos2, pos1)
          let edge2 =  m3.subtractVectors(pos3, pos1)

          let deltaUV1 =  m3.subtractVectors2d(texture2, texture1)
          let deltaUV2 =  m3.subtractVectors2d(texture3, texture1)

          let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1])
      
          let tangentX = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0])
          let tangentY = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1])
          let tangentZ = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])

          const tan = [tangentX, tangentY, tangentZ]
          this._tangents.push(...tan,...tan,...tan)

          let bitangentX = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0])
          let bitangentY = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1])
          let bitangentZ = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])

          const biTan = [bitangentX, bitangentY, bitangentZ]
          this._biTangents.push(...biTan, ...biTan, ...biTan)

          const normal = m3.cross([tangentX, tangentY, tangentZ], [bitangentX, bitangentY, bitangentZ])
          this._normals.push(...normal, ...normal, ...normal)
        }
    }

    constructor(degreeOfTessellation : number = 3, radius : number = 3)
    { 
        this._degreeOfTessellation = degreeOfTessellation
        this._radius = radius
        //порядок вызова важен
        this._positions = this.ComputePositions()
        this._positionInTexture = this.ComputePositionInTexture()
        this.CalculateTBNVectors()
    }

    public GetRenderAssets() 
    {       
        const indexes = Array.from(Array(this._positions.length).keys())
        
        let count = indexes.length

        if(this._textureHeightMap == null && this._textureEarth == null && this._textureNormalMap == null)
        {
            this._textureNormalMap = new GLTexture(this._imageLoaderNormalMap.img).texture
            this._textureHeightMap = new GLTexture(this._imageLoaderHeightMap.img).texture
            this._textureEarth = new GLTexture(this._imageLoaderEarthImage.img).texture
        }

        return {
            shaderProgram: this._shaderProgram,
            assetSetter: this.assetSetter,
            modelMatrix: this._modelMatrix,
            attributes: {
                position: new DefaultBuffer(this._positions).buffer,
                tangents:  new DefaultBuffer(this._tangents).buffer,
                biTangents: new DefaultBuffer(this._biTangents).buffer,
                normals: new DefaultBuffer(this._normals).buffer,
                positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
                textureObject: this._textureEarth,
                textureNormalMapObject: this._textureNormalMap,
                textureHeightMapObject: this._textureHeightMap,
                indices: new IndexBuffer(indexes).buffer
            },
            countVertex: count,
            renderMode : glContext.TRIANGLES,
            type: ObjectsEnum.Sphere
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
      return this._imageLoaderHeightMap.isLoaded && this._imageLoaderEarthImage.isLoaded && this._imageLoaderNormalMap.isLoaded
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