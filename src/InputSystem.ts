import { EventManager } from "./EventSystem/EventManager"

export default class InputSystem {

    private _eventBus: EventManager  
    // Mouse Values
    private _previousMouseX: number | null = null
    private _previousMouseY: number | null = null
    private _mouseX: number | null = null 
    private _mouseY: number | null = null
    private _rightMouseButtonDown: boolean = false

    constructor(viewport: HTMLCanvasElement, eventBus: EventManager){

        this._eventBus = eventBus

        //browserEvents
        document.addEventListener("keydown"     , this.onKeyDown.bind(this))
        
        // MouseEvents
        viewport.addEventListener("mousemove"   , this.onMouseMove.bind(this))
        viewport.addEventListener('mousedown'   , this.onMouseDown.bind(this))
        viewport.addEventListener('mouseup'     , this.onMouseUp.bind(this))
        viewport.addEventListener('contextmenu' , event => event.preventDefault())
    }

    private onMouseMove( event: MouseEvent )
    {        
        this._previousMouseX = this._mouseX
        this._previousMouseY = this._mouseY

        if(this._previousMouseX == null || this._previousMouseY == null)
        {
            this._previousMouseX = event.x
            this._previousMouseY = event.y
        }
       
        this._mouseX = event.x
        this._mouseY = event.y
       
        this._eventBus.Emit('mousemove', {
            rightMouseButtonDown: this._rightMouseButtonDown,
            offsetX: this.offsetX,  
            offsetY: this.offsetY,
        })
    }

    private get offsetX() 
    {   
        if(this._mouseX == null || this._previousMouseX == null )
        {
            throw new Error("Null value in calculating offsetX")
        }    
 
        return this._mouseX  - this._previousMouseX 
    }
 
    private get offsetY() 
    {  
         if(this._mouseY == null || this._previousMouseY == null )
         {
            throw new Error("Null value in calculating offsetY")
         }  
         
         return  this._previousMouseY - this._mouseY //reverse!!
    }

    private onMouseDown( event: MouseEvent )
    {
        console.log('mouseDownHandler', event.button)

        if(event.button === 2)
        {
            this._rightMouseButtonDown = true
        }
    }

    private onMouseUp( event: MouseEvent )
    {
        console.log('mouseDownHandler', event.button)

        if(event.button === 2)
        {
            this._rightMouseButtonDown = false
        }
    }   

    private onKeyDown( event: KeyboardEvent )
    {   
        this._eventBus.Emit('keypress', {
            key: event.code
        })
    }
}

/*
Есть ощущение что, когда работаем через KeyPress не можем идти по диаганали
    
    export type KeyboardKeyCodes = { 
        [key: string]: boolean
    }

    private _keys: KeyboardKeyCodes = {}

    private onKeyDown( event: KeyboardEvent )
    {
        this._keys[event.code] = true
    }

    private onKeyUp( event: KeyboardEvent )
    {
        this._keys[event.code] = false
    }

    document.addEventListener("keyup"       , this.onKeyUp)
    document.addEventListener("keydown"     , this.onKeyDown)
*/