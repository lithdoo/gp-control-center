import { AppScreen, FocusAction, FocusItem } from "./foucs";
import { Gamepad, StandardBtnKey } from './gamepad'
import { KeyBoard, KeyBoardCode } from "./keyboard";
import { Listener } from "./listener";

export const message = new FocusItem()
export const time = new FocusItem()

export const apps = new Array(10).fill(null).map(_ => new FocusItem())
export const settings = new Array(5).fill(null).map(_ => new FocusItem())


export const globalScreen = new class {
    stack: AppScreen[] = [];

    getCurrent() { return this.stack[this.stack.length - 1] ?? null }

    [FocusAction.UP]() {
        this.getCurrent()?.[FocusAction.UP]()
    }
    [FocusAction.DOWN]() {
        this.getCurrent()?.[FocusAction.DOWN]()
    }
    [FocusAction.LEFT]() {
        this.getCurrent()?.[FocusAction.LEFT]()
    }
    [FocusAction.RIGHT]() {
        this.getCurrent()?.[FocusAction.RIGHT]()
    }

    push(screen:AppScreen){
        this.stack.push(screen)
    }

    pop(){
        this.stack.pop()
    }
}


export const gamepad = new Gamepad()

export const keyBoard = new KeyBoard()


gamepad.onKeyUp = new Listener({
    [StandardBtnKey.Up]: () => {
        console.log('key up is down')
        globalScreen[FocusAction.UP]()
    },
    [StandardBtnKey.Down]: () => {
        console.log('key down is down')
        globalScreen[FocusAction.DOWN]()
    },
    [StandardBtnKey.Left]: () => {
        console.log('left up is down')
        globalScreen[FocusAction.LEFT]()
    },
    [StandardBtnKey.Right]: () => {
        console.log('right up is down')
        globalScreen[FocusAction.RIGHT]()
    },
})


keyBoard.onKeyUp = new Listener({
    [KeyBoardCode.Up]: () => {
        console.log('key up is down')
        globalScreen[FocusAction.UP]()
    },
    [KeyBoardCode.Down]: () => {
        console.log('key down is down')
        globalScreen[FocusAction.DOWN]()
    },
    [KeyBoardCode.Left]: () => {
        console.log('left up is down')
        globalScreen[FocusAction.LEFT]()
    },
    [KeyBoardCode.Right]: () => {
        console.log('right up is down')
        globalScreen[FocusAction.RIGHT]()
    },
})