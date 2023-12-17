import { ArrayHelpers } from "../Utils/ArrayHelpers"

type Listener = (evntArgs : any) => void

interface IDispodable {
    dispose : () => void
}

export class EventManager{

    private events : Map<string, Listener[] > = new Map()

    constructor() { }
    
    public Subscribe(eventName : string, listener : Listener) : IDispodable
    {
        let listeners = this.events.get(eventName) ?? []

        listeners.push(listener)

        this.events.set(eventName, listeners)

        const dispose = () => {
            this.Unsubscribe(eventName, listener)
        }

        return ({ dispose })
    }

    public Unsubscribe(eventName : string, listener : Listener)
    {
        let listeners = this.events.get(eventName) ?? []

        ArrayHelpers.DeleteItem<Listener>(listeners, listener)
    }

    public Emit<EventArgs>(eventName : string, eventArgs?: EventArgs)
    {
        let listeners = this.events.get(eventName) ?? []

        for (let listener of listeners)
        {
            listener(eventArgs)
        }
    }
}