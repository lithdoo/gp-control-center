import { AppScreen } from "@renderer/tools/foucs"
import { AppCenter, AppProcess } from "./state"





export const app = new AppCenter()


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