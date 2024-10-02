import { degToRad, m3 } from "./Math/math";

export class Camera{

    private _cameraMatrix: number[] = []
    
    //position 
    private  _cameraPosition: number[] = [];
    
    //vectors
    public _cameraDirection: number[] = [];
    private _cameraRight: number[] = [];
    private _cameraUp: number[] = [];

    constructor(cameraPosition   : any = [0, 0, 170],
                targetCoordinate : any = [0, 0, 0], 
                up               : any = [0, 1, 0])
    {
        if(cameraPosition == null)
            cameraPosition = [0, 0, -30]

        this.InitCameraVectors(cameraPosition,targetCoordinate,up)
        this.CalculateCameraMatrix()
    }

    public get matrix() : number []
    {
        return this._cameraMatrix;
    }

    private CalculateCameraMatrix()
    {
       this._cameraMatrix = [
            this._cameraRight[0],     this._cameraRight[1],     this._cameraRight[2],     -m3.scalarMultiply(this._cameraPosition, this._cameraRight),
            this._cameraUp[0],        this._cameraUp[1],        this._cameraUp[2],        -m3.scalarMultiply(this._cameraPosition, this._cameraUp),
            this._cameraDirection[0], this._cameraDirection[1], this._cameraDirection[2], -m3.scalarMultiply(this._cameraPosition, this._cameraDirection),
            0,                                               0,                        0,                                   1                               
        ];

        console.log('Test right of CameraMatrix', m3.MultiplyMatrixAndVectors( this._cameraMatrix, [...this._cameraRight, 0]))
    }

    private InitCameraVectors(cameraPosition   : any = [0, 0, 170],
                              targetCoordinate : any = [0, 0, 0], 
                              up               : any = [0, 1, 0])
    {
        this._cameraPosition = cameraPosition  

        this._cameraDirection = m3.normalize(m3.subtractVectors(cameraPosition, targetCoordinate))
        this._cameraRight= m3.normalize(m3.cross(up, this._cameraDirection))
        this._cameraUp = m3.normalize(m3.cross(this._cameraDirection, this._cameraRight))
    }


    public MoveForward(delta: number) : void
    {
        this.Slide(0, 0, -delta)
    }

    public MoveBack(delta: number) : void
    {
        this.Slide(0, 0, delta)
    }

    public MoveRight(delta: number) : void
    {
        this.Slide(delta)
    }

    public MoveLeft(delta: number) : void
    {
        this.Slide(-delta) 
    }

    private Slide( deltaRight: number = 0, deltaUp: number = 0, deltaDirection: number = 0 ) : void
    {
        
        for(let i = 0; i < 3; i++)
        {
            this._cameraPosition[i] += deltaRight * this._cameraRight[i] + 
                                            deltaUp * this._cameraUp[i] +
                                    deltaDirection * this._cameraDirection[i]
        } 
        this.CalculateCameraMatrix()        
    }

    public Roll( angle : number) : void
    {
        const angleInRadians = degToRad(angle)
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

        this.CalculateCameraMatrix()        

    }

    public Pitch( angle : number) : void
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

        this.CalculateCameraMatrix()        
    }

    public Yaw( angle : number) : void
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

        this.CalculateCameraMatrix()        
    }

    public yRotate(angle : number) : void
    {
        const angleInRadians = degToRad(angle)
        
        const cos = Math.cos(angleInRadians);
        const sin = Math.sin(angleInRadians);

        let vectors =  [this._cameraRight , this._cameraUp, this._cameraDirection]
        
        for(let vector of vectors)
        {
            let xComponent = vector[0]
            let zComponent = vector[2]

            vector[0] = xComponent * cos - zComponent * sin
            vector[2] = xComponent * sin + zComponent * cos
        }

        this.CalculateCameraMatrix()        
    }

    public set position(thePosition : number[])
    {
        this._cameraPosition = thePosition
        this.InitCameraVectors(thePosition)
        this.CalculateCameraMatrix()
    }

    public get position() : number[]
    {
      return this._cameraPosition 
    }
}