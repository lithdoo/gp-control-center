import { globalScreen } from "../tools/screen"
import { AppGridLayout, AppScreen, FocusItem } from "../tools/foucs"
import { GpApp } from "./app"

export const message = new FocusItem()
export const time = new FocusItem()

export const apps = new Array(10).fill(null).map(_ => new GpApp())
export const settings = new Array(5).fill(null).map(_ => new FocusItem())


export const mainScreen = new class MainScreen extends AppScreen {

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

        console.log('parent', parent)

        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' })

        console.log({
            element, parent, offsetLeft, parentWidth, elementWidth
        })

        return res
    }

}

mainScreen.toolbar(message, time)
mainScreen.applications(...apps)
mainScreen.settings(...settings)

globalScreen.push(mainScreen)