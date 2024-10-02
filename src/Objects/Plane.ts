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
  public assetSetter = new PhongAttribureAndUniformSetter(this._shaderProgram.program)

  public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
  {

      const faceColors = [0.0,  0.0,  1.0,  0.5]           
      
      let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, 6)
      
      const indexes = [0, 1, 2, 3, 4, 5]

      const inputIndexes= renderMode === glContext.LINES ? IndexBufferHelper.GetIdexesForRenderModeLines(indexes) :  indexes
      
      let count = inputIndexes.length

      return {
        shaderProgram: this._shaderProgram,
        modelMatrix: m3.IdentityMatrix(),
        attributes:{
          position: new DefaultBuffer(this._positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(inputIndexes).buffer,
          normals: new DefaultBuffer(this._normals).buffer
        },
        type: ObjectsEnum.Test,
        assetSetter: this.assetSetter,
        countVertex: count,
        renderMode
      };
  }
  
  public GetRenderLineOfNormalsAssets()
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

    const shaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_LINE_NORMAL,FRAGMENT_SHADER_NOLIGHT_SOURCE) 
    const assetSetter = new CommonAttribureAndUniformSetter(shaderProgram.program)

    return {
      shaderProgram,
      modelMatrix: m3.IdentityMatrix(),
      attributes:{
        position: new DefaultBuffer(positions).buffer,
        color: new DefaultBuffer(colors).buffer,
        indices: new IndexBuffer(indexes).buffer,
      },
      assetSetter,
      type: ObjectsEnum.Common,
      countVertex: count,
      renderMode: glContext.LINES
    };
  }

}