import { block, element } from "@renderer/tools/style"


const $app_view = block('app-view')
    .load(element('current'))
    .load(element('detail'))
    .build()


export const AppView = () => {
    return <div className={$app_view.$}>
        <div className={$app_view.current.$}></div>
        <div className={$app_view.detail.$}></div>
    </div>
}