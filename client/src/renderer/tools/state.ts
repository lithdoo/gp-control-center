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


export class DataWatcher<State, Val> {
    fn: (state: State) => Val
    onUpdate: (state: State, val: Val) => void

    constructor(fn: (state: State) => Val, onUpdate: (state: State, val: Val) => void) {
        this.fn = fn
        this.onUpdate = onUpdate
    }
}


export function loggedMethod<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    const methodName = String(context.name);

    function replacementMethod(this: This, ...args: Args): Return {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = target.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
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
                    console.log({ state, watcher, val })
                    watcher.onUpdate(state, val)
                })
        } catch (e) {
            console.error(e)
        } finally {
            this.current = null
        }
    }

    add(state: Object | null) {
        if (state && typeof state === 'object') {
            if (this.current) this.current.add(new DataBinder(state))
            else this.current = new Set([new DataBinder(state)])
        }
    }

    push(...list: Object[]) {
        list.forEach(obj => this.add(obj))
    }


    callSync<That>(val: (t: That) => Object[]) {
        const that = this
        return function <Args extends any[], Return>(
            target: (this: That, ...args: Args) => Return,
            _context: ClassMethodDecoratorContext<That, (this: That, ...args: Args) => Return>
        ) {
            return function (this: That, ...args: Args): Return {
                that.push(...val(this))
                return target.call(this, ...args);
            }
        }
    }

    // todo 异步更新视图
    callAsync() {}
}

export const scheduler = new UpdateScheduler()

export const useWatch = <State extends {}, Val>(raw: State, getVal: (t: State) => Val) => {
    const [val, setVal] = useState(getVal(raw))
    const binder = useRef(new DataBinder(raw))
    const watcher = useRef(new DataWatcher<State, Val>(getVal, (_, val) => {
        console.log('val', val)
        setVal(val)
    }))
    useEffect(() => {
        binder.current.add(watcher.current)
        return () => {
            binder.current.remove(watcher.current)
        }
    }, [])

    return val
}