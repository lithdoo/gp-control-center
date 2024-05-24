import { AppScreen } from "@renderer/tools/foucs"
import { screen } from '@renderer/tools/screen'
import { scheduler } from "@renderer/tools/state"




class Application {
    table: Map<string, AppBase> = new Map()
    processing: AppProcess[] = []

    current: AppProcess | null = null

    regist(app: AppBase) {
        this.table.set(app.keyName, app)
    }

    @scheduler.callSync((t) => [t])
    async start(keyName: string, argu: unknown) {
        const old = this.processing.find(v => v.appKeyName === keyName)
        const app = this.table.get(keyName)
        const process = old?.update(argu) ?? app?.start(argu)
        if (!process) return
        if (old && old !== process) {
            await this.destroy(old)
        }
        return await this.run(process)
    }

    private async run(process: AppProcess) {
        this.processing = this.processing.concat([process])
        this.setCurrent(process)
    }

    private async destroy(process: AppProcess) {
        this.processing = this.processing.filter(v => v !== process)
        this.removeCurrent(process)
        return await process.destroy()
    }

    private setCurrent(process: AppProcess) {
        this.current = this.processing.find(v => v == process) ?? null
        if (this.current) screen.push(this.current.screen)
    }

    private removeCurrent(process?: AppProcess) {
        if (process && this.current !== process) {
            return
        }
        if (this.current) {
            screen.remove(this.current.screen)
            this.current = null
        }
    }
}


export const app = new Application()

interface AppBase {
    keyName: string
    start(argu: unknown): AppProcess
}

interface AppProcess {
    appKeyName: string
    processId: string
    view: JSX.Element
    screen: AppScreen
    update(argu: unknown): AppProcess
    destroy(): Promise<void>
}

export class TestApp implements AppProcess {
    static keyName = 'test-app'

    appKeyName = TestApp.keyName
    processId: string
    view: JSX.Element
    screen: AppScreen

    constructor() {
        this.processId = ''
        this.view = <div>test</div>
        this.screen = new TestAppScreen()
    }

    update(argu: unknown): AppProcess {
        return this
    }
    async destroy() { }
}

class TestAppScreen extends AppScreen {

    getCurrent() { return null }
    setCurrent() { }

    has() { return false }
    default() { return null }
}


app.regist({
    keyName: TestApp.keyName,
    start: () => new TestApp()
})
