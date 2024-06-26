import { NxColor, NxText } from "@renderer/tools/base";
import { AppScreen, FocusAction, FocusItem, Focusable } from "@renderer/tools/foucs";

export type ActionResult = void | {
    success: boolean
    message: NxText
}

export class PromptScreen extends AppScreen {
    icon?: JSX.Element

    content: NxText = ''
    detail?: NxText = ''

    current: null | PromptActionBtn = null
    actions: PromptActionBtn[] = []

    hidden: boolean = true
    index: number = 0

    close: () => void = () => { }


    constructor(option: {
        icon?: JSX.Element
        content: NxText
        detail?: NxText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        super()
        Object.assign(this, option)
        this.initBtnSwtich()
    }

    initBtnSwtich() {
        this.actions.forEach(action => {
            action[FocusAction.LEFT] = () => {
                const item = this.actions.find((_, i, arr) => arr[i + 1] === action)
                return item ?? null
            }

            action[FocusAction.RIGHT] = () => {
                const item = this.actions.find((_, i, arr) => arr[i - 1] === action)
                return item ?? null
            }

            action[FocusAction.ENTER] = () => {
                action.handle({close:()=>this.close()})
                return null
            }
        })
    }

    has(item: Focusable): boolean {
        return this.actions.findIndex(v => v === item) >= 0
    }

    default(): PromptActionBtn | null {
        return this.actions[0] ?? null
    }

    getCurrent(): PromptActionBtn | null {
        return this.current ?? this.actions[0] ?? null
    }

    setCurrent(item: PromptActionBtn | null): void {
        console.log('setcurrent', item)
        if (item && !(this.has(item))) {
            return
        }
        this.current?.onblur?.()
        this.current = item
        this.current?.onfocus?.()
    }

}

export class PromptActionBtn extends FocusItem {
    text: NxText
    icon: string
    color: NxColor
    handle: (option: { close: () => void }) => Promise<ActionResult>
    constructor(
        text: NxText, handle: (option: { close: () => void })=> Promise<ActionResult>, {
            icon = 'back', color = NxColor.gray
        }: { icon?: string, color?: NxColor } = {}) {
        super()
        this.text = text
        this.handle = handle
        this.icon = icon
        this.color = color
    }

}
