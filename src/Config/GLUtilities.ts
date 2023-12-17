
export let glContext: WebGLRenderingContext

export class GlUtilities{

    public static initialize( elementId: string) : HTMLCanvasElement
    {
        let canvas: HTMLCanvasElement;

        if(elementId !== undefined)
        {
            canvas = document.getElementById(elementId) as HTMLCanvasElement
                
            if(canvas == null)
                throw new Error("Can't find canvas element")
        } else {
            canvas = document.createElement('canvas')
            document.body.appendChild(canvas);
        }

        glContext = canvas.getContext("webgl") as WebGLRenderingContext

        if(glContext == undefined)
            throw new Error("Unable to initialize WebGL. Your browser may not support it.")

        return canvas
    } 
}