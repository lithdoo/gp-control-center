import { useWatch } from "@renderer/tools/state"
import { block, element, style } from "@renderer/tools/style"
import { app } from "."
import { UxBtnGroup } from "@renderer/components/base"
import { AppHoldingScreen } from "./state"


const $app_view = block('app-view')
    .load(element('_')
        .modifier('hidden')
        .modifier('holding')
    )
    .load(element('current'))
    .build()


export const AppView = () => {
    const current = useWatch(app, (app) => app.current)
    const holding = useWatch(app, (app) => !!app.holdScreen)
    const screen = useWatch(app, (app) => app.holdScreen)

    const view = !current
        ? ''
        : <div className={$app_view.current.$}>
            {current.view}
        </div>

    console.log('actions', holding)


    return <div className={[
        $app_view.$,
        current ? '' : $app_view._.hidden.$,
        holding ? $app_view._.holding.$ : ''
    ].join(' ')}>
        {view}
        {screen ? <AppHoldBtnGroup screen={screen}></AppHoldBtnGroup> : ''}
    </div>
}

export const AppHoldBtnGroup = ({ screen }: { screen: AppHoldingScreen }) => {
    const actions = useWatch(screen, (screen) => [...(screen?.actions ?? [])])
    const activeKey = useWatch(screen,(screen) => screen.getCurrent()?.$key || '')
    return <UxBtnGroup list={actions} activeKey={activeKey}></UxBtnGroup>
}


style()
    .load([$app_view.$], {
        position: 'fixed',
        left: '0', right: '0', top: '0', bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: '60vh',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.9)'
    })
    .load([$app_view._.hidden.$], {
        opacity: '0',
        userSelect: 'none'
    })
    .load([$app_view.current.$], {
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        left: '0', top: '0',
        background: '#fff',
    })
    .loads([
        [$app_view._.holding.$],
        [$app_view.current.$]], {
        transform: 'scale(0.5,0.5) translate(0,-20%)',
        borderRadius: '6px',
        boxShadow: '0 18px 48px 4px rgba(0,0,0,0.1)'
    })
    .inject()