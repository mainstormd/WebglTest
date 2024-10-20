import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class NormalsBuffer extends GLBuffer{
    constructor(normals: number[])
    {
        super(glContext.ARRAY_BUFFER)
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(normals), glContext.STATIC_DRAW);
    }
}