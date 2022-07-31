namespace MainProgram{

    export class Camera{
        private _cameraDirection: any;
        private _cameraPosition: any;
        private _cameraRight: any;
        private _cameraUp: any;

        constructor(cameraPosition   : any = [0, 0, -30],
                    targetCoordinate : any = [0, 0, 0], 
                    up               : any = [0, 1, 0])
        {
            if(cameraPosition == null)
                cameraPosition = [0, 0, -30]

            this._cameraDirection = m3.subtractVectors(cameraPosition, targetCoordinate)
            this._cameraRight= m3.normalize(m3.cross(up, this._cameraDirection))
            this._cameraUp = m3.normalize(m3.cross(this._cameraDirection, this._cameraRight))
            this._cameraPosition = cameraPosition
            console.log('CameraPosition', cameraPosition)
            
        }
    
        public get matrix()
        {
           let resultMatrix =  [
                this._cameraRight[0],     this._cameraRight[1],     this._cameraRight[2],     -m3.scalarMultiply(this._cameraPosition, this._cameraRight),
                this._cameraUp[0],        this._cameraUp[1],        this._cameraUp[2],        -m3.scalarMultiply(this._cameraPosition, this._cameraUp),
                this._cameraDirection[0], this._cameraDirection[1], this._cameraDirection[2], -m3.scalarMultiply(this._cameraPosition, this._cameraDirection),
                0,                                               0,                        0,                                   1     
            ];

            console.log('CameraMatrix', resultMatrix)
            console.log('Test eye of CameraMatrix', m3.MultiplyMatrixAndVectors(resultMatrix, [...this._cameraPosition, 1]))
            console.log('Test right of CameraMatrix', m3.MultiplyMatrixAndVectors(resultMatrix, [...this._cameraRight, 0]))
           
            return resultMatrix;
        }

        public slide( deltaRight: any = 0, deltaUp: any = 0, deltaDirection: any = 0 )
        {
           
            for(let i = 0; i < 3; i++)
            {
                this._cameraPosition[i] += deltaRight * this._cameraRight[i] + 
                                              deltaUp * this._cameraUp[i] +
                                       deltaDirection * this._cameraDirection[i]
            } 
        }
    }
}