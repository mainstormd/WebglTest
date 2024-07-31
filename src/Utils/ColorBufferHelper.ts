export class ColorBufferHelper{
    private constructor(){}
    
    public static GenerateDuplicateColorByVertexCount(color : number[], vertexCount: number)
    {
        let colors : any = [];
        
        for (let j = 0; j < vertexCount; ++j) {
          colors = colors.concat(color);
        }

        return colors
    }
}