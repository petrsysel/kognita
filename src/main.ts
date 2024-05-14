import { Board } from "./core/Board"
import { Game } from "./core/Game"
import { Inventory } from "./core/Inventory"
import { Menu } from "./core/Menu"
import { SolutionPicker } from "./core/SolutionPicker"

function main(){
    const menu = new Menu()
    const inventory = new Inventory()
    const board = new Board(inventory)
    const solutionPicker = new SolutionPicker()
    const game = new Game(board, solutionPicker)
}

window.addEventListener('load', () => {
    main()
})