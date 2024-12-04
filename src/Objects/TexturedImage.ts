import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";
import { m3 } from "../Math/math";
import { TextureImageAttribureAndUniformSetter } from "../Utils/TextureImageAttribureAndUniformSetter";
import TextureSourseVert from "../GLShaders/Sourses/TextureSourseVert.vert"
import TextureSourseFrag from "../GLShaders/Sourses/TextureSourseFrag.frag"
import { GLTexture } from "../GLBuffers/GLTexture";
import { ImageCreator } from "../Utils/ImageCreator";
import BoxImage from "../../resourses/Box/texture.jpg"
import DebugImage from "../../resourses/debug_texture.jpg"

export class TexturedImage{

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
       1,    0, //D
       0,    0, //C
       0,    1, //A

       1,    0, //D
       0,    1, //A
       1,    1  //B
    ];
      
   
    private _shaderProgram = new ShaderProgram(TextureSourseVert, TextureSourseFrag)
    public assetSetter = new TextureImageAttribureAndUniformSetter(this._shaderProgram.program)
    
    private _imageLoader = new ImageCreator(DebugImage)
    private _texture : WebGLTexture | null = null
    
    public GetRenderAssets()
    {
        const indexes = Array.from(Array(this._positions.length / 3).keys())
       
        let count = indexes.length
        
        if(this._texture == null)
        {
            this._texture = new GLTexture(this._imageLoader.img).texture
        }
        
        return {
          shaderProgram: this._shaderProgram,
          attributes: {
            position: new DefaultBuffer(this._positions).buffer,
            positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
            texture: this._texture,
            indices: new IndexBuffer(indexes).buffer,
          },
          modelMatrix: m3.translation(5,0,0),
          assetSetter: this.assetSetter,
          countVertex: count,
          renderMode: glContext.TRIANGLES,
          type: ObjectsEnum.Common, 
        };
    }

    get isReadyToRender() : boolean
    {
      return this._imageLoader.isLoaded
    }
}