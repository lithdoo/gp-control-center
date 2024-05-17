import { AppScreen, FocusItem, Focusable } from "@renderer/tools/foucs";


export type Text = string | { html: string }

export type ActionResult = void | {
    success: boolean
    message: Text
}

export class PromptScreen extends AppScreen {
    icon?: string

    content: Text = ''
    detail: Text = ''

    current: null | PromptActionBtn = null
    actions: PromptActionBtn[] = []

    hidden: boolean = true

    index: number = 0

    has(item: Focusable): boolean {
        return this.actions.findIndex(v => v === item) >= 0
    }

    default(): PromptActionBtn | null {
        return this.actions[0] ?? null
    }

    getCurrent(): PromptActionBtn | null {
        return this.current
    }

    setCurrent(item: PromptActionBtn | null): void {
        if (item && !(this.has(item))) {
            return
        }
        this.current?.onblur?.()
        this.current = item
        this.current?.onfocus?.()
    }


    cancel() {

    }
}

export class PromptActionBtn extends FocusItem {
    text: Text
    handle: () => Promise<ActionResult>
    constructor(text: Text, handle: () => Promise<ActionResult>) {
        super()
        this.text = text
        this.handle = handle
    }
}