import { app } from "@renderer/mods/app"
import { TestApp } from "./Test"
import { WifiManageApp } from "./Wifi"
import { BluetoothApp } from './Bluetooth'
import { CameraApp } from "./Camera"
import { JoystickApp } from "./Joystick"

app.regist(TestApp)
app.regist(WifiManageApp)
app.regist(BluetoothApp)
app.regist(CameraApp)
app.regist(JoystickApp)