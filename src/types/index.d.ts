import { Scene } from "../Scene";

export {};

declare global {
    interface Window{
        render:any
        cameraController:any
        scene:Scene
    }
}