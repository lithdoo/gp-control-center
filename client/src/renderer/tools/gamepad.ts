import { Listener } from "./listener"


interface BtnState {
    value: number
    isPress: boolean
}


export enum StandardBtnKey {
    Enter = 0,
    Back = 1,
    Menu = 2,
    Detail = 3,

    Option = 8,
    Start = 9,

    Up = 12,
    Down = 13,
    Left = 14,
    Right = 15,

    L1 = 4,
    R1 = 5,

    L2 = 6,
    R2 = 7,

    L3 = 10,
    R3 = 11,
}

export class Gamepad {

    target: globalThis.Gamepad | null = null
    constructor() {
        this.loop()
    }

    private step(next: () => void) {
        // setTimeout(next, 1000);
        requestAnimationFrame(next)
    }

    btnsState: BtnState[] = []

    private loop() {
        const next = () => this.step(() => this.loop())

        if (!this.target) {
            this.findTarget()
            return next()
        }

        const gp = this.target
        const gpButtons = gp.buttons

        const oldState = this.btnsState

        const [up, down, newState] = gpButtons.reduce<[number[], number[], BtnState[]]>(([up, down, newState], btn, index) => {
            const value = btn.value
            const isPress = btn.value >= 0.5
            const old = oldState[index]
            if (!old) {
                newState.push({ value, isPress })
            } else {
                if (old.isPress === isPress) {
                    newState.push({ value, isPress })
                } else if (isPress) {
                    down.push(index)
                    newState.push({ value, isPress })
                } else {
                    up.push(index)
                    newState.push({ value, isPress })
                }
            }
            return [up, down, newState]
        }, [[], [], []])

        this.btnsState = newState

        up.forEach((idx) => {
            this.onKeyUp.emit(idx.toString() as any, undefined)
        })
        down.forEach((idx) => {
            this.onKeyDown.emit(idx.toString() as any, undefined)
        })

        this.findTarget()
        return next()
    }

    private findTarget() {
        const gamepads = navigator.getGamepads() || [null]
        this.target = gamepads[0];
        if (this.target && this.target.mapping.indexOf('standard') < 0) {
            this.target = null
        }
    }

    onKeyDown: Listener<Partial<{
        [P in StandardBtnKey]: undefined
    }>> = new Listener({
        [StandardBtnKey.Up]: () => { console.log('key up is down') },
        [StandardBtnKey.Down]: () => { console.log('key down is down') },
        [StandardBtnKey.Left]: () => { console.log('left up is down') },
        [StandardBtnKey.Right]: () => { console.log('right up is down') },
    })
    onKeyUp: Listener<Partial<{
        [P in StandardBtnKey]: undefined
    }>> = new Listener({
        [StandardBtnKey.Up]: () => { console.log('key up is up') },
        [StandardBtnKey.Down]: () => { console.log('key down is up') },
        [StandardBtnKey.Left]: () => { console.log('key right is up') },
        [StandardBtnKey.Right]: () => { console.log('key right is up') },
    })
}

