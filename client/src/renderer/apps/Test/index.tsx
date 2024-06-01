
import { AppProcess } from "@renderer/mods/app"
import { AppScreen } from "@renderer/tools/foucs"
import icon from '@renderer/assets/electron.svg'

export class TestApp implements AppProcess {
    static keyName = 'test-app'
    static icon = icon
    static start = () => new TestApp()

    appKeyName = TestApp.keyName
    processId: string
    view: JSX.Element
    screen: AppScreen

    constructor() {
        this.processId = ''
        this.view = <div style={{color:'red'}}>test</div>
        this.screen = new TestAppScreen()
    }

    async destroy() { }
}

class TestAppScreen extends AppScreen {

    getCurrent() { return null }
    setCurrent() { }

    has() { return false }
    default() { return null }
}
