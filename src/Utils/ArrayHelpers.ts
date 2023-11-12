
export class ArrayHelpers {
    private constructor() {}

    public static DeleteItem <T>(array: T[], item : T) : boolean
    {
        const itemIndex = array.indexOf(item)

        if(itemIndex !== -1)
        {
            array?.splice(itemIndex, 1)
        }

        return false
    }

}