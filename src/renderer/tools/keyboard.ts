import { Listener } from "./listener"

export enum KeyBoardCode {
    Enter = 13,
    Back = 27,
    Menu = 32,
    Detail = 9,

    Option = 79,
    Start = 83,

    Up = 38,
    Down = 40,
    Left = 37,
    Right = 39,

    L = 219,
    R = 221,

    ZL = 186,
    ZR = 222,

    PL = 188,
    PR = 190,
}


export class KeyBoard {

    private keydown = (e: KeyboardEvent) => {
        this.onKeyDown.emit(e.keyCode.toString(), undefined)
    }
    private keyup = (e: KeyboardEvent) => {
        this.onKeyUp.emit(e.keyCode.toString(), undefined)
    }

    constructor() {
        document.addEventListener('keydown', this.keydown)
        document.addEventListener('keyup', this.keyup)
    }

    destory() {
        document.removeEventListener('keydown', this.keydown)
        document.removeEventListener('keyup', this.keyup)
    }


    onKeyDown: Listener<Partial<{
        [P in KeyBoardCode]: undefined
    }>> = new Listener({
        [KeyBoardCode.Up]: () => { console.log('key up is down') },
        [KeyBoardCode.Down]: () => { console.log('key down is down') },
        [KeyBoardCode.Left]: () => { console.log('left up is down') },
        [KeyBoardCode.Right]: () => { console.log('right up is down') },
    })
    onKeyUp: Listener<Partial<{
        [P in KeyBoardCode]: undefined
    }>> = new Listener({
        [KeyBoardCode.Up]: () => { console.log('key up is up') },
        [KeyBoardCode.Down]: () => { console.log('key down is up') },
        [KeyBoardCode.Left]: () => { console.log('key right is up') },
        [KeyBoardCode.Right]: () => { console.log('key right is up') },
    })
}