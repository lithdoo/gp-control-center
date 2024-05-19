

type Callback<T> = { [Property in keyof T]: (e: T[Property]) => void }
type EventArgu<S extends string, T> = S extends keyof T ? T[S] : any

export class Listener<T> {
    callbacks: Callback<T>

    constructor(callbacks: Callback<T>) {
        this.callbacks = callbacks
    }

    emit<S extends string> (name: S, value: EventArgu<S,T>){
        if(this.callbacks[name as any]){
            this.callbacks[name as any](value)
        }
    }
}