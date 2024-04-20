import { Listener } from "./listener"


interface BtnState {
    value: number
    isPress: boolean
}


export enum StandardBtnKey {
    enter = 0,
    back = 1,
    menu = 2,
    detail = 3,

    option = 8,
    start = 9,

    up = 12,
    down = 13,
    left = 14,
    right = 15,

    l = 4,
    r = 5,

    zl = 6,
    zr = 7,

    pl = 10,
    pr = 11,
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
            console.log(idx)
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
        [StandardBtnKey.up]: () => { console.log('key up is down') },
        [StandardBtnKey.down]: () => { console.log('key down is down') },
        [StandardBtnKey.left]: () => { console.log('left up is down') },
        [StandardBtnKey.right]: () => { console.log('right up is down') },
    })
    onKeyUp: Listener<Partial<{
        [P in StandardBtnKey]: undefined
    }>> = new Listener({
        [StandardBtnKey.up]: () => { console.log('key up is up') },
        [StandardBtnKey.down]: () => { console.log('key down is up') },
        [StandardBtnKey.left]: () => { console.log('key right is up') },
        [StandardBtnKey.right]: () => { console.log('key right is up') },
    })
}

