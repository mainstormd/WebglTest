import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class IndexBuffer extends GLBuffer{
    constructor(indexes: number[])
    {
        super(glContext.ELEMENT_ARRAY_BUFFER)
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), glContext.STATIC_DRAW);
    }
}