export class NColor {
    static gray = new NColor(140,140,140)
    static blue = new NColor(36, 110, 185)
    static green = new NColor(76, 185, 68)
    static white = new NColor(253, 255, 252)
    static yellow = new NColor(245, 238, 158)
    static salmon = new NColor(240, 101, 67)
    
    rgba: [number, number, number, number] = [0, 0, 0, 0]

    constructor(r: number, g: number = r, b: number = g, a: number = 1) {
        this.rgba = [r, g, b, a]
    }

    current(){
        return `rgb(${this.rgba.join(',')})` 
    }
    
    text(){
        return "#fff"
    }
    
    shadow(){
        return  `0 4px 8px 0 rgba(${this.rgba[0]},${this.rgba[1]},${this.rgba[2]},0.3)`
    }

}

export type NText = string | { html: string }
