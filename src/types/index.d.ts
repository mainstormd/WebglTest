import { Scene } from "../LightScene";

export {};

declare global {
    interface Window{
        render:any
        cameraController:any
        scene:Scene
    }
}