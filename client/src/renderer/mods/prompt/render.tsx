import { block, element, style } from "@renderer/tools/style"
import { PromptScreen, RenderText } from "./state"
import { useWatch } from "@renderer/tools/state"
import * as prompt from './index'


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


export const UText = ({ text }: { text: RenderText }) => {
    return (typeof text === 'string'
        ? <p>{text}</p>
        : <p ref={ref => { if (ref) ref.innerHTML = text.html }}></p>
    )
}

export const PromptContainer = () => {
    const list = useWatch(prompt.global.list, (list) => [...list])
    console.log('render')
    return <div>{
        list.map(v => <PromptModal screen={v} key={v.$key} />)
    }</div>
}

export const PromptModal = ({ screen }: { screen: PromptScreen }) => {
    const target = useWatch(screen, (screen) => ({ ...screen }))
    const currentId = useWatch(screen,(screen)=>(screen.getCurrent()?.$key))
    return <div className={[
        $prompt_modal.$,
        target.hidden ? $prompt_modal._.hidden.$ : ''
    ].join(' ')}>
        <div className={$prompt_modal.bg.$}></div>
        <div className={$prompt_modal.icon.$}></div>
        <div className={$prompt_modal.content.$}>
            <UText text={target.content}></UText>
        </div>
        <div className={$prompt_modal.detail.$}>{
            target.detail
                ? <UText text={target.detail}></UText>
                : ''
        }
        </div>
        <ul className={$prompt_modal.action_list.$}>{
            target.actions.map(action => <li className={[
                $prompt_modal.action_btn.$,
                currentId === action.$key
                    ? $prompt_modal.action_btn.current.$
                    : ''
            ].join(' ')}>
                <UText text={action.text}></UText>
            </li>)
        }</ul>
    </div>
}


style()
    .load([$prompt_modal.$], {
        height: '100%',
        width: '100%',
        position: 'fixed',
        top: '0', left: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        paddingBottom:'56px'
    })
    .load([$prompt_modal.bg.$], {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: '0', left: '0',
        background: 'rgba(255,255,255,0.8)',
        zIndex: '-1'
    })
    .load([$prompt_modal.content.$], {
        fontWeight: '600',
        width: '60%',
        fontSize:'18px',
        margin: '12px 0'
    })
    .load([$prompt_modal.detail.$], {
        width: '60%',
        color: '#666',
    })
    .load([$prompt_modal.action_list.$],{
        display:"flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',   
    })
    .load([$prompt_modal.action_btn.$],{
        height: '36px',
        lineHeight: '35px',
        margin: '16px 4px',
        padding: '0 16px',
        minWidth: '72px',
        textAlign: 'center',
        borderRadius: '4px'
    })
    .load([$prompt_modal.action_btn.current.$],{
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        color: '#ccc',
        background: '#666'
    })
    .inject()