import { NxBtn, NxBtnGroup, NxColor, NxText } from "@renderer/tools/base"
import { block, element, style } from "@renderer/tools/style"




export const UxText = ({ text }: { text: NxText }) => {
    return (typeof text === 'string'
        ? <p>{text}</p>
        : <p ref={ref => { if (ref) ref.innerHTML = text.html }}></p>
    )
}

export const UxIcon = ({ name }: { name: string }) => {
    return <svg className="icon" aria-hidden="true">
        <use xlinkHref={'#gp-' + name}></use>
    </svg>
}



const $ux_btn = block('ux-btn')
    .load(element('_')
        .modifier('acitve')
        .modifier('disabled')
    )
    .load(element('icon'))
    .load(element('text'))
    .build()

export const UxBtn = ({
    text, icon, color = NxColor.gray, active = false,
}: NxBtn) => {

    return <div
        className={[
            $ux_btn.$,
            active ? $ux_btn._.acitve.$ : ''
        ].join(' ')}
        ref={ref => {
            if (!ref) return
            ref.style.setProperty('--action-btn-color', color.current())
            ref.style.setProperty('--action-btn-shadow', color.shadow())
            ref.style.setProperty('--action-btn-color-text', color.text())
        }}>
        <div className={$ux_btn.icon.$}><UxIcon name={icon}></UxIcon></div>
        <div className={$ux_btn.text.$}><UxText text={text}></UxText></div>
    </div>
}

const $ux_btn_group = block('ux-btn').build()

export const UxBtnGroup = ({ list = [], activeKey }: NxBtnGroup) => {
    return <div className={$ux_btn_group.$}>{
        list.map(nx => <UxBtn {...nx} active={activeKey === nx.key}></UxBtn>)
    }</div>
}

style()
    .load([$ux_btn_group.$], {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        color: '#ccc'
    })
    .load([$ux_btn.$], {
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

    .load([$ux_btn.icon.$], {
        transition: 'all 0.2s ease',
        color: 'var(--action-btn-color)',
        margin: '0 4px 0 -16px',
        width: '16px'
    })
    .load([$ux_btn.text.$], {
        transition: 'all 0.2s ease',
        color: '#333'
    })
    .load([$ux_btn._.acitve.$], {
        boxShadow: 'var(--action-btn-shadow)',
        border: '2px solid var(--action-btn-color)',

        borderLeftWidth: '32px',
        paddingLeft: '2px',
        paddingRight: '16px',
    })
    .loads([
        [$ux_btn._.acitve.$],
        [$ux_btn.icon.$]
    ], {
        margin: '0 22px 0 -26px',
        color: 'var(--action-btn-color-text)'
    })
    .loads([
        [$ux_btn._.acitve.$],
        [$ux_btn.text.$]
    ], {
    })
    .inject()