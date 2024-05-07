import fs from 'fs';
import assetServerPath from '../../resources/server?asset'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { platform } from 'process'

if (platform === 'darwin') {
    console.log('运行在 macOS 上');
} else if (platform === 'linux') {
    console.log('运行在 Linux 上');
} else if (platform === 'win32') {
    console.log('运行在 Windows 上');
} else {
    console.log(`未知的操作系统: ${platform}`);
}



const getServerFilePath = () => {
    if (platform === 'linux') return assetServerPath
    const newServerPath = `${assetServerPath}.exe`


    if (!fs.existsSync(newServerPath)) {
        if (fs.existsSync(assetServerPath)) {
            fs.copyFileSync(assetServerPath, newServerPath)
        } else {
            throw new Error('server file not found!')
        }
    }

    return newServerPath
}




export const start = () => new Promise<string>((res, rej) => {
    const server = getServerFilePath()
    const bat = spawn(server);

    bat.stdout.on('data', (data) => {
        const str: string = data.toString().trim()
        if (str.indexOf('127.0.0.1') === 0) {
            res(str)
        }
    });

    bat.stderr.on('data', (data) => {
        rej(data.toString())
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        rej()
    });

})


export const server = new class {

    current: {
        loc: string,
        process: ChildProcessWithoutNullStreams
    } | null = null

    creating: Promise<string> | null = null

    async start() {
        if (this.current) return this.current.loc
        if (this.creating) return this.creating

        const creating = new Promise<string>((res, rej) => {
            const serverFile = getServerFilePath()

            const process = spawn(serverFile);

            process.stdout.on('data', (data) => {
                const loc: string = data.toString().trim()
                if (loc.indexOf('127.0.0.1') === 0) {
                    if (this.creating === creating) {
                        this.current = { process, loc }
                        res(loc)
                    } else {
                        process.kill()
                    }
                }
            });

            process.stderr.on('data', (data) => {
                rej(data.toString())
            });

            process.on('exit', (code) => {
                console.log(`Child exited with code ${code}`);
                rej()
            });
        })
        this.creating = creating

        return creating
    }

    async stop() {
        if(this.current){
            this.current.process.kill()
            this.current = null
        }

        if(this.creating){
            this.creating = null
        }
    }
}