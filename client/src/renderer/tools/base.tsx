export class NxColor {
    static gray = new NxColor(140, 140, 140)
    static blue = new NxColor(36, 110, 185)
    static green = new NxColor(76, 185, 68)
    static white = new NxColor(253, 255, 252)
    static yellow = new NxColor(245, 238, 158)
    static salmon = new NxColor(240, 101, 67)

    rgba: [number, number, number, number] = [0, 0, 0, 0]

    constructor(r: number, g: number = r, b: number = g, a: number = 1) {
        this.rgba = [r, g, b, a]
    }

    current() {
        return `rgb(${this.rgba.join(',')})`
    }

    text() {
        return "#fff"
    }

    shadow() {
        return `0 4px 8px 0 rgba(${this.rgba[0]},${this.rgba[1]},${this.rgba[2]},0.3)`
    }

}

export type NxText = string | { html: string }

export interface NxBtn {
    text: NxText, icon: string, color: NxColor, active: boolean,
    click: () => void
}

export interface NxBtnGroup {
    list: (NxBtn & { key: string })[],
    activeKey: string
}