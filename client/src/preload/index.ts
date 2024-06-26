import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {
      exit: () => ipcRenderer.send('exit'),
      requestServerLocation: () => ipcRenderer.send('request_server_location')
    })
    contextBridge.exposeInMainWorld('on', {
      serverLocation: (fn: (loc: string) => void) => {
        ipcRenderer.on('server_location', (_, loc: string) => {
          console.log(_, loc)
          fn(loc)
        })
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.on = {
    serverLocation: () => { }
  }
}


// const { contextBridge, ipcRenderer } = require('electron/renderer')

// contextBridge.exposeInMainWorld('electronAPI', {
//   setTitle: (title) => ipcRenderer.send('set-title', title)
// })
