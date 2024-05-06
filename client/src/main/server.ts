import fs from 'fs';
import server from '../../resources/server?asset'
import { exec, spawn } from 'child_process'

export const start = () => new Promise<string>((res, rej) => {

    const serverPath = `${server}.exe`
    console.log({
        server,
        serverPath
    })

    if(!fs.existsSync(serverPath)){
        if(fs.existsSync(server)){
            fs.copyFileSync(server,serverPath)
        }else{
            return rej('server file not found!')
        }
    }



    const bat = spawn(serverPath);

    bat.stdout.on('data', (data) => {
        const str:string = data.toString().trim()
        if(str.indexOf('127.0.0.1') === 0){
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