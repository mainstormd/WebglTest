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

export class SohoTexturedSphere {
    private _radius: number
    private _index: number[] = []
    private _positions: number[] = []
    private _positionInTexture: number[] = []

    private _modelMatrix: number[] = [
        1, 0, 0,   0, 
        0, 1, 0, 5.5, 
        0, 0, 1,   0, 
        0, 0, 0,   1
    ]

    private _shaderProgram = new ShaderProgram(TextureSourseVert, TextureSourseFrag)
    private _imageLoader = new ImageCreator(EarthImage)
    private _texture : WebGLTexture | null = null

    public assetSetter = new TextureImageAttribureAndUniformSetter(this._shaderProgram.program)


    constructor(radius : number = 3)
    { 
        this._radius = radius
       
        this.ComputeGeometry()

        // let debugInfo : any = []
        // for( let i = 0; i < this._positionInTexture.length / 2; i++ )
        // {
        //   debugInfo.push({u:this._positionInTexture[i*2],v:this._positionInTexture[i * 2 + 1]})
        // }
        // debugInfo.sort( (a,b) => a.u - b.u )
    }

    private ComputeGeometry(sectorCount: number = 36, stackCount: number = 18) : void
    {
      let lengthInv = 1 / this._radius
      let sectorStep = 2 * Math.PI / sectorCount
      let stackStep = Math.PI / stackCount

      for(let i = 0; i <= stackCount; ++i )
      {
          let stackAngle = Math.PI / 2 - i * stackStep        // starting from pi/2 to -pi/2
          let xy = this._radius * Math.cos(stackAngle)             // r * cos(u)
          let z = this._radius * Math.sin(stackAngle);              // r * sin(u)
          
          let k1 = i * (sectorCount + 1);     // beginning of current stack
          let k2 = k1 + sectorCount + 1; 

          // add (sectorCount+1) vertices per stack
          // first and last vertices have same position and normal, but different tex coords
          for(let j = 0; j <= sectorCount; ++j, ++k1, ++k2)
          {
            let sectorAngle = j * sectorStep           // starting from 0 to 2pi
    
            // vertex position (x, y, z)
            let x = xy * Math.cos(sectorAngle) // r * cos(u) * cos(v)
            let y = xy * Math.sin(sectorAngle) // r * cos(u) * sin(v)

            this._positions.push(x, y, z)
    
            let u = j / sectorCount
            let v = i / stackCount
            this._positionInTexture.push(u,v)

            if(i != 0)
            {
                this._index.push(k1, k2, k1 + 1)
            }
      
            // k1+1 => k2 => k2+1
            if(i != (stackCount-1))
            {
              this._index.push(k1 + 1, k2, k2 + 1)
            }
          }
      }
    }

    public GetRenderAssets() 
    {       
        let opacity = 0.5

        const faceColors = [
            [1.0,  0.0,  0.0,  opacity],    // Back face: red /
            [0.0,  1.0,  0.0,  opacity],    // Top face: green /
            [1.0,  1.0,  0.0,  opacity]    // Bottom face: blue
        ]
        
        let colors : any = [];
        
        let value = 0
        for (let j = 0; j < this._positions.length / 3; ++j, value++ ) {
        
            if(value > 2)
                value = 0

            const c = faceColors[value]
            
            colors = colors.concat(c)
        }

        if(this._texture == null)
        {
            this._texture = new GLTexture(this._imageLoader.img).texture
        }

        return {
            shaderProgram: this._shaderProgram,
            assetSetter: this.assetSetter,
            modelMatrix: this._modelMatrix,
            attributes: {
                position: new DefaultBuffer(this._positions).buffer,
                indices: new IndexBuffer(this._index).buffer,
                positionInTexture: new DefaultBuffer(this._positionInTexture).buffer,
                texture: this._texture,
            },
            countVertex: this._index.length,
            renderMode : glContext.TRIANGLES,
            type: ObjectsEnum.Test
        };
    }

    get isReadyToRender() : boolean
    {
      return this._imageLoader.isLoaded
    }
}