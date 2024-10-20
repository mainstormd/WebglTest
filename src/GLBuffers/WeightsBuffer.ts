import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class WeightsBuffer extends GLBuffer{
    constructor(weights: number[])
    {
        super(glContext.ARRAY_BUFFER)
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(weights), glContext.STATIC_DRAW);
    }
}