import { AppScreen, FocusAction, FocusItem } from "./foucs";
import { Gamepad, StandardBtnKey } from './gamepad'
import { KeyBoard, KeyBoardCode } from "./keyboard";
import { Listener } from "./listener";
import { scheduler } from "./state";

export const message = new FocusItem()
export const time = new FocusItem()

export const apps = new Array(10).fill(null).map(_ => new FocusItem())
export const settings = new Array(5).fill(null).map(_ => new FocusItem())


export const global = new class {
    stack: AppScreen[] = [];

    getCurrent() { return this.stack[this.stack.length - 1] ?? null }

    [FocusAction.UP]() {
        this.getCurrent()?.[FocusAction.UP]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)

    }
    [FocusAction.DOWN]() {
        this.getCurrent()?.[FocusAction.DOWN]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }
    [FocusAction.LEFT]() {
        this.getCurrent()?.[FocusAction.LEFT]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }
    [FocusAction.RIGHT]() {
        this.getCurrent()?.[FocusAction.RIGHT]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }
    [FocusAction.ENTER]() {
        this.getCurrent()?.[FocusAction.ENTER]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }

    push(screen: AppScreen) {
        this.stack.push(screen)
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }

    pop() {
        this.stack.pop()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }

    remove(screen: AppScreen) {
        this.stack = this.stack.filter(v => v !== screen)
    }

}


export const gamepad = new Gamepad()

export const keyBoard = new KeyBoard()


gamepad.onKeyUp = new Listener({
    [StandardBtnKey.Up]: () => {
        console.log('key up is down')
        global[FocusAction.UP]()
    },
    [StandardBtnKey.Down]: () => {
        console.log('key down is down')
        global[FocusAction.DOWN]()
    },
    [StandardBtnKey.Left]: () => {
        console.log('left up is down')
        global[FocusAction.LEFT]()
    },
    [StandardBtnKey.Right]: () => {
        console.log('right up is down')
        global[FocusAction.RIGHT]()
    },
})


keyBoard.onKeyUp = new Listener({
    [KeyBoardCode.Up]: () => {
        console.log('key up is down')
        global[FocusAction.UP]()
    },
    [KeyBoardCode.Down]: () => {
        console.log('key down is down')
        global[FocusAction.DOWN]()
    },
    [KeyBoardCode.Left]: () => {
        console.log('left up is down')
        global[FocusAction.LEFT]()
    },
    [KeyBoardCode.Right]: () => {
        console.log('right up is down')
        global[FocusAction.RIGHT]()
    },
    [KeyBoardCode.Enter]:()=>{
        console.log('enter up is down')
        global[FocusAction.ENTER]()
    }
})