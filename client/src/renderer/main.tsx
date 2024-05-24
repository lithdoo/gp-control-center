import './assets/base.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import './tools/gamepad'
import {Launcher} from './mods/launcher/render'


import { ws } from './ws'
import { PromptView } from './mods/prompt/render'
import { AppView } from './mods/app/render'


ws.start().then((({clientId})=>{
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Launcher clientId={clientId}></Launcher>
      <PromptView></PromptView>
      <AppView></AppView>
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

