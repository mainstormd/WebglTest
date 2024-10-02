import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class DefaultBuffer extends GLBuffer<number>{
    constructor(data: number[])
    {
        super(glContext.ARRAY_BUFFER, data)
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(data), glContext.STATIC_DRAW);
    }
}