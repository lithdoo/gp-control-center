// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { block, element, style } from './tools/style'
import { message, apps, settings } from './screen'

// function App(): JSX.Element {
//   const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

//   return (
//     <>
//       <img alt="logo" className="logo" src={electronLogo} />
//       <div className="creator">Powered by electron-vite</div>
//       <div className="text">
//         Build an Electron app with <span className="react">React</span>
//         &nbsp;and <span className="ts">TypeScript</span>
//       </div>
//       <p className="tip">
//         Please try pressing <code>F12</code> to open the devTool
//       </p>
//       <div className="actions">
//         <div className="action">
//           <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
//             Documentation
//           </a>
//         </div>
//         <div className="action">
//           <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
//             Send IPC
//           </a>
//         </div>
//       </div>
//       <Versions></Versions>
//     </>
//   )
// }


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


const App = ({ clientId }: { clientId: string }) => {
  return <div className={$main_app.$}>
    <div className={$main_app.client_id.$}>{clientId}</div>
    <div className={$main_app.header.$}>
      <div className={$main_app.header_avator.$} ref={node => message.bind(node, $main_app.header_avator.active.$)}></div>
    </div>
    <div className={$main_app.body.$}>
      <ul className={$main_app.body_app_list.$}>
        {
          apps.map((app) =>
            <li className={$main_app.body_app_item.$} ref={node => app.bind(node, $main_app.body_app_item.active.$)}></li>
          )
        }
      </ul>
      <ul className={$main_app.body_setting_list.$}>
        {
          settings.map((setting) =>
            <li className={$main_app.body_setting_item.$} ref={node => setting.bind(node, $main_app.body_setting_item.active.$)}></li>
          )
        }
      </ul>
    </div>
    <div className={$main_app.footer.$}></div>
  </div>
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
    zIndex:'999',
    color:'#ccc'
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
export default App
