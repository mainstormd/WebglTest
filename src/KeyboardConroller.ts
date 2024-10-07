export type KeyboardKeyCodes = { 
    [key: string]: boolean
}

export class KeyboardConroller
{
    private _keys: KeyboardKeyCodes = {
         "KeyW": false,
         "KeyA": false,
         "KeyS": false,
         "KeyD": false
    } 

    constructor()
    {
        document.addEventListener("keyup", this.onKeyUp.bind(this))
        document.addEventListener("keydown", this.onKeyDown.bind(this))
    }

    private onKeyDown( event: KeyboardEvent )
    {
        this._keys[event.code] = true
    }

    private onKeyUp( event: KeyboardEvent )
    {
        this._keys[event.code] = false
    }

    public IsButtonDown(keyCode)
    {
        return this._keys[keyCode]
    }
    
}