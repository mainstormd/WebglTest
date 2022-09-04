namespace MainProgram{

    export class Camera{
        private _cameraDirection: any;
        public _cameraPosition: any;
        private _cameraRight: any;
        private _cameraUp: any;
        private _targetCoordinate: any;

        constructor(cameraPosition   : any = [0, 0, 170],
                    targetCoordinate : any = [0, 0, 0], 
                    up               : any = [0, 1, 0])
        {
            if(cameraPosition == null)
                cameraPosition = [0, 0, -30]

            this._targetCoordinate = targetCoordinate
            this._cameraDirection = m3.normalize(m3.subtractVectors(cameraPosition, targetCoordinate))
            this._cameraRight= m3.normalize(m3.cross(up, this._cameraDirection))
            this._cameraUp = m3.normalize(m3.cross(this._cameraDirection, this._cameraRight))
            this._cameraPosition = cameraPosition
            console.log('CameraPosition', cameraPosition)
            console.log('cameraDirection',this._cameraDirection)
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

        public roll( angle : any)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            let cameraRightOld = this._cameraRight; 
            
            this._cameraRight = [
                cos * cameraRightOld[0] + sin * this._cameraUp[0],
                cos * cameraRightOld[1] + sin * this._cameraUp[1],
                cos * cameraRightOld[2] + sin * this._cameraUp[2],
            ]

            this._cameraUp = [
                -sin * cameraRightOld[0] + cos * this._cameraUp[0],
                -sin * cameraRightOld[1] + cos * this._cameraUp[1],
                -sin * cameraRightOld[2] + cos * this._cameraUp[2],
            ] 
        }

        public pitch( angle : any)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            let cameraUpOld = this._cameraUp; 
            
            this._cameraUp = [
                cos * cameraUpOld[0] + sin * this._cameraDirection[0],
                cos * cameraUpOld[1] + sin * this._cameraDirection[1],
                cos * cameraUpOld[2] + sin * this._cameraDirection[2],
            ] 

            this._cameraDirection = [
                -sin * cameraUpOld[0] + cos * this._cameraDirection[0],
                -sin * cameraUpOld[1] + cos * this._cameraDirection[1],
                -sin * cameraUpOld[2] + cos * this._cameraDirection[2],
            ]
        }

        public yaw( angle : any)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            let cameraDirectionOld = this._cameraDirection; 
            
            this._cameraDirection = [
                cos * cameraDirectionOld[0] + sin * this._cameraRight[0],
                cos * cameraDirectionOld[1] + sin * this._cameraRight[1],
                cos * cameraDirectionOld[2] + sin * this._cameraRight[2],
            ]

            this._cameraRight = [
                -sin * cameraDirectionOld[0] + cos * this._cameraRight[0],
                -sin * cameraDirectionOld[1] + cos * this._cameraRight[1],
                -sin * cameraDirectionOld[2] + cos * this._cameraRight[2],
            ] 
        }

    }
}