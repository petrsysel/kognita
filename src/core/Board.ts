import { DomHelper } from "easybox"
import Konva from "konva"
import { Scene } from "./Animation"
import { Inventory } from "./Inventory"

export class Board{
    container: HTMLDivElement
    stage: Konva.Stage
    bgLayer: Konva.Layer
    objLayer: Konva.Layer
    scene: Scene | undefined
    inventory: Inventory

    constructor(inventory: Inventory){
        this.inventory = inventory
        const minSize = innerWidth < innerHeight ? innerWidth : innerHeight
        this.container = DomHelper.get('konva-container') as HTMLDivElement
        this.stage = new Konva.Stage({
            container: this.container,
            width: minSize,
            height: minSize
        })
        this.bgLayer = new Konva.Layer()
        this.objLayer = new Konva.Layer()
        this.stage.add(this.bgLayer)
        this.stage.add(this.objLayer)


        this.init()
    }

    init(){
        
    }

    loadScene(sceneName: string): Promise<void>{
        return new Promise((resolve, reject) => {
            fetch(`./scenes/${sceneName}.json`).then(async response => {
                console.log(response)
                const scene: Scene = await response.json()
                this.scene = scene
                resolve()
            })
        })
    }
    tileSize(){
        return this.stage.width()/(this.scene!.width)
    }

    play(animId: number): Promise<{
        x: number,
        y: number
    }>{
        return new Promise(async (resolve, reject) => {
            const animation = this.scene?.animations.find(a => a.id === animId)
            if(!animation){
                reject()
                return
            }
            let px = 0
            let py = 0

            const obj = this.scene?.objects.find(o => o.name === animation.object)
            if(!obj) {
                reject()
                return
            }
            console.log(obj)
            console.log(obj.konvaObj)
            const konvaImg = obj.konvaObj!
            console.log(konvaImg)

            const tileSize = this.tileSize() 

            const init = () => {
                const first = animation.frames[0]
                if(first.x!== undefined) {
                    konvaImg.x(first.x * tileSize + tileSize/2)
                    px = first.x
                }
                if(first.y!== undefined){
                    konvaImg.y(first.y * tileSize + tileSize/2)
                    py = first.y
                }
                if(first.visible !== undefined) {
                    konvaImg.opacity(first.visible ? 1 : 0)
                }
                if(first.direction !== undefined) konvaImg.rotation(180 + (first.direction*90))
            }
            init()

            const playAudio = (file: string) => {
                return new Promise((resolve, reject) => {
                    const audio = new Audio(`./assets/audio/${file}`)
                    audio.play()
                    audio.onended = resolve
                })
            }

            const onEnd = async () => {
                if(animation.after)
                for(const action of animation.after){
                    if(action.animation != undefined) {
                        await this.play(action.animation)
                    }
                    if(action.sound != undefined){
                        await playAudio(action.sound)
                    }
                    if(action.additem != undefined){
                        console.log("adding item " + action.additem)
                        this.inventory.add(action.additem)
                    }
                }

                const player = this.scene?.objects.find(o => o.name === 'carodej')?.konvaObj
                console.log(px)
                const coords = player ? {
                    x: Math.ceil(konvaImg.x()/tileSize) - 1,
                    y: Math.ceil(konvaImg.y()/tileSize) - 1
                }: {x:1, y:1}
                
                resolve(coords)
                return
            }
            const next = async (frameIndex: number) => {
                if(frameIndex > animation.frames.length - 1){
                    await onEnd()
                    return
                }
                const frame = animation.frames[frameIndex]
                const opacity = frame.visible ? 1: 0

                console.log(frame.x)
                if(frame.x !== undefined) px = frame.x
                if(frame.y !== undefined) py = frame.y
                console.log(px)

                const anim = new Konva.Tween({
                    node: konvaImg,
                    duration: frame.duration ? frame.duration/1000 : 0,
                    x: frame.x !== undefined? frame.x * tileSize + tileSize/2 : konvaImg.x(),
                    y: frame.y !== undefined? frame.y * tileSize + tileSize/2 : konvaImg.y(),
                    opacity: frame.visible !== undefined ? opacity : konvaImg.opacity(),
                    rotation: frame.turn !== undefined? (konvaImg.rotation()+frame.turn*90) :(frame.direction !== undefined ? 180 + (frame.direction*90) : konvaImg.rotation()),
                    onFinish: async () => {
                        console.log("Animace dokončena")
                        await next(frameIndex + 1)
                    }
                })
                console.log("playing")
                anim.play()
            }
            await next(1)
        })
    }

    async draw(): Promise<void>{
        return new Promise(async (resolve, reject) => {
            this.bgLayer.clear()
            this.bgLayer.destroyChildren()
            this.objLayer.clear()
            this.objLayer.destroyChildren()
            const bg = await this.loadKonvaImage(this.scene!.background, this.stage.width())
            const ar = bg.height()/bg.width()
            this.stage.height(this.stage.width()*ar)
            this.bgLayer.add(bg)

            console.log(this.scene?.objects)
            for(const o of this.scene?.objects!){
                const tileSize = this.tileSize()

                const img = await this.loadKonvaImage(o.skin, tileSize)
                img.x(o.x * tileSize + tileSize/2)
                img.y(o.y * tileSize + tileSize/2)
                this.objLayer.add(img)
                img.offsetX(img.width()/2)
                img.offsetY(img.height()/2)
                img.rotation(180 + (o.direction*90))
                o.konvaObj = img
            }
            resolve()
        })
    }

    prepare(animId: number): Promise<void>{
        return new Promise((resolve, reject) => {
            const animation = this.scene?.animations.find(a => a.id === animId)
            if(!animation){
                reject()
                return
            }

            const obj = this.scene?.objects.find(o => o.name === animation.object)
            if(!obj) {
                reject()
                return
            }
            console.log(obj)
            console.log(obj.konvaObj)
            const konvaImg = obj.konvaObj!
            console.log(konvaImg)

            const tileSize = this.tileSize() 

            const init = () => {
                const first = animation.frames[0]
                if(first.x!== undefined) konvaImg.x(first.x * tileSize + tileSize/2)
                if(first.y!== undefined) konvaImg.y(first.y * tileSize + tileSize/2)
                if(first.visible !== undefined) {
                    konvaImg.opacity(first.visible ? 1 : 0)
                }
                if(first.direction !== undefined) konvaImg.rotation(180 + (first.direction*90))
            }
            init()
            resolve()
        })
    }

    loadKonvaImage(name: string, size: number): Promise<Konva.Image>{
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                const ar = img.height/img.width
                const kImg = new Konva.Image({
                    image: img,
                    width: size,
                    height: size*ar
                })
                resolve(kImg)
            }
            img.src = `./assets/${name}`
        })
    }

    getScene(){
        return this.scene
    }
}