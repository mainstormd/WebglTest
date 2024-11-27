import { glContext } from "../Utils/GLUtilities";

//является ли число степенью двойки
export function isPowerOfTwo(size : number)
{
    return (size & (size - 1)) === 0
}

//возвращает ближайше к степени двойки разрешение 
export function nextHighestPowerOfTwo(size : number)
{    
    let num = size - 1 

    for( let s = 1; s < 32; s <<= 1 ) // 2 4 6 8 ...
    {
        num = num | num >> s
    }

    return num + 1
}

export class GLTexture{

    protected _texture : WebGLTexture | null;
    protected _image : HTMLImageElement; 

    constructor(/*bindingTarget : GLenum,*/ image : HTMLImageElement)
    {
        this._texture = glContext.createTexture()

        glContext.bindTexture(glContext.TEXTURE_2D, this._texture)
        
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR)
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE)
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE)

        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, image)
        
        //maybe clear link later?
        this._image = image
        
    }

    /*
        Хак для текстур которые не являются степенью двойки, генерим картинку в ней
    */
    private GetImagePowerOfTwo(image : HTMLImageElement)
    {
        
        if(!isPowerOfTwo(image.width)  || !isPowerOfTwo(image.height) )
        {
            let canvas = document.createElement('canvas')
            canvas.width = nextHighestPowerOfTwo(image.width)
            canvas.height = nextHighestPowerOfTwo(image.height)

            let canvasContext = canvas.getContext("2d")
            
            if(!canvasContext)
            {
                throw Error("Canvas context is null")
            }

            canvasContext.drawImage(image, 0, 0, image.width, image.height)
            
            return canvas
        }

        return image
    }

    get texture() : WebGLTexture | null
    {
       return this._texture;
    }

    get data() : HTMLImageElement
    {
        return this._image
    }
}
