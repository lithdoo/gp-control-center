import { block, element, style } from "@renderer/tools/style"
import { mainScreen } from "./state"
import { useWatch } from "@renderer/tools/state"

const $main_app = block('main_app')
  .load(element('client_id'))
  .load(element('header'))
  .load(element('header_avator')
    .modifier('active'))
  .load(element('body'))
  .load(element('body_app_list'))
  .load(element('body_app_item')
    .modifier('active')
  )
  .load(element('body_setting_list'))
  .load(element('body_setting_item')
    .modifier('active')
  )
  .load(element('footer'))
  .build()

export const Launcher = ({ clientId }: { clientId: string }) => {
  return <div className={$main_app.$}>
    <div className={$main_app.client_id.$}>{clientId}</div>
    <div className={$main_app.header.$}>
      <Message></Message>
    </div>
    <div className={$main_app.body.$}>
      <AppList></AppList>
      <SettingList></SettingList>
    </div>
    <div className={$main_app.footer.$}></div>
  </div>
}

const Message = () => {
  const focusId = useWatch(mainScreen, screen => screen.getCurrent()?.$key)
  const msg = useWatch(mainScreen, screen => screen.message())
  return <div className={[
    $main_app.header_avator.$,
    focusId === msg.$key ? $main_app.header_avator.active.$ : ''
  ].join(' ')}></div>
}


const AppList = () => {
  const focusId = useWatch(mainScreen, screen => screen.getCurrent()?.$key)
  const list = useWatch(mainScreen, screen => screen.applications())

  return <ul className={$main_app.body_app_list.$}>{
    list.map((app) =>
      <li
        key={app.$key}
        className={[
          $main_app.body_app_item.$,
          focusId === app.$key ? $main_app.body_app_item.active.$ : ''
        ].join(' ')}
        ref={node => app.bind(node)}>
          <div style={{height:'100%',width:'100%',backgroundImage:`url(${app.app.icon})`}}></div>
      </li>
    )
  }</ul>
}

const SettingList = () => {
  
  const focusId = useWatch(mainScreen, screen => screen.getCurrent()?.$key)
  const settingList = useWatch(mainScreen, screen => screen.settings())

  return <ul className={$main_app.body_setting_list.$}>{
    settingList.map((setting) =>
      <li
        key={setting.$key}
        className={[
          $main_app.body_setting_item.$,
          focusId === setting.$key?$main_app.body_setting_item.active.$:''
        ].join(' ')}>
      </li>
    )
  }</ul>
}



style()
  .load(['', 'body'], {
    height: '100vh',
    overflow: 'hidden',
    background: '#f1f3f4'
  })
  .load([$main_app.$], {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  })
  .load([$main_app.client_id.$], {
    position: "absolute",
    right: '12px',
    top: '12px',
    zIndex: '999',
    color: '#ccc'
  })
  .load([$main_app.header.$], {
    height: '84px',
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    margin: '0 36px'

  })
  .load([$main_app.header_avator.$], {
    background: "#ccc",
    height: '48px', width: '48px',
    borderRadius: '50%'
  })
  .load([$main_app.header_avator.active.$], {
    background: "#66ccff",
  })
  .load([$main_app.body.$], {
    height: '0',
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '3%',
  })
  .load([$main_app.body_app_list.$], {
    display: 'flex',
    padding: '0',
    overflow: 'auto',
    flex: '0 0 auto',
    width: "fit-content",
    margin: "0 auto",
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    position: 'relative',
    marginBottom: '-12px',
  })
  .load([$main_app.body_app_list.$, '::-webkit-scrollbar'], {
    display: 'none',
  })
  .load([$main_app.body_app_item.$], {
    width: '160px', height: '160px',
    background: "#ccc",
    flexShrink: '0',
    margin: "0 6px",
    marginBottom: '12px',
    padding:'24px',
    transition: 'all 0.3s ease-out'
  })
  .load([$main_app.body_app_item.active.$], {
    background: "#66ccff",
    boxShadow: '0 4px 8px 1px rgba(0,0,0,0.12)'
  })
  .load([$main_app.body_app_item.$, ":first-child"], {
    marginLeft: "72px"
  })
  .load([$main_app.body_app_item.$, ":last-child"], {
    marginRight: "72px"
  })
  .load([$main_app.body_setting_list.$], {
    display: 'flex',
    padding: '0',
    width: "fit-content",
    margin: "0 auto",
    flex: '1 1 0',
    alignItems: 'center'
  })
  .load([$main_app.body_setting_item.$], {
    width: '56px', height: '56px',
    background: "#ccc",
    margin: "0 6px",
    borderRadius: '50%'
  })
  .load([$main_app.body_setting_item.active.$], {
    background: "#66ccff",
  })
  .load([$main_app.footer.$], {
    height: '56px',
    flex: '0 0 auto',
    margin: '0 24px',
    borderTop: '2px solid #ccc'
  })
  .inject()