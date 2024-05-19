import { scheduler } from "@renderer/tools/state"
import { PromptActionBtn, PromptScreen, RenderText } from "./state"
import * as screen from '@renderer/tools/screen'

export const global = new class {
    list: PromptScreen[] = []

    new(option: {
        icon?: string
        content: RenderText
        detail?: RenderText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        const prompt = new PromptScreen(option)
        this.list.push(prompt)
        screen.global.push(prompt)
        scheduler.add(global.list)
    }

    remove(prompt: PromptScreen) {
        this.list = this.list.filter(v => v !== prompt)
        screen.global.remove(prompt)
        scheduler.add(global.list)
    }
}