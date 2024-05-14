import { DomHelper } from "easybox";
import { Scene } from "./Animation";
import { Solution } from "./Solutions";

export class SolutionPicker{
    container: HTMLDivElement
    preview: HTMLImageElement
    constructor(){
        this.container = DomHelper.get('solution-select') as HTMLDivElement
        this.preview = DomHelper.get('code-preview') as HTMLImageElement
    }

    render(scene: Scene, position: {x: number, y: number}, onSelect: (solution: Solution) => void){
        this.container.innerHTML = ""
        const relevant = scene.solutions.filter(s => s.x === position.x && s.y === position.y)
        console.log(relevant)

        const sceneName = scene.background.split('.')[0]
        
        relevant.forEach(s => {
            const img = document.createElement('img')
            img.src = `./assets/code/${sceneName}/${s.image}`
            img.style.width = "100%"
            this.container.appendChild(img)
            img.addEventListener('click', () => {
                onSelect(s)
            })
            img.addEventListener('mouseover', () => {
                this.preview.src = `./assets/code/${sceneName}/${s.image}`
                this.preview.style.display = 'block'
            })

            img.addEventListener('mouseout', () => {
                this.preview.style.display = 'none'
            })
        })
    }
}