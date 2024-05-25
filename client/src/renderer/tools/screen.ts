import { AppScreen, FocusAction, FocusItem } from "./foucs";
import { Gamepad, StandardBtnKey } from './gamepad'
import { KeyBoard, KeyBoardCode } from "./keyboard";
import { Listener } from "./listener";
import { scheduler } from "./state";

export const message = new FocusItem()
export const time = new FocusItem()

export const apps = new Array(10).fill(null).map(_ => new FocusItem())
export const settings = new Array(5).fill(null).map(_ => new FocusItem())



export const screen = new class GlobalScreen {
    stack: AppScreen[] = [];

    getCurrent() { return this.stack[this.stack.length - 1] ?? null }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.UP]() {
        this.getCurrent()?.[FocusAction.UP]()

    }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.DOWN]() {
        this.getCurrent()?.[FocusAction.DOWN]()
        const current = this.getCurrent()
        if (current) scheduler.add(current)
    }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.LEFT]() {
        this.getCurrent()?.[FocusAction.LEFT]()
    }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.RIGHT]() {
        this.getCurrent()?.[FocusAction.RIGHT]()
    }
    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.ENTER]() {
        this.getCurrent()?.[FocusAction.ENTER]()
    }
 
    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    [FocusAction.START]() {
        console.log('start', this.getCurrent())
        this.getCurrent()?.[FocusAction.START]()
    }


    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    push(screen: AppScreen) {
        this.stack = this.stack.filter(v => v !== screen).concat([screen])
    }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    pop() {
        this.stack.pop()
    }

    @scheduler.callSync<GlobalScreen>((t) => [
        t.getCurrent()
    ])
    remove(screen: AppScreen) {
        this.stack = this.stack.filter(v => v !== screen)
    }

}



export const gamepad = new Gamepad()

export const keyBoard = new KeyBoard()


gamepad.onKeyUp = new Listener({
    [StandardBtnKey.Up]: () => {
        console.log('key up is down')
        screen[FocusAction.UP]()
    },
    [StandardBtnKey.Down]: () => {
        console.log('key down is down')
        screen[FocusAction.DOWN]()
    },
    [StandardBtnKey.Left]: () => {
        console.log('left up is down')
        screen[FocusAction.LEFT]()
    },
    [StandardBtnKey.Right]: () => {
        console.log('right up is down')
        screen[FocusAction.RIGHT]()
    },
})


keyBoard.onKeyUp = new Listener({
    [KeyBoardCode.Up]: () => {
        console.log('key up is down')
        screen[FocusAction.UP]()
    },
    [KeyBoardCode.Down]: () => {
        console.log('key down is down')
        screen[FocusAction.DOWN]()
    },
    [KeyBoardCode.Left]: () => {
        console.log('left up is down')
        screen[FocusAction.LEFT]()
    },
    [KeyBoardCode.Right]: () => {
        console.log('right up is down')
        screen[FocusAction.RIGHT]()
    },
    [KeyBoardCode.Enter]: () => {
        console.log('enter up is down')
        screen[FocusAction.ENTER]()
    },
    [KeyBoardCode.Start]: () => {
        console.log('Start up is down')
        screen[FocusAction.START]()
    }
})