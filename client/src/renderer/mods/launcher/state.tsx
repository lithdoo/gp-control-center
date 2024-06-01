import { screen } from "@renderer/tools/screen"
import { AppGridLayout, AppScreen, FocusAction, FocusItem, Focusable } from "@renderer/tools/foucs"
import { prompt } from '@renderer/mods/prompt'
import { PromptActionBtn } from "../prompt/state"
import { PromptWaitIcon } from "../prompt/render"
import { app, AppCenter, AppLauncher } from "../app"
import { TestApp } from "@renderer/apps/Test"
import { DataBinder, DataWatcher, scheduler } from "@renderer/tools/state"
import { NxColor } from "@renderer/tools/base"


const openWaitPrompt = (
    option: { content: string, sec: number },
    then: () => void,
    cancel: () => void) => {


    const target = prompt.new({
        content: option.content,
        icon: <PromptWaitIcon sec={option.sec} onFinish={then} />,
        detail: '',
        actions: [new PromptActionBtn('取消', async () => {
            target.close()
            cancel()
        }),]
    })

}




export const mainScreen = new class MainScreen extends AppScreen {

    grid: AppGridLayout = new AppGridLayout()
    constructor() {
        super()
        const time = new FocusItem()
        const settings = new Array(5).fill(null).map(_ => new FocusItem())
        const message = new FocusItem()
        message[FocusAction.ENTER] = () => {
            const target = prompt.new({
                content: '电源选项',
                detail: '',
                actions: [
                    new PromptActionBtn('取消', async () => { target.close() }),
                    new PromptActionBtn('关机', async () => {
                        openWaitPrompt(
                            { content: '关机', sec: 5 },
                            () => { alert('关机') },
                            () => { target.close() }
                        )

                    }, { color: NxColor.salmon, icon: 'power' }),
                    new PromptActionBtn('重启', async () => {
                        openWaitPrompt(
                            { content: '重启', sec: 5 },
                            () => { alert('重启') },
                            () => { target.close() }
                        )
                    }, { color: NxColor.blue, icon: 'refresh' }),
                    new PromptActionBtn('退出桌面', async () => {
                        openWaitPrompt(
                            { content: '重启', sec: 5 },
                            () => { window.api.exit() },
                            () => { target.close() }
                        )
                    }, { color: NxColor.green, icon: 'exit' }),
                ]
            })
            return null
        }
        this.grid.line(message, time) // toolbar line
        this.grid.line(...app.launchers) // application line
        this.grid.line(...settings) // settings line

        screen.push(this)

        const binder = new DataBinder(app)
        const watcher = new DataWatcher<AppCenter, AppLauncher[]>(
            (app) => app.launchers,
            (_, list) => { this.grid.setLine(1, list) })

        binder.add(watcher)
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

    applications() {
        return this.grid.getLine(1).list as AppLauncher[]
    }
    settings() {
        return this.grid.getLine(2).list
    }
    message() {
        return this.grid.getLine(0).list[0]
    }

    @scheduler.callSync(t => [t])
    setLine(idx: number, list: Focusable[]) {
        this.grid.setLine(idx, list)
    }

    focus(item: Focusable | null): boolean | undefined {
        const res = super.focus(item)

        const current: AppLauncher | Focusable | null = this.getCurrent() as (AppLauncher | Focusable | null)


        if (!(current instanceof AppLauncher)) return res
        if (!this.grid.getLine(1).list.find(v => v === current)) return res
        if (!current.element) return res
        if (!current.element.parentElement) return res

        const element = current.element
        const parent = current.element.parentElement

        const { width: parentWidth } = parent.getBoundingClientRect()
        const { width: elementWidth } = element.getBoundingClientRect()

        const offsetLeft = element.offsetLeft

        const scrollLeft = offsetLeft + 0.5 * elementWidth - 0.5 * parentWidth

        parent.scrollTo({ left: scrollLeft, behavior: 'smooth' })

        return res
    }

}


