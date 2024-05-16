
export enum FocusAction {
  UP, DOWN, LEFT, RIGHT, ENTER, BACK
}

export class FocusItem {
  back: () => FocusItem | null = () => null
  enter: () => FocusItem | null = () => null
  up: () => FocusItem | null = () => null
  down: () => FocusItem | null = () => null
  left: () => FocusItem | null = () => null
  right: () => FocusItem | null = () => null

  fid:string = Math.random().toString()
  target: HTMLElement | null = null

  private className: string = ''

  bind(target: HTMLElement | null, className: string) {
    this.target = target
    this.className = className
  }

  focus() {
    this.target?.classList.add(this.className)
  }
  blur() {
    this.target?.classList.remove(this.className)
  }
}

export abstract class AppScreen {
  // current: null | FocusItem = null

  abstract getCurrent(): null | FocusItem
  abstract setCurrent(item: null | FocusItem): void

  abstract has(item: FocusItem): boolean
  abstract default(): FocusItem | null

  focus(item: FocusItem | null) {
    if (!item) return
    if (this.has(item)) {
      item.focus()
      this.getCurrent()?.blur()
      this.setCurrent(item)
      this.getCurrent()?.focus()
      return true
    } else return false
  }



  [FocusAction.UP]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.UP]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
  [FocusAction.DOWN]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.DOWN]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
  [FocusAction.LEFT]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.LEFT]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
  [FocusAction.RIGHT]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.RIGHT]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
  [FocusAction.ENTER]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.ENTER]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
  [FocusAction.BACK]() {
    if (this.getCurrent()) {
      const current = this.getCurrent()?.[FocusAction.BACK]()
      if (current) this.focus(current)
    } else {
      this.focus(this.default())
    }
  }
}

export class AppGridLayout extends AppScreen {
  protected lines: {
    recent: null | FocusItem
    list: FocusItem[],
  }[] = []
  protected current: null | FocusItem = null

  getCurrent(): FocusItem | null {
    return this.current
  }

  setCurrent(item: FocusItem | null): void {
    if (item) {
      const line = this.lines.find(v => v.list.find(v => v === item))
      if (!line) {
        return
      } else {
        line.recent = item
      }
    }
    this.current = item
  }

  protected resetTarget(target: FocusItem) {
    const up = () => {
      const lineIdx = this.lines.findIndex((v) => v.list.find((v) => v === target))
      const line = this.lines
        .filter((_, idx) => idx < lineIdx)
        .reverse()
        .filter((v) => !!v.list.length)[0]

      return line?.recent || line?.list[0] || null
    }

    const down = () => {
      const lineIdx = this.lines.findIndex((v) => v.list.find((v) => v === target))
      const line = this.lines
        .filter((_, idx) => idx > lineIdx)
        .filter((v) => !!v.list.length)[0]

      return line?.recent || line?.list[0] || null
    }

    const left = () => {
      const line = this.lines.find((v) => v.list.find((v) => v === target))
      
      if (!line) return null
      const idx = line.list.findIndex((v) => v === target)
      if (idx < 0) return null
      return line.list[idx - 1] || null
    }

    const right = () => {
      const line = this.lines.find((v) => v.list.find((v) => v === target))
      if (!line) return null
      const idx = line.list.findIndex((v) => v === target)
      if (idx < 0) return null
      return line.list[idx + 1] || null
    }

    target[FocusAction.UP] = up

    target[FocusAction.DOWN] = down

    target[FocusAction.LEFT] = left

    target[FocusAction.RIGHT] = right
  }

  default(): FocusItem | null {
    return this.lines[0]?.list[0] ?? null
  }

  line(...list: FocusItem[]) {
    this.lines.push({ list, recent: null })
    list.forEach((target) => this.resetTarget(target))
  }

  setLine(idx: number, list: FocusItem[]) {
    this.lines[idx] = { list, recent: null }
    list.forEach((target) => this.resetTarget(target))
  }
  getLine(idx: number) {
    return this.lines[idx] ?? []
  }

  has(item) {
    return !!this.lines.find(line => !!line.list.find(v => v === item))
  }
}