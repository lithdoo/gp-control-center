import { block, element } from "@renderer/tools/style"
import { PromptScreen } from "./state"
import { useWatch } from "@renderer/tools/state"


const $prompt_modal = block('prompt_modal')
    .load(element('_').modifier('hidden'))
    .load(element('bg'))
    .load(element('icon'))
    .load(element('content'))
    .load(element('detail'))
    .load(element('action_list'))
    .load(element('action_btn')
        .modifier('current')
        .modifier('with_error')
    )
    .build()

export const PromptModal = ({ screen }: { screen: PromptScreen }) => {
    const target = useWatch(screen, (screen) => screen)
    return <div className={[
        $prompt_modal.$,
        target.hidden ? $prompt_modal._.hidden : ''
    ].join(' ')}>
        <div className={$prompt_modal.bg.$}></div>
        <div className={$prompt_modal.icon.$}></div>
        <div className={$prompt_modal.content.$}></div>
        <div className={$prompt_modal.detail.$}></div>
        <ul className={$prompt_modal.action_list.$}>{
            target.actions.map(action => <li className={[
                $prompt_modal.action_btn.$,
                target.getCurrent()?.$key === action.$key
                    ? $prompt_modal.action_btn.current
                    : ''
            ].join(' ')}>
            </li>)
        }</ul>
    </div>
}