export class StateBinder<State extends Object> {
    static finder: WeakMap<Object, StateBinder<any>> = new WeakMap()
    state: State
    watchers: StateWatcher<State, unknown>[] = []

    constructor(state: State,) {
        this.state = state
        const old = StateBinder.finder.get(state)
        if (old) return old as StateBinder<State>
        StateBinder.finder.set(state, this)
    }
}


export class StateWatcher<State, Val>{
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
    current: Set<StateBinder<{}>> | null = null
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

        const watchers = new Map<StateWatcher<any, unknown>, { state: any, watcher: StateWatcher<any, unknown> }>()

        Array.from(this.current.values())
            .forEach((state) => {
                state.watchers.forEach(watcher => {
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
}