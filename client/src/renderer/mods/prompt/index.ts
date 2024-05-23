import { scheduler } from "@renderer/tools/state"
import { PromptActionBtn, PromptScreen } from "./state"
import { screen } from '@renderer/tools/screen'
import { NText } from "@renderer/tools/base"





export const prompt = new class {
    list: PromptScreen[] = []

    @scheduler.afterCallSync()
    new(option: {
        icon?: JSX.Element
        content: NText
        detail?: NText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        const prompt = new PromptScreen(option)
        console.log(this)
        prompt.close = () => {
            console.log('close')
            this.remove(prompt)
            screen.remove(prompt)
        }
        this.list = this.list.concat([prompt])
        screen.push(prompt)
        scheduler.add(prompt)
        scheduler.add(this)
        scheduler.add(this.list)

        return prompt
    }

    remove(prompt: PromptScreen) {
        this.list = this.list.filter(v => v !== prompt)
        console.log(this)
        screen.remove(prompt)
        scheduler.add(prompt)
        scheduler.add(this)
        scheduler.add(this.list)
    }
}