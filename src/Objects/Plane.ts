import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { FRAGMENT_SHADER_NOLIGHT_SOURCE, FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_COMMON, VERTEX_SHADER_SOURCE_LINE_NORMAL } from "../GLShaders/ShaderSources";
import { m3 } from "../Math/math";
import { ObjectsEnum } from "./ObjectEnum";
import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter";
import { PhongAttribureAndUniformSetter } from "../Utils/PhongAttribureAndUniformSetter";

export class Plane{

  private _positions = [
      70,  0, -50, 
     -70,  0, -50,
     -70,  0,  50, 
      
      70,  0, -50,
     -70,  0,  50,
      70,  0,  50
  ]

  private _normals = [
      0,  1,   0, 
      0,  1,   0, 
      0,  1,   0, 

      0,  1,   0,
      0,  1,   0, 
      0,  1,   0
  ]

  private _shaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON,FRAGMENT_SHADER_SOURCE)
  private _assetSetter = new PhongAttribureAndUniformSetter(this._shaderProgram.program)

  public GetRenderAssets() 
  {
      const faceColors = [0.0,  0.0,  1.0,  0.5]           
      
      let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, 6)
      
      const indexes = [0, 1, 2, 3, 4, 5]

      let count = indexes.length

      return {
        shaderProgram: this._shaderProgram,
        modelMatrix: m3.IdentityMatrix(),
        attributes:{
          position: new DefaultBuffer(this._positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
          normals: new DefaultBuffer(this._normals).buffer
        },
        type: ObjectsEnum.Common,
        assetSetter: this._assetSetter,
        countVertex: count,
        renderMode: glContext.TRIANGLES
      };
  }

  private _wireframeShaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON, FRAGMENT_SHADER_NOLIGHT_SOURCE)
  private _wireframeAssetSetter = new CommonAttribureAndUniformSetter(this._wireframeShaderProgram.program)

  public GetWireframeRenderAssets() 
  {
      const faceColors = [0.0,  0.0,  1.0,  0.5]           
      
      let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, 6)
      
      const indexes = [0, 1, 2, 3, 4, 5]

      const inputIndexes = IndexBufferHelper.GetIdexesForRenderModeLines(indexes)
      
      let count = inputIndexes.length

      return {
        shaderProgram: this._wireframeShaderProgram,
        modelMatrix: m3.IdentityMatrix(),
        attributes:{
          position: new DefaultBuffer(this._positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(inputIndexes).buffer
        },
        type: ObjectsEnum.Common,
        assetSetter: this._wireframeAssetSetter,
        countVertex: count,
        renderMode: glContext.LINES
      };
  }

  private _normalesShaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_LINE_NORMAL, FRAGMENT_SHADER_NOLIGHT_SOURCE) 
  private _normalesAssetSetter = new CommonAttribureAndUniformSetter(this._normalesShaderProgram.program)
  
  public GetNormalsRenderAssets()
  {
    const lengthLine = 0.9
    const vectorDimention = 3

    let positions : number [] = []

    for(let i = 0; i < this._positions.length / vectorDimention; i++)
    {
      const startPositionOfLine = [
        this._positions[ i * 3 ], 
        this._positions[ i * 3 + 1 ], 
        this._positions[ i * 3 + 2 ]
      ]

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
      modelMatrix: m3.IdentityMatrix(),
      attributes:{
        position: new DefaultBuffer(positions).buffer,
        color: new DefaultBuffer(colors).buffer,
        indices: new IndexBuffer(indexes).buffer,
      },
      assetSetter: this._normalesAssetSetter,
      type: ObjectsEnum.Common,
      countVertex: count,
      renderMode: glContext.LINES
    };
  }
}