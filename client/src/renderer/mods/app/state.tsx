import { NxColor, NxBtn, NxText } from "@renderer/tools/base"
import { AppScreen, FocusAction, FocusItem } from "@renderer/tools/foucs"
import { scheduler } from "@renderer/tools/state"
import { screen } from '@renderer/tools/screen'

export interface AppBase {
    keyName: string
    start(argu: unknown): AppProcess
}

export interface AppProcess {
    appKeyName: string
    processId: string
    view: JSX.Element
    screen: AppScreen
    destroy(): Promise<void>
}

export class AppCenter {
    table: Map<string, AppBase> = new Map()
    processing: AppProcess[] = []

    current: AppProcess | null = null
    holdScreen: AppHoldingScreen | null = null
    appHoldingSc

    regist(app: AppBase) {
        this.table.set(app.keyName, app)
    }

    @scheduler.callSync((t) => [t])
    async start(keyName: string, argu: unknown) {
        const old = this.processing.find(v => v.appKeyName === keyName)
        if (old) {
            await this.holding(old)
        } else {
            const process = this.table.get(keyName)?.start(argu)
            if (!process) return
            console.log(process.screen)
            process.screen[FocusAction.START] = () => {
                console.log('hold')
                this.holding(process)
            }
            await this.enter(process)
        }
    }

    // 进入 holding 状态
    @scheduler.callSync((t) => [t])
    private holding(process: AppProcess) {
        this.current = process
        this.processing = this.processing.filter(v => v === process).concat([process])
        this.processing.forEach(v => screen.remove(v.screen))
        this.holdScreen = this.holdScreen ?? new AppHoldingScreen(this, process)
        screen.push(this.holdScreen)
    }

    // 进入应用
    @scheduler.callSync((t) => [t])
    async enter(process: AppProcess) {
        if (this.holdScreen) {
            screen.remove(this.holdScreen)
            this.holdScreen = null
        }
        this.processing = this.processing
            .filter(v => v !== process)
            .concat([process])
        this.processing.forEach(v => screen.remove(v.screen))
        this.current = process
        screen.push(process.screen)
    }

    // 退出到主界面
    @scheduler.callSync((t) => [t])
    async exit() {
        if (this.holdScreen) {
            screen.remove(this.holdScreen)
            this.holdScreen = null
        }
        if (this.current) {
            this.current = null
        }
        this.processing.forEach(v => screen.remove(v.screen))
    }

    @scheduler.callSync((t) => [t])
    async destroy(process: AppProcess) {
        this.processing = this.processing.filter(v => v !== process)
        screen.remove(process.screen)
        if (this.current === process) {
            this.current = null
            if (this.holdScreen) {
                screen.remove(this.holdScreen)
                this.holdScreen = null
            }
        }
        return await process.destroy()
    }
}



export class AppHoldingScreen extends AppScreen {


    actions: FocusNxBtn[] = []
    center: AppCenter
    process: AppProcess
    constructor(ceter: AppCenter, process: AppProcess) {
        super()
        this.center = ceter
        this.process = process
        this.initActions()
    }
    default() {
        return this.actions[0] ?? null
    }

    has(item) {
        return !!this.actions.find(v => v === item)
    }

    current: null | FocusItem = null
    getCurrent() { return this.current }
    setCurrent(current) { this.current = current }

    private initActions() {
        const enter = new FocusNxBtn()
        enter.text = '返回任务'
        enter.color = NxColor.gray
        enter.icon = 'exit'
        enter.click = () => this.center.enter(this.process)
        const exit = new FocusNxBtn()
        exit.text = '主界面'
        exit.color = NxColor.blue
        exit.icon = 'home'
        exit.click = () => this.center.exit()
        const destry = new FocusNxBtn()
        destry.text = '结束任务'
        destry.color = NxColor.yellow
        destry.icon = 'del'
        destry.click = () => this.center.destroy(this.process)

        this.current = enter
        this.actions = [enter, exit, destry]
        this.actions.forEach((aciton) => {
            aciton.isActive = () => {
                return this.current === aciton
            }
            aciton[FocusAction.LEFT] = () => {
                return this.actions.find((_, idx) => this.actions[idx + 1] === aciton) ?? null
            }
            aciton[FocusAction.RIGHT] = () => {
                return this.actions.find((_, idx) => this.actions[idx - 1] === aciton) ?? null
            }
        })
    }
}

class FocusNxBtn extends FocusItem implements NxBtn {

    text: NxText = '退出'
    icon: string = 'exit'
    key: string = this.$key
    color: NxColor = NxColor.gray
    get active() {
        return this.isActive()
    }

    isActive: () => boolean = () => false
    click: () => void = () => { }

    constructor() {
        super()
        this[FocusAction.ENTER] = () => {
            this.click()
            return null
        }
    }
}

