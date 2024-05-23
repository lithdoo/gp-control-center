import { scheduler,loggedMethod } from "@renderer/tools/state"
import { PromptActionBtn, PromptScreen } from "./state"
import { screen } from '@renderer/tools/screen'
import { NText } from "@renderer/tools/base"





export const prompt = new class {
    list: PromptScreen[] = []

    @scheduler.callSync((that)=>[
        that,that.list
    ])
    new(option: {
        icon?: JSX.Element
        content: NText
        detail?: NText
        current?: null | PromptActionBtn
        actions?: PromptActionBtn[]
    }) {
        const prompt = new PromptScreen(option)
        prompt.close = () => {
            console.log('close')
            this.remove(prompt)
            screen.remove(prompt)
        }
        this.list = this.list.concat([prompt])
        screen.push(prompt)
        return prompt
    }
    
    @scheduler.callSync((that)=>[
        that,that.list
    ])
    remove(prompt: PromptScreen) {
        this.list = this.list.filter(v => v !== prompt)
        screen.remove(prompt)
    }
}