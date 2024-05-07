import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      exit: () => void
      requestServerLocation: () => void,
    },
    on: {
      serverLocation: (fn: (loc: string) => void) => void
    }
  }
}
