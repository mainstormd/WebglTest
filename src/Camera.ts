namespace MainProgram{

    export class Camera{
        private _resultMatrix: any;
        
        constructor(cameraPosition   : any = [0, 0, -30],
                    targetCoordinate : any = [0, 0, 0], 
                    up               : any = [0, 1, 0])
        {
            let cameraDirection = m3.subtractVectors(cameraPosition, targetCoordinate);
            let cameraRight = m3.normalize(m3.cross(cameraDirection, up));
            let cameraUp = m3.normalize(m3.cross(cameraDirection,cameraRight));
            
            let positionVector =[
                m3.scalarMultiply(cameraPosition,cameraRight),
                m3.scalarMultiply(cameraPosition,cameraUp),
                m3.scalarMultiply(cameraPosition,cameraDirection),
             ]
            
            this._resultMatrix = [
                cameraRight[0],     cameraRight[1],     cameraRight[2],     -positionVector[0],
                cameraUp[0],        cameraUp[1],        cameraUp[2],        -positionVector[1],
                cameraDirection[0], cameraDirection[1], cameraDirection[2], -positionVector[2],
                0,                  0,                  0,                  0     
            ]
            console.log('cameraMatrix',this._resultMatrix )
        }
    
        public get matrix()
        {
            return this._resultMatrix;
        }
    }

}