import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { glContext } from "../Utils/GLUtilities"; 
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { ObjectsEnum } from "./ObjectEnum";
import { m3 } from "../Math/math";
import DoubleTextureSourseVert from "../GLShaders/Sourses/DoubleTextureSourseVert.vert"
import DoubleTextureSourseFrag from "../GLShaders/Sourses/DoubleTextureSourseFrag.frag"
import { GLTexture } from "../GLBuffers/GLTexture"
import { ImageCreator } from "../Utils/ImageCreator"
import FImage from "../../resourses/Box/f-texture.png"
import BlueLineImage from "../../resourses/Box/texture.jpg"
import { DoubleTextureImageAttribureAndUniformSetter } from "../Utils/DoubleTextureImageAttribureAndUniformSetter";

export class DoubleTexturedImage{

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
      
   
    private _shaderProgram = new ShaderProgram(DoubleTextureSourseVert, DoubleTextureSourseFrag)
    public assetSetter = new DoubleTextureImageAttribureAndUniformSetter(this._shaderProgram.program)
    
    private _imageLoaderFImgage= new ImageCreator(FImage)
    private _imageLoaderBlueLineImage = new ImageCreator(BlueLineImage)
    private _textureFImage : WebGLTexture | null = null
    private _textureBlueLineImage : WebGLTexture | null = null

    public GetRenderAssets()
    {
        const indexes = Array.from(Array(this._positions.length / 3).keys())
       
        let count = indexes.length
        
        if(this._textureFImage == null && this._textureBlueLineImage == null )
        {
            this._textureFImage = new GLTexture(this._imageLoaderFImgage.img).texture
            this._textureBlueLineImage = new GLTexture(this._imageLoaderBlueLineImage.img).texture
        }
        
        return {
          shaderProgram: this._shaderProgram,
          assetSetter: this.assetSetter,
          modelMatrix: m3.translation(10,0,0),
          attributes: {
            position: new DefaultBuffer(this._positions).buffer,
            positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
            texture0: this._textureFImage,
            texture1: this._textureBlueLineImage,
            indices: new IndexBuffer(indexes).buffer,
          },
          countVertex: count,
          renderMode: glContext.TRIANGLES,
          type: ObjectsEnum.Test, 
        };
    }

    get isReadyToRender() : boolean
    {
      return this._imageLoaderFImgage.isLoaded && this._imageLoaderBlueLineImage.isLoaded
    }
}