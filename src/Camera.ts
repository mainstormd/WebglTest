namespace MainProgram{

    export class Camera{
        private _resultMatrix: any;
        
        constructor(cameraPosition   : any = [0, 0, -30],
                    targetCoordinate : any = [0, 0, 0], 
                    up               : any = [0, 1, 0])
        {
            let cameraDirection = m3.subtractVectors(targetCoordinate, cameraPosition);
            let cameraRight = m3.normalize(m3.cross(cameraDirection, up));
            let cameraUp = m3.normalize(m3.cross(cameraDirection,cameraRight));

            this._resultMatrix = [
                cameraRight[0],     cameraRight[1],     cameraRight[2],     0,
                cameraUp[0],        cameraUp[1],        cameraUp[2],        0,
                cameraDirection[0], cameraDirection[1], cameraDirection[2], 0,
                cameraPosition[0],  cameraPosition[1],  cameraPosition[2],  1     
            ]
        }
    
        public get matrix()
        {
            return this._resultMatrix;
        }
    }

}