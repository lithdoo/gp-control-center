import { insertCss } from "insert-css"

type NoVar = null

type BlockClsNameGenerator<S extends { [key: string]: { [key: string]: NoVar } }> =
    { $: string }
    & {
        [Element in keyof S]: ({ $: string } & { [Modifier in keyof S[Element]]: { $: string } })
    }


class BlockBuilder<S extends { [key: string]: { [key: string]: NoVar } } = {}> {

    blockName: string = ''
    elements: { [P in keyof S]: string[] }

    constructor(name: string, elements: { [P in keyof S]: string[] }) {
        this.blockName = name
        this.elements = elements
    }

    load<SS extends string, TT extends { [key: string]: NoVar }>(element: ElementBuilder<SS, TT>) {
        const elements = {
            ...this.elements,
            [element.name]: [
                ...element.mods,
                ... (this.elements[element.name] ?? [])
            ]
        }
        return new BlockBuilder<S & { [key in SS]: TT }>(this.blockName, elements)
    }


    build() {
        const $ = {
            $: this.blockName,
            ...Object.entries(this.elements).reduce<any>((res, [elementName, mods]) => {
                return {
                    ...res,
                    [elementName]: {
                        $: `${this.blockName}--${elementName}`,
                        ...mods.reduce<any>((res, modifier) => {
                            return {
                                ...res,
                                [modifier]: {
                                    $: `${this.blockName}--${elementName}__${modifier}`,
                                }
                            }
                        }, {})
                    }
                }
            }, {})
        }


        return $ as BlockClsNameGenerator<S>
    }
}

class ElementBuilder<S extends string, T extends { [key: string]: NoVar } = {}> {
    name: S

    mods: string[]

    constructor(name: S, mods: string[] = []) {
        this.name = name
        this.mods = mods
    }

    modifier<TT extends string>(name: TT) {
        return new ElementBuilder<S, T & { [key in TT]: NoVar }>(this.name, [...this.mods, name])
    }
}


type ClsName = string
type Extra = string
class StyleLoader {
    table: Map<string, Partial<CSSStyleDeclaration>> = new Map

    propertyTable: Map<string, string> = new Map()
    keyframesTable: Map<string, string> = new Map()

    load(selector: [ClsName, Extra] | [ClsName] , rules: Partial<CSSStyleDeclaration>) {
        const cls = selector[0] ? `.${selector[0]}` : ''
        const extra = selector[1] || ''
        this.table.set(cls + extra, rules)
        return this
    }

    loads(selectors: ([ClsName, Extra] | [ClsName])[], rules: Partial<CSSStyleDeclaration>) {
        const text = selectors.map(selector => {
            const cls = selector[0] ? `.${selector[0]}` : ''
            const extra = selector[1] || ''
            return cls + extra
        }).join(' ')


        this.table.set(text, rules)
        return this
    }

    inject() {
        const rules = Array.from(this.table.entries())
            .map(([selector, ruls]) => {
                return `${selector}{ ${Object.entries(ruls).map(([str, val]) => `\r\n${str.replace(/([A-Z])/g, '-$1').toLocaleLowerCase()}:${val}`).join(';')}\r\n}`
            })
            .join('\r\n')
            + '\r\n'

        const keyframes = Array.from(this.keyframesTable.entries())
            .map(([name, val]) => {
                return `@keyframes ${name}{${val}}`
            })
            .join('\r\n')
            + '\r\n'

        const property = Array.from(this.propertyTable.entries())
            .map(([name, val]) => {
                return `@property ${name}{${val}}`
            })
            .join('\r\n')
            + '\r\n'

        insertCss(rules)
        insertCss(keyframes)
        insertCss(property)
    }

    property(name: string, val: string) {
        this.propertyTable.set(name, val)
        return this
    }

    keyframes(name: string, val: string) {
        this.keyframesTable.set(name, val)
        return this
    }
}

export const block = (name: string) => {
    return new BlockBuilder(name, {})
}

export const element = <T extends string>(name: T) => {
    return new ElementBuilder(name)
}


export const style = () => new StyleLoader()