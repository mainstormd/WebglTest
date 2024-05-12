import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class PositionBuffer extends GLBuffer{
    constructor(positions: number[])
    {
        super(glContext.ARRAY_BUFFER)
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW);
    }
}