import { Board } from "./Board";
import { SolutionPicker } from "./SolutionPicker";

export class Game{
    board: Board
    solutionPicker: SolutionPicker

    constructor(board: Board, solutionPicker: SolutionPicker){
        this.board = board
        this.solutionPicker = solutionPicker

        this.loadScene('nadvori', 2, 5)
    }

    loadScene(sceneName: string, x: number, y: number){
        console.log("loading scene " + sceneName)
        this.board.loadScene(sceneName).then(async () => {
            await this.board.draw()
            const scene = this.board.getScene()!
            const animId = scene.animations.find(a => a.frames[0].x === x && a.frames[0].y === y)?.id!
            await this.board.prepare(animId)
            const prepare = async (nx:number, ny:number) => {
                
                this.solutionPicker.render(scene, {x:nx, y:ny}, async (solution) => {
                    const coords = await this.board.play(solution.animation)
                    console.log("Finished on coords")
                    console.log(coords)
                    prepare(coords.x, coords.y)
                    
                    const transition = scene.transitions.find(t => t.x === coords.x && t.y === coords.y)
                    console.log(`Founded transitions`)
                    console.log(transition)
                    if(transition) this.loadScene(transition.target, transition.tx,transition.ty)
                })
            }
            prepare(x,y)
            

        })
    }
}