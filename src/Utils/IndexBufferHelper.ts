export class IndexBufferHelper{
    private constructor(){}
    
    // [0, 1, 2, 0, 2, 3] => [ 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0] 
    public static GetIdexesForRenderModeLines(indexesOld : number[])
    {
        let indexes = indexesOld.reduce((reducer : number [], item : number) => { 
            reducer.push(item,item); 
            return reducer 
        },[])
        let firstItem : number | undefined = indexes.shift()
        
        if(firstItem != null)
        {
            indexes.push(firstItem)
        }
        return indexes
    }

}