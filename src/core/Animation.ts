import Konva from "konva"
import { Solution } from "./Solutions"

export type Scene = {
    background: string,
    width: number,
    objects: GameObject[],
    animations: Animation[],
    solutions: Solution[],
    transitions: Transition[]
}
export type Animation = {
    id: number,
    object: string,
    frames: Frame[],
    after?: AfterAction[]
}

export type Frame = {
    x?: number,
    y?: number,
    direction?: number,
    turn: number,
    visible?: boolean,
    duration: number
}

export type AfterAction = {
    sound?: string,
    animation?: number,
    additem?: string
}

export type GameObject = {
    name: string,
    direction: number,
    visible: boolean,
    x: number,
    y: number,
    skin: string,
    konvaObj?: Konva.Image
}

export type Transition = {
    x: number,
    y: number,
    target: string,
    tx: number,
    ty: number
}