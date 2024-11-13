export class ImageCreator
{
    public isLoaded = false
    
    private _image : HTMLImageElement
    private _src : string 
    
    //srcImg ->  is may be a https or base64 str
    constructor(srcImg)
    {
        this._src = srcImg
        this._image = new Image()
        
        this._image.onload = () => {
            this.isLoaded = true
        }

        this._image.onerror = (error) => {
            throw new Error("Не могу загрузить изображение \n" + error.toString())
        }

        this._image.src = srcImg
    }

    get img() : HTMLImageElement
    {
        return this._image
    }

    get src() : string
    {
        return this._src
    }
}