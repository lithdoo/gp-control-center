import { scheduler } from "@renderer/tools/state"
import { PromptActionBtn, PromptScreen } from "./state"
import * as screen from '@renderer/tools/screen'
import { NText } from "@renderer/tools/base"

export const global = new class {
    list: PromptScreen[] = []

    new(option: {
        icon?: JSX.Element
        content: NText
        detail?: NText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        const prompt = new PromptScreen(option)
        prompt.close = ()=>{
            console.log('close')
            this.remove(prompt)
            screen.global.remove(prompt)
        }
        this.list= this.list.concat([prompt])
        screen.global.push(prompt)
        scheduler.add(global)
    }

    remove(prompt: PromptScreen) {
        this.list = this.list.filter(v => v !== prompt)
        console.log(this)
        screen.global.remove(prompt)
        scheduler.add(global)
    }
}