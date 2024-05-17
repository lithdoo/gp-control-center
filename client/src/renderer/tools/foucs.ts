
export enum FocusAction {
  UP, DOWN, LEFT, RIGHT, ENTER, BACK
}

export interface WithRefKey {
  $key: string
}

export interface Focusable extends WithRefKey {
  target: HTMLElement | null 
  back: () => Focusable | null
  enter: () => Focusable | null
  up: () => Focusable | null
  down: () => Focusable | null
  left: () => Focusable | null
  right: () => Focusable | null

  onfocus?(): void
  onblur?(): void
}



export class FocusItem  implements Focusable{
  back: () => Focusable | null = () => null
  enter: () => Focusable | null = () => null
  up: () => Focusable | null = () => null
  down: () => Focusable | null = () => null
  left: () => Focusable | null = () => null
  right: () => Focusable | null = () => null

  $key: string = Math.random().toString()
  target: HTMLElement | null = null

  private className: string = ''

  bind(target: HTMLElement | null, className: string) {
    this.target = target
    this.className = className
  }

  onfocus() {
    if (!this.className) return
    this.target?.classList.add(this.className)
  }
  onblur() {
    if (!this.className) return
    this.target?.classList.remove(this.className)
  }
}

export abstract class AppScreen  implements WithRefKey{
  $key = Math.random().toString()

  abstract getCurrent(): null | Focusable
  abstract setCurrent(item: null | Focusable): void

  abstract has(item: Focusable): boolean
  abstract default(): Focusable | null

  focus(item: Focusable | null) {
    if (!item) return
    if (this.has(item)) {
      this.getCurrent()?.onblur?.()
      this.setCurrent(item)
      this.getCurrent()?.onfocus?.()
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
    recent: null | Focusable
    list: Focusable[],
  }[] = []
  protected current: null | Focusable = null

  getCurrent(): Focusable | null {
    return this.current
  }

  setCurrent(item: Focusable | null): void {
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

  protected resetTarget(target: Focusable) {
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

  default(): Focusable | null {
    return this.lines[0]?.list[0] ?? null
  }

  line(...list: Focusable[]) {
    this.lines.push({ list, recent: null })
    list.forEach((target) => this.resetTarget(target))
  }

  setLine(idx: number, list: Focusable[]) {
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