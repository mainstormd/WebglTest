import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { TransfomationsManager } from "../TransfomationsManager";
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { FRAGMENT_SHADER_NOLIGHT_SOURCE, FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_COMMON, VERTEX_SHADER_SOURCE_LINE_NORMAL } from "../GLShaders/ShaderSources";
import { ObjectsEnum } from "./ObjectEnum";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { m3 } from "../Math/math";
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter";
import { PhongAttribureAndUniformSetter } from "../Utils/PhongAttribureAndUniformSetter";

export class Coub{
    private _isGradientColor : boolean = false
    private _transformations = new TransfomationsManager()

     /*
         1 o--------o 2
          /|       /|
         / |      / |
      3 o--------o 4|
        |5 o-----|--o 6
        | /      | /
        |/       |/
      7 o--------o 8
    */
    private  _positions = [
        // Front face
       -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,
      
       -0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,
       -0.5,  0.5,  0.5,
       
        // Back face
       -0.5, -0.5, -0.5,
       -0.5,  0.5, -0.5,
        0.5,  0.5, -0.5,
    
       -0.5, -0.5, -0.5,
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,
    
        // Top face
       -0.5,  0.5, -0.5,
       -0.5,  0.5,  0.5,
        0.5,  0.5,  0.5,
        
       -0.5,  0.5, -0.5,
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
      
        // Bottom face
       -0.5,  -0.5, -0.5,
        0.5,  -0.5, -0.5,
        0.5,  -0.5,  0.5,
        
       -0.5, -0.5, -0.5,
        0.5, -0.5,  0.5,
       -0.5, -0.5,  0.5,
  
        // Right face
        0.5, -0.5, -0.5,
        0.5,  0.5, -0.5,
        0.5,  0.5,  0.5,
        
        0.5, -0.5, -0.5,
        0.5,  0.5,  0.5,
        0.5, -0.5,  0.5,
       
        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        
        -0.5, -0.5, -0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5   
      ];

      private _normals = [
        // Front face
        0,    0,   1.0,
        0,    0,   1.0,
        0,    0,   1.0,
        0,    0,   1.0,
        0,    0,   1.0,
        0,    0,   1.0,
     
       // Back face
        0,    0, -1.0,
        0,    0, -1.0,
        0,    0, -1.0,
        0,    0, -1.0,
        0,    0, -1.0,
        0,    0, -1.0,
     
       // Top face
        0,  1.0,    0,
        0,  1.0,    0,
        0,  1.0,    0,
        0,  1.0,    0,
        0,  1.0,    0,
        0,  1.0,    0,
     
       // Bottom face
        0,  -1.0,   0,
        0,  -1.0,   0,
        0,  -1.0,   0,
        0,  -1.0,   0,
        0,  -1.0,   0,
        0,  -1.0,   0,
     
       // Right face
        1.0,   0,    0,
        1.0,   0,    0,
        1.0,   0,    0,
        1.0,   0,    0,
        1.0,   0,    0,
        1.0,   0,    0,
     
       // Left face
       -1.0,   0,    0,
       -1.0,   0,    0,
       -1.0,   0,    0,
       -1.0,   0,    0,
       -1.0,   0,    0,
       -1.0,   0,    0
    ]; 

    private _defaultColor = this.GetDefaultColor();  
   
    private _shaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON,FRAGMENT_SHADER_SOURCE);
    public assetSetter = new PhongAttribureAndUniformSetter(this._shaderProgram.program)

    public GetRenderAssets()
    {
        let colors : number[] = this._isGradientColor ? this.GetGradientColor() : this._defaultColor;
        
        const indexes = Array.from(Array(this._positions.length / 3).keys())
       
        let count = indexes.length
  
        return {
          shaderProgram: this._shaderProgram,
          attributes: {
            position: new DefaultBuffer(this._positions).buffer,
            color: new DefaultBuffer(colors).buffer,
            indices: new IndexBuffer(indexes).buffer,
            normals: new DefaultBuffer(this._normals).buffer
          },
          modelMatrix: this._transformations.ModelMatrix,
          assetSetter: this.assetSetter,
          countVertex: count,
          renderMode: glContext.TRIANGLES,
          type: ObjectsEnum.Common, 
        };
    }

    private _wireframeShaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON, FRAGMENT_SHADER_NOLIGHT_SOURCE)
    private _wireframeAssetSetter = new CommonAttribureAndUniformSetter(this._wireframeShaderProgram.program)

    public GetWireframeRenderAssets()
    {
        let colors : number[] = this._isGradientColor ? this.GetGradientColor() : this._defaultColor;
        
        const indexes = Array.from(Array(this._positions.length / 3).keys())
        const inputIndexes = IndexBufferHelper.GetIdexesForRenderModeLines(indexes) 
       
        let count = inputIndexes.length
  
        return {
          shaderProgram: this._wireframeShaderProgram,
          attributes: {
            position: new DefaultBuffer(this._positions).buffer,
            color: new DefaultBuffer(colors).buffer,
            indices: new IndexBuffer(inputIndexes).buffer
          },
          modelMatrix: this._transformations.ModelMatrix,
          assetSetter: this._wireframeAssetSetter,
          countVertex: count,
          renderMode: glContext.LINES,
          type: ObjectsEnum.Common, 
        };
    }

    private _normalesShaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_LINE_NORMAL, FRAGMENT_SHADER_NOLIGHT_SOURCE) 
    private _normalesAssetSetter = new CommonAttribureAndUniformSetter(this._normalesShaderProgram.program)

    public GetNormalsRenderAssets()
    {
      const lengthLine = 0.1
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
        shaderProgram: this._normalesShaderProgram,
        assetSetter : this._normalesAssetSetter,
        modelMatrix: this._transformations.ModelMatrix,
        attributes:{
          position: new DefaultBuffer(positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
        },
        type: ObjectsEnum.Common,
        countVertex: count,
        renderMode: glContext.LINES
      };
    }
    
    private GetDefaultColor()  
    { 
      const faceColors = [
          [1.0,  0.5,  0.31, 1.0],    // Front face: white
          [1.0,  0.5,  0.31, 1.0],   // Back face: red /
          [1.0,  0.5,  0.31, 1.0],    // Top face: green /
          [1.0,  0.5,  0.31, 1.0],    // Bottom face: blue
          [1.0,  0.5,  0.31, 1.0],   // Right face: yellow
          [1.0,  0.5,  0.31, 1.0],    // Left face: purple
        ];
        
      // Convert the array of colors into a table for all the vertices.
    
      let colors : any = [] ;
    
      for (let j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
    
        // Repeat each color four times becouse the four vertices of the face
        colors.push(...c, ...c, ...c, ...c, ...c, ...c);
      }

      return colors
    }
    
    private GetGradientColor()  
    { 
      return [
            // Front face
            1.0,  0.0,  0.0,  1.0, 
            1.0,  0.0,  0.0,  1.0, 
            1.0,  1.0,  0.0,  1.0,
            1.0,  1.0,  0.0,  1.0,
          
            // Back face
            0.0,  1.0,  0.0,  1.0,
            0.0,  1.0,  1.0,  1.0,
            0.0,  1.0,  1.0,  1.0,
            0.0,  1.0,  0.0,  1.0,
          
            // Top face
            0.0,  1.0,  1.0,  1.0,
            1.0,  1.0,  0.0,  1.0,
            1.0,  1.0,  0.0,  1.0,
            0.0,  1.0,  1.0,  1.0,
          
            // Bottom face
            0.0,  1.0,  0.0,  1.0,
            0.0,  1.0,  0.0,  1.0,
            1.0,  0.0,  0.0,  1.0, 
            1.0,  0.0,  0.0,  1.0, 
          
            // Right face
            0.0,  1.0,  0.0,  1.0,
            0.0,  1.0,  1.0,  1.0,
            1.0,  1.0,  0.0,  1.0,
            1.0,  0.0,  0.0,  1.0, 
          
            // Left face
            0.0,  1.0,  0.0,  1.0,
            1.0,  0.0,  0.0,  1.0, 
            1.0,  1.0,  0.0,  1.0,
            0.0,  1.0,  1.0,  1.0,
      ]
    }

    public isGradientColor( value: boolean)
    {
        this._isGradientColor = value
        return this
    }


    public zRotate( angle: number)
    {
        this._transformations.zRotate(angle)
        return this
    }

    public yRotate( angle: number)
    {
        this._transformations.yRotate(angle)
        return this
    }

    public xRotate( angle: number)
    {
        this._transformations.xRotate(angle)
        return this
    }

    public Translate( tx: number, ty: number, tz : number)
    {
        this._transformations.Translate(tx,ty,tz)
        return this
    }

    public Scale( sx : number, sy : number, sz : number)
    {
        this._transformations.Scale(sx, sy, sz)
        return this
    }

    public MoveUp() 
    {
        this._transformations.Translate(0,0.05,0)
        return this
    }

}