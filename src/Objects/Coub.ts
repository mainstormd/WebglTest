import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { TransfomationsManager } from "../TransfomationsManager";
import { IndexBufferHelper } from "../Utils/IndexBufferHelper";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_COMMON } from "../GLShaders/ShaderSources";
import { ObjectsEnum } from "./ObjectEnum";
import { NormalsBuffer } from "../GLBuffers/NormalsBuffer";

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
   
    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES)
    {
        const positions = [
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
           -0.5,    -0.5, -0.5,
            0.5,    -0.5, -0.5,
            0.5,    -0.5,  0.5,
           
            -0.5,    -0.5, -0.5,
             0.5,    -0.5,  0.5,
            -0.5,    -0.5,  0.5,
      
          // Right face
            0.5,    -0.5, -0.5,
            0.5,  0.5, -0.5,
            0.5,  0.5,  0.5,
            
            0.5, -0.5, -0.5,
            0.5,  0.5,  0.5,
            0.5, -0.5,  0.5,
         
          // Left face
           -0.5,    -0.5, -0.5,
           -0.5,    -0.5,  0.5,
           -0.5,  0.5,  0.5,
           
           -0.5,    -0.5, -0.5,
           -0.5,  0.5,  0.5,
           -0.5,  0.5, -0.5,
           
        ];
  
        let colors : number[] = this._isGradientColor ? this.GetGradientColor() : this.GetDefaultColor();
      
        const indexes = Array.from(Array(positions.length / 3).keys())

        const normals = [
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
        ] 
  
        const inputIndexes = renderMode === glContext.LINES ? IndexBufferHelper.GetIdexesForRenderModeLines(indexes) :  indexes
       
        let count = inputIndexes.length
  
        return {
          shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_COMMON,FRAGMENT_SHADER_SOURCE),
          attributes: {
            position: new PositionBuffer(positions).buffer,
            color: new ColorBuffer(colors).buffer,
            indices: new IndexBuffer(inputIndexes).buffer,
            normals: new NormalsBuffer(normals).buffer
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
            colors = colors.concat(c, c, c, c, c, c);
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