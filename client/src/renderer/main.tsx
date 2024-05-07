import './assets/base.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './tools/gamepad'


import { ws } from './ws'


ws.start().then((({clientId})=>{
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App clientId={clientId}/>
    </React.StrictMode>
  )
}))






window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});
