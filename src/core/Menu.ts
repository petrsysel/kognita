import { DomHelper } from "easybox"

export class Menu{
    element: HTMLDivElement
    newGame: HTMLDivElement

    constructor(){
        this.element = DomHelper.get('menu') as HTMLDivElement

        // Zakomentovat
        // this.element.style.display = "none"

        this.newGame = DomHelper.get('new-game') as HTMLDivElement
        this.newGame.addEventListener('click', () => {
            this.element.classList.add('fade-out')
            this.playSoundtrack()
        })
        this.element.addEventListener('transitionend', () => {
            this.element.style.display = "none"
        })
    }

    playSoundtrack(){
        const audio = new Audio("./assets/audio/worlds_sunrise.mp3")
        audio.loop = true
        audio.volume = 0.1
        audio.play()
    }
}