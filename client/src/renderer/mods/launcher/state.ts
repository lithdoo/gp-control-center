import { global } from "@renderer/tools/screen"
import { AppGridLayout, AppScreen, FocusAction, FocusItem, Focusable } from "@renderer/tools/foucs"
import { GpApp } from "./app"
import * as prompt from '@renderer/mods/prompt'
import { PromptActionBtn } from "../prompt/state"
import { NColor } from "@renderer/tools/base"

export const message = new FocusItem()
message[FocusAction.ENTER] = () => {
    prompt.global.new({
        content: 'Are You Sure Delete This File?',
        detail: 'Confirm Modal designed by Arash Manteghi. Connect with them on Dribbble; the global community for designers and creative professionals.',
        actions: [
            new PromptActionBtn('取消', async ({close}) => {close()}),
            new PromptActionBtn('关机', async () => { }, { color: NColor.salmon, icon: 'power' }),
            new PromptActionBtn('重启', async () => { }, { color: NColor.blue, icon: 'refresh' }),
            new PromptActionBtn('退出桌面', async () => { }, { color: NColor.green, icon: 'exit' }),
        ]
    })


}
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

    getCurrent() {
        return this.grid.getCurrent()
    }

    setCurrent(item: Focusable | null) {
        return this.grid.setCurrent(item)
    }

    has(item: Focusable): boolean {
        return this.grid.has(item)
    }

    default() {
        return this.grid.default()
    }

    applications(...list: Focusable[]) {
        this.grid.setLine(1, list)
    }
    settings(...list: Focusable[]) {
        this.grid.setLine(2, list)
    }
    toolbar(...list: Focusable[]) {
        this.grid.setLine(0, list)
    }


    focus(item: Focusable | null): boolean | undefined {
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

global.push(mainScreen)