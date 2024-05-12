
export let glContext: WebGLRenderingContext

export class GlUtilities{

    public static GetOrInitializeCanvaasElement( elementId: string) : HTMLCanvasElement
    {
        let canvas: HTMLCanvasElement;

        if(elementId !== "")
        {
            canvas = document.getElementById(elementId) as HTMLCanvasElement
                
            if(canvas == null)
            {
                throw new Error("Can't find canvas element")
            }   

        } else {
            canvas = document.createElement('canvas')
            document.body.appendChild(canvas)
        }

        return canvas
    } 

    public static InitializeGLContext( canvas : HTMLCanvasElement)
    {
        glContext = canvas.getContext("webgl") as WebGLRenderingContext

        if(glContext == null)
        {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.")
        }   
    }
}