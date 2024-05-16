import { useEffect, useRef, useState } from "react"

export class DataBinder<State extends Object> {
    static finder: WeakMap<Object, DataBinder<any>> = new WeakMap()
    state: State
    watchers: DataWatcher<State, unknown>[] = []

    constructor(state: State) {
        if (state instanceof DataBinder) throw new Error('cant bind DataBinder instance!!!')
        this.state = state
        const old = DataBinder.finder.get(state)
        if (old) return old as DataBinder<State>
        DataBinder.finder.set(state, this)
    }


    add(watcher: DataWatcher<State, any>) {
        this.watchers = this.watchers.filter(v => v !== watcher).concat(watcher)
    }
    remove(watcher: DataWatcher<State, any>) {
        this.watchers = this.watchers.filter(v => v !== watcher)
    }
}


export class DataWatcher<State, Val>{
    fn: (state: State) => Val
    onUpdate: (state: State, val: Val) => void

    constructor(fn: (state: State) => Val, onUpdate: (state: State, val: Val) => void) {
        this.fn = fn
        this.onUpdate = onUpdate
    }
}


export class UpdateScheduler {
    static global = new UpdateScheduler()
    static timeout = () => new Promise((res) => requestAnimationFrame(res))
    current: Set<DataBinder<{}>> | null = null
    isRun: boolean = false
    constructor() {
        this.start()
    }
    async start() {
        this.isRun = true
        while (this.isRun) {
            await this.track()
            await UpdateScheduler.timeout()
        }
    }
    async track() {
        if (!this.current) return

        console.log(this.current)

        const watchers = new Map<DataWatcher<any, unknown>, { state: any, watcher: DataWatcher<any, unknown> }>()

        Array.from(this.current.values())
            .forEach((binder) => {
                const state = binder.state
                binder.watchers.forEach((watcher) => {
                    watchers.set(watcher, { watcher, state })
                })
            })


        try {
            Array.from(watchers.values())
                .forEach(({ state, watcher }) => {
                    const val = watcher.fn(state)
                    watcher.onUpdate(state, val)
                })
        } catch (e) {
            console.error(e)
        } finally {
            this.current = null
        }
    }

    add(state: Object) {
        if (this.current) this.current.add(new DataBinder(state))
        else this.current = new Set([new DataBinder(state)])
    }
}


export const scheduler = new UpdateScheduler()

export const useWatch = <State extends {}, Val>(raw: State, getVal: (t: State) => Val) => {
    const [val, setVal] = useState(getVal(raw))
    const binder = useRef(new DataBinder(raw))
    const watcher = useRef(new DataWatcher<State, Val>(getVal, (_, val) => { setVal(val) }))

    useEffect(() => {
        binder.current.add(watcher.current)
        return () => {
            binder.current.remove(watcher.current)
        }
    }, [])

    return val
}