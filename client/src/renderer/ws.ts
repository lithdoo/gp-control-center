

class WsClient {
    loc: {
        ws: string,
        server: string
    } | null = null

    clientId: string = ''


    connect: {
        websocket: WebSocket,
        clientId: string
    } | null = null

    private async initLoc() {
        if (this.loc) {
            return this.loc
        }
        const origin = await new Promise<string>(res => {
            window.on.serverLocation((str) => {
                console.log('str', str)
                res(str)
            })
            window.api.requestServerLocation()
        })

        const server = `http://${origin}`
        const ws = `ws://${origin}/ws`
        return this.loc = { ws, server }
    }

    private async initClient() {
        const { ws } = await this.initLoc()
        if(this.connect) return this.connect

        return new Promise<{
            websocket: WebSocket,
            clientId: string
        }>(res => {

            const websocket = new WebSocket(ws)

            websocket.onmessage = (e) => {
                const { data } = e

                if (typeof data === 'string') {
                    if (data == 'get daze※') {
                        return
                    }

                    if (data.indexOf('!Connect:') === 0) {
                        const connect = {
                            websocket,
                            clientId: data.replace('!Connect:', '')
                        }
                        this.connect = connect
                        res(connect)
                    }
                }
            }

            websocket.onopen = () => {
                websocket.send('!Connect')
            }
        })



    }

    async start() {
        return await this.initClient()
    }
}

export const ws = new WsClient()