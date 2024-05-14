import { AppGridLayout, AppScreen, FocusAction, FocusItem } from "./tools/foucs";
import { Gamepad, StandardBtnKey } from './tools/gamepad'
import { KeyBoard, KeyBoardCode } from "./tools/keyboard";
import { Listener } from "./tools/listener";

export const message = new FocusItem()
export const time = new FocusItem()

export const apps = new Array(10).fill(null).map(_ => new FocusItem())
export const settings = new Array(5).fill(null).map(_ => new FocusItem())


const mainScreen = new class MainScreen extends AppScreen {

    grid: AppGridLayout = new AppGridLayout()
    constructor() {
        super()
        this.grid.line() // toolbar line
        this.grid.line() // application line
        this.grid.line() // settings line
    }

    getCurrent(): FocusItem | null {
        return this.grid.getCurrent()
    }

    setCurrent(item: FocusItem | null): void {
        return this.grid.setCurrent(item)
    }

    has(item: FocusItem): boolean {
        return this.grid.has(item)
    }

    default(): FocusItem | null {
        return this.grid.default()
    }

    applications(...list: FocusItem[]) {
        this.grid.setLine(1, list)
    }
    settings(...list: FocusItem[]) {
        this.grid.setLine(2, list)
    }
    toolbar(...list: FocusItem[]) {
        this.grid.setLine(0, list)
    }


    focus(item: FocusItem | null): boolean | undefined {
        const res = super.focus(item)

        const current = this.getCurrent()

        if (!current) return res
        if (!current.target) return res
        if (!current.target.parentElement) return res
        if (!this.grid.getLine(1).list.find(v => v === current)) return res

        const element = current.target
        const parent = current.target.parentElement

        const { width: parentWidth } = parent.getBoundingClientRect()
        const { width: elementWidth } = element.getBoundingClientRect()

        const offsetLeft = element.offsetLeft

        const scrollLeft = offsetLeft + 0.5 * elementWidth - 0.5 * parentWidth

        console.log('parent',parent)

        parent.scrollTo({left:scrollLeft,behavior:'smooth'})

        console.log({
            element,parent,offsetLeft,parentWidth,elementWidth
        })

        return res
    }

}

mainScreen.toolbar(message, time)
mainScreen.applications(...apps)
mainScreen.settings(...settings)
// mainScreen.focus(message)




export const gamepad = new Gamepad()

export const keyBoard = new KeyBoard()


gamepad.onKeyUp = new Listener({
    [StandardBtnKey.Up]: () => {
        console.log('key up is down')
        mainScreen[FocusAction.UP]()
    },
    [StandardBtnKey.Down]: () => {
        console.log('key down is down')
        mainScreen[FocusAction.DOWN]()
    },
    [StandardBtnKey.Left]: () => {
        console.log('left up is down')
        mainScreen[FocusAction.LEFT]()
    },
    [StandardBtnKey.Right]: () => {
        console.log('right up is down')
        mainScreen[FocusAction.RIGHT]()
    },
})


keyBoard.onKeyUp = new Listener({
    [KeyBoardCode.Up]: () => {
        console.log('key up is down')
        mainScreen[FocusAction.UP]()
    },
    [KeyBoardCode.Down]: () => {
        console.log('key down is down')
        mainScreen[FocusAction.DOWN]()
    },
    [KeyBoardCode.Left]: () => {
        console.log('left up is down')
        mainScreen[FocusAction.LEFT]()
    },
    [KeyBoardCode.Right]: () => {
        console.log('right up is down')
        mainScreen[FocusAction.RIGHT]()
    },
})