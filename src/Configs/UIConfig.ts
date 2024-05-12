
export class UIConfig{
    private constructor(){}

    private static instance : UIConfig

    public static getInstance() : UIConfig
    {
        if(UIConfig.instance == null)
        {
            UIConfig.instance = new UIConfig()
        }

        return UIConfig.instance
    } 
}