import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class ColorBuffer extends GLBuffer{
    constructor(colors: number[])
    {
        super(glContext.ARRAY_BUFFER)
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(colors), glContext.STATIC_DRAW);
    }
}