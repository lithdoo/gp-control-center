import { block, element, style } from "@renderer/tools/style"
import { PromptScreen } from "./state"
import { useWatch } from "@renderer/tools/state"
import * as prompt from './index'
import { NText } from "@renderer/tools/base"
import { useEffect, useRef, useState } from "react"


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
    .load(element('action_btn_icon'))
    .load(element('action_btn_text'))
    .build()


export const UText = ({ text }: { text: NText }) => {
    return (typeof text === 'string'
        ? <p>{text}</p>
        : <p ref={ref => { if (ref) ref.innerHTML = text.html }}></p>
    )
}

export const UIcon = ({ name }: { name: string }) => {
    return <svg className="icon" aria-hidden="true">
        <use xlinkHref={'#gp-' + name}></use>
    </svg>
}

export const PromptView = () => {
    const list = useWatch(prompt.prompt, (global) => [...global.list])
    return <div>{
        list.map((v, i, arr) => <PromptModal key={v.$key} screen={v} active={i === arr.length - 1} />)
    }</div>
}

export const PromptModal = ({ screen, active }: { screen: PromptScreen, active: boolean }) => {
    const target = useWatch(screen, (screen) => ({ ...screen }))
    const currentId = useWatch(screen, (screen) => (screen.getCurrent()?.$key))
    return <div className={[
        $prompt_modal.$,
        active ? '' : $prompt_modal._.hidden.$
    ].join(' ')}>
        <div className={$prompt_modal.bg.$}></div>
        <div className={$prompt_modal.icon.$}>
            {target.icon ?? ''}
        </div>
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
            target.actions.map(action => <li
                key={action.$key}
                className={[
                    $prompt_modal.action_btn.$,
                    currentId === action.$key
                        ? $prompt_modal.action_btn.current.$
                        : ''
                ].join(' ')}
                ref={ref => {
                    if (!ref) return
                    ref.style.setProperty('--action-btn-color', action.color.current())
                    ref.style.setProperty('--action-btn-shadow', action.color.shadow())
                    ref.style.setProperty('--action-btn-color-text', action.color.text())
                }}
            >
                <div className={$prompt_modal.action_btn_icon.$}><UIcon name={action.icon}></UIcon></div>
                <div className={$prompt_modal.action_btn_text.$}><UText text={action.text}></UText></div>
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
        paddingBottom: '56px',
        transition: 'all 0.3s ease'
    })
    .load([$prompt_modal._.hidden.$], {
        opacity: '0',
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
        fontSize: '18px',
        margin: '12px 0'
    })
    .load([$prompt_modal.detail.$], {
        width: '60%',
        color: '#666',
    })
    .load([$prompt_modal.action_list.$], {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding:'0'
    })
    .load([$prompt_modal.action_btn.$], {
        height: '36px',
        lineHeight: '32px',
        border: '2px solid transparent',
        margin: '16px 4px',
        minWidth: '72px',
        textAlign: 'center',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'row',

        transition: 'all 0.2s ease',

        borderLeftWidth: '2px',
        paddingLeft: '32px',
        paddingRight: '24px',
    })
    .load([$prompt_modal.action_btn_icon.$], {
        transition: 'all 0.2s ease',
        color: 'var(--action-btn-color)',
        margin: '0 4px 0 -16px',
        width: '16px'
    })
    .load([$prompt_modal.action_btn_text.$], {
        transition: 'all 0.2s ease',
        color: '#333'
    })
    .load([$prompt_modal.action_btn.current.$], {
        boxShadow: 'var(--action-btn-shadow)',
        border: '2px solid var(--action-btn-color)',

        borderLeftWidth: '32px',
        paddingLeft: '2px',
        paddingRight: '16px',
    })
    .loads([
        [$prompt_modal.action_btn.current.$],
        [$prompt_modal.action_btn_icon.$]
    ], {
        margin: '0 22px 0 -26px',
        color: 'var(--action-btn-color-text)'
    })
    .loads([
        [$prompt_modal.action_btn.current.$],
        [$prompt_modal.action_btn_text.$]
    ], {
    })
    .inject()

const $prompt_wait_icon = block('prompt_wait_icon')
    // .load(element('icon'))
    // .load(element('number'))
    .build()
export const PromptWaitIcon = ({ sec, onFinish }: { sec: number, onFinish: () => void }) => {

    const [now, setNow] = useState(sec)
    const nowRef = useRef(sec)
    const timeRef = useRef<any>()

    useEffect(() => {

        const loop = () => {
            console.log(now)
            if (nowRef.current <= 0) {
                onFinish()
                return
            }
            timeRef.current = setTimeout(() => {
                nowRef.current = nowRef.current - 1
                setNow(nowRef.current)
                loop()
            }, 1000)
        }

        loop()

        return () => {
            clearTimeout(timeRef.current)
        }
    })

    return <div className={$prompt_wait_icon.$} >
        {/* <div className="prompt_wait_icon"></div> */}
        {now}
    </div>
}

style()
    .load([$prompt_wait_icon.$], {
        height: '60px',
        lineHeight: '60px',
        textAlign: 'center',
        fontSize: '48px',
        fontWeight: '600'
    })
    .load([$prompt_wait_icon.$, '::after'], {
        content: 'var(--prompt-wait-sec)',
    } as any)

    .inject()