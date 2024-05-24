import { useWatch } from "@renderer/tools/state"
import { block, element, style } from "@renderer/tools/style"
import { app } from "."


const $app_view = block('app-view')
    .load(element('_').modifier('hidden'))
    .load(element('current'))
    .load(element('detail'))
    .build()


export const AppView = () => {
    const current = useWatch(app, (app) => app.current)

    const view = !current
        ? ''
        : <div className={$app_view.current.$}>
            {current.view}
        </div>

    return <div className={[
        $app_view.$,
        current ? '' : $app_view._.hidden.$
    ].join(' ')}>
        {view}
    </div>
}


style()
    .load([$app_view.$], {
        position: 'fixed',
        left: '0', right: '0', top: '0', bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.3)'
    })
    .load([$app_view._.hidden.$], {
        opacity: '0',
        userSelect: 'none'
    })
    .load([$app_view.current.$], {
        height: '100vh',
        width: '100vw'
    })
    .inject()