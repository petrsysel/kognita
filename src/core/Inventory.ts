import { DomHelper } from "easybox"

export class Inventory{
    element: HTMLDivElement
    items: Map<string, number>
    
    constructor(){
        this.element = DomHelper.get('inventory') as HTMLDivElement
        this.items = new Map()
    }

    add(item: string){
        const amount = this.items.get(item)
        if(amount !== undefined) this.items.set(item, amount + 1)
        else this.items.set(item, 1)

        this.element.innerHTML = ""

        this.items.forEach((amount, item) => {
            const img = document.createElement('img')
            img.src = `./assets/${item}.png`
            const amountLabel = amount > 1 ? `${amount}x `: ''
            img.title = `${amountLabel}${item}`
            this.element.appendChild(img)
        })
    }
}