import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { TransfomationsManager } from "../TransfomationsManager";
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { VERTEX_SHADER_SOURCE_COMMON } from "../GLShaders/ShaderSources";
import { ObjectsEnum } from "./ObjectEnum";

export class Coub{
    private _isGradientColor : boolean = false
    private _transformations : TransfomationsManager = new TransfomationsManager()

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
    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES)
    {
        const positions = [
          // Front face
           -1.0,    0,  1.0,
            1.0,    0,  1.0,
            1.0,  2.0,  1.0,
           -1.0,  2.0,  1.0,
        
          // Back face
           -1.0,    0, -1.0,
           -1.0,  2.0, -1.0,
            1.0,  2.0, -1.0,
            1.0,    0, -1.0,
        
          // Top face
           -1.0,  2.0, -1.0,
           -1.0,  2.0,  1.0,
            1.0,  2.0,  1.0,
            1.0,  2.0, -1.0,
        
          // Bottom face
           -1.0,    0, -1.0,
            1.0,    0, -1.0,
            1.0,    0,  1.0,
           -1.0,    0,  1.0,
        
          // Right face
            1.0,    0, -1.0,
            1.0,  2.0, -1.0,
            1.0,  2.0,  1.0,
            1.0,    0,  1.0,
        
          // Left face
           -1.0,    0, -1.0,
           -1.0,    0,  1.0,
           -1.0,  2.0,  1.0,
           -1.0,  2.0, -1.0,
        ];
  
        let colors : number[] = this._isGradientColor ? this.GetGradientColor() : this.GetDefaultColor();
      
        const indexes = [
          0,  1,  2,      0,  2,  3,    // front
          4,  5,  6,      4,  6,  7,    // back
          8,  9,  10,     8,  10, 11,   // top
          12, 13, 14,     12, 14, 15,   // bottom
          16, 17, 18,     16, 18, 19,   // right
          20, 21, 22,     20, 22, 23,   // left
        ];
  
        const inputIndexes = renderMode === glContext.LINES ? IndexBufferHelper.GetIdexesForRenderModeLines(indexes) :  indexes
       
        let count = inputIndexes.length
  
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON),
          attributes: {
            position: new PositionBuffer(positions).buffer,
            color: new ColorBuffer(colors).buffer,
            indices: new IndexBuffer(inputIndexes).buffer
          },
          modelMatrix: this._transformations.ModelMatrix,
          countVertex: count,
          renderMode,
          type: ObjectsEnum.Common, 
        };
    }
    
    private GetDefaultColor()  
    { 
        const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red /
            [0.0,  1.0,  0.0,  1.0],    // Top face: green /
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
          ];
        
          // Convert the array of colors into a table for all the vertices.
        
          let colors : any = [] ;
        
          for (let j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
        
            // Repeat each color four times becouse the four vertices of the face
            colors = colors.concat(c, c, c, c);
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

    public MoveUp() 
    {
        this._transformations.Translate(0,0.05,0)
        return this
    }

}