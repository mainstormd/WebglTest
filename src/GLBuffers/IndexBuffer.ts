import { glContext } from "../Utils/GLUtilities";
import { GLBuffer } from "./GLBuffer";

export class IndexBuffer extends GLBuffer<number>{
    constructor(indexes: number[])
    {
        super(glContext.ELEMENT_ARRAY_BUFFER, indexes)
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), glContext.STATIC_DRAW);
    }
}