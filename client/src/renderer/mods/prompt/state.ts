import { AppScreen, FocusItem, Focusable } from "@renderer/tools/foucs";

export type RenderText = string | { html: string }

export type ActionResult = void | {
    success: boolean
    message: RenderText
}

export class PromptScreen extends AppScreen {
    icon?: string

    content: RenderText = ''
    detail?: RenderText = ''

    current: null | PromptActionBtn = null
    actions: PromptActionBtn[] = []

    hidden: boolean = true
    index: number = 0

    close: () => void = () => { }


    constructor(option: {
        icon?: string
        content: RenderText
        detail?: RenderText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        super()
        Object.assign(this, option)
    }

    initBtnSwtich(){
        this.actions.forEach(action=>{
            action.left = ()=>{
                const item = this.actions.find((_,i,arr)=> arr[i-1] === action)
                return item ?? null
            }

            action.right = ()=>{
                const item = this.actions.find((_,i,arr)=> arr[i+1] === action)
                return item ?? null
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
        if (item && !(this.has(item))) {
            return
        }
        this.current?.onblur?.()
        this.current = item
        this.current?.onfocus?.()
    }

}

export class PromptActionBtn extends FocusItem {
    text: RenderText
    handle: () => Promise<ActionResult>
    constructor(text: RenderText, handle: () => Promise<ActionResult>) {
        super()
        this.text = text
        this.handle = handle
    }
}
