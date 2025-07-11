import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";
import { degToRad, m3 } from "../Math/math";
import { GLTexture } from "../GLBuffers/GLTexture"
import { ImageCreator } from "../Utils/ImageCreator"
import BrickWallImage from "../../resourses/PlaneBrickWall/brickwall.jpg"
import BrickWallNormalMapImage from "../../resourses/PlaneBrickWall/brickwall_normal.jpg"
import BumbMappingPlaneVertexShader from "../GLShaders/Sourses/BumbMappingPlaneVertexShader.vert"
import BumbMappingPlaneFragmentShader from "../GLShaders/Sourses/BumbMappingPlaneFragmentShader.frag"
import { PlaneBumpPhongAttribureAndUniformSetter } from "../Utils/PlaneBumpPhongAttribureAndUniformSetter";
import Brick2Wall from  "../../resourses/PlaneBrickWall/bricks2.jpg"
import Brick2NormaltMap from  "../../resourses/PlaneBrickWall/bricks2_normal.jpg"
import Brick2DisplacementMap from  "../../resourses/PlaneBrickWall/bricks2_disp.jpg"


export class PlaneBumpMapping{

    /*
    A - B
    |   |
    C - D
    */

    private  _positions = [
       0,  0,   0, // D
       0,  0,   2, // C
       0,  2,   2, // A

       0,  0,   0, // D     
       0,  2,   2, // A
       0,  2,   0  // B
    ];

    private  _positionInTexture = [
       0,    0, //D
       1,    0, //C
       1,    1, //A

       0,    0, //D
       1,    1, //A
       0,    1  //B
    ];

    private _tangents: number[] = []
    private _biTangents: number[] = []
    private _normals: number[] = []
  
    private _shaderProgram = new ShaderProgram(BumbMappingPlaneVertexShader, BumbMappingPlaneFragmentShader)
    public assetSetter = new PlaneBumpPhongAttribureAndUniformSetter(this._shaderProgram.program)
    
    private _imageLoaderPlaneHeightMap= new ImageCreator(Brick2NormaltMap)
    private _imageLoaderPlaneImage = new ImageCreator(Brick2Wall)
    private _texturePlaneHeightMap : WebGLTexture | null = null
    private _texturePlane: WebGLTexture | null = null

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

    constructor()
    {
      this.CalculateTBNVectors()
    }

    public GetRenderAssets()
    {
        const indexes = Array.from(Array(this._positions.length / 3).keys())
       
        let count = indexes.length
        
        if(this._texturePlaneHeightMap == null && this._texturePlane == null )
        {
            this._texturePlaneHeightMap = new GLTexture(this._imageLoaderPlaneHeightMap.img).texture
            this._texturePlane = new GLTexture(this._imageLoaderPlaneImage.img).texture
        }
        
        return {
          shaderProgram: this._shaderProgram,
          assetSetter: this.assetSetter, //TODO не забыть написать свой сеттер
          modelMatrix: m3.MultiplyMatrix(m3.translation(8,0,0), m3.zRotation(degToRad(-75))),
          attributes: {
            position: new DefaultBuffer(this._positions).buffer,
            tangents:  new DefaultBuffer(this._tangents).buffer,
            biTangents: new DefaultBuffer(this._biTangents).buffer,
            normals: new DefaultBuffer(this._normals).buffer,
            positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
            textureObject: this._texturePlane,
            textureNormalMapObject: this._texturePlaneHeightMap,
            indices: new IndexBuffer(indexes).buffer,
          },
          countVertex: count,
          renderMode: glContext.TRIANGLES,
          type: ObjectsEnum.Test, 
        };
    }

    get isReadyToRender() : boolean
    {
      return this._imageLoaderPlaneHeightMap.isLoaded && this._imageLoaderPlaneImage.isLoaded
    }
}