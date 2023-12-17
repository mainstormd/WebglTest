import { glContext } from "../GLUtilities";
import { m3 } from "../Math/math"; 

export class Sphere{
    private _radius : number    
    private _degreeOfTessellation : number    

    constructor( radius : number = 3 , degreeOfTessellation : number = 3)
    { 
        this._radius = radius
        this._degreeOfTessellation = degreeOfTessellation
    }

    get RenderAssets() {       

         let positionsOfPyramid = [
              //up
             -1.0,  0, -1.0,
                0,  2,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0,  2,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0,  2,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0,  2,    0,
             -1.0,  0, -1.0,
             
             // bot
             -1.0,  0, -1.0,   
                0, -2,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0, -2,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0, -2,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0, -2,    0,
             -1.0,  0, -1.0,
         ]

        let positionsAfterTesselation : any = []
        let pyramidSidesCount = 8 

        for(let i = 0; i < pyramidSidesCount; i++)
        {
          let leftVertex = [ positionsOfPyramid[i * 9 + 0], positionsOfPyramid[i * 9 + 1], positionsOfPyramid[i * 9 + 2] ]
          let rightVertex = [ positionsOfPyramid[i * 9 + 0 + 3], positionsOfPyramid[i * 9 + 1 + 3], positionsOfPyramid[i * 9 + 2 + 3] ]
          let centerVertex = [ positionsOfPyramid[i * 9 + 0 + 6], positionsOfPyramid[i * 9 + 1 + 6], positionsOfPyramid[i * 9 + 2 + 6] ]

          positionsAfterTesselation = positionsAfterTesselation.concat(this.TesselationTriangle(leftVertex, rightVertex, centerVertex, this._degreeOfTessellation))
        } 

        let positions : number[] = positionsAfterTesselation

        // for(let i = 0; i < positionsAfterTesselation.length / 3; i++)
        // {
        //   let vector = [positionsAfterTesselation[ i * 3 ], positionsAfterTesselation[ i * 3 + 1], positionsAfterTesselation[ i * 3 + 2]]
        //   positions = positions.concat(m3.multiplyScalarOnVector(this._radius, m3.normalize(vector)))        
        // }
        
        let positionBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW)
  
        // const faceColors = [
        //   [1.0,  1.0,  0.0,  1.0], //yellow
        //   [0.0,  1.0,  0.0,  1.0] //green
        // ]
        
        // let colors : any = [];
        
        // for (var j = 0; j < positions.length / 3; ++j ) {

        //   const c = /*countColor / 3 <= 1 */ (j >= 9  && j < 12) ||
        //                                      (j >= 21 && j < 24) ||
        //                                      (j >= 33 && j < 36) ||
        //                                      (j >= 45 && j < 48) ||
        //                                      (j >= 57 && j < 60) ||
        //                                      (j >= 69 && j < 72) ||
        //                                      (j >= 81 && j < 84) ||
        //                                      (j >= 93 && j < 96) 
        //    ? faceColors[0] : faceColors[1] ;
          
        //   colors = colors.concat(c)
        // }
        
        const faceColors = [
            [1.0,  0.0,  0.0,  1.0],    // Back face: red /
            [0.0,  1.0,  0.0,  1.0],    // Top face: green /
            [1.0,  1.0,  0.0,  1.0]    // Bottom face: blue
          ]
          
          let colors : any = [];
          
          let value = 0
          for (var j = 0; j < positions.length / 3; ++j, value++ ) {
            
            if(value > 2)
               value = 0

            const c = faceColors[value]
            
            colors = colors.concat(c)
          }



        const colorBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(colors), glContext.STATIC_DRAW);
  
        const indexBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        // const indices = [
        //      1, 0, 0, 2, 2, 1,
        //      2, 0, 0, 3, 3, 2,
        //      3, 0, 0, 4, 4, 3,
        //      4, 0, 0, 1, 1, 4
        //     // 1, 4, 2,
        //     // 2, 4, 3
        // ]

        const indices = Array.from(Array(positions.length).keys())
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
        
        let count = indices.length
 
        return {
          modelMatrix: [1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1 ],
          position: positionBuffer,
          countVertex: count,
          color: colorBuffer,
          indices: indexBuffer,
          renderMode: glContext.TRIANGLES,
          isSphere:true
        };
    }
    
    private TesselationTriangle(leftVertex, centerVertex, rightVertex, degreeOfTessellation)  
    {          
      // линейная интерполяция
      // 3
      let leftMiddleSegment = [
        (leftVertex[0] + centerVertex[0]) / 2,
        (leftVertex[1] + centerVertex[1]) / 2,
        (leftVertex[2] + centerVertex[2]) / 2
      ]   

      // 4
      let rightMiddleSegment = [
        (centerVertex[0] + rightVertex[0]) / 2, 
        (centerVertex[1] + rightVertex[1]) / 2,
        (centerVertex[2] + rightVertex[2]) / 2
      ]

      // 5
      let centerMiddleSegment = [
        (rightVertex[0] + leftVertex[0]) / 2, 
        (rightVertex[1] + leftVertex[1]) / 2,
        (rightVertex[2] + leftVertex[2]) / 2
      ]
      
      let positions : number[] = [] 

      if(degreeOfTessellation === 1)
      {
        positions = positions.concat(leftVertex, leftMiddleSegment, centerMiddleSegment,
                                     leftMiddleSegment, centerVertex, rightMiddleSegment,
                                     centerMiddleSegment, rightMiddleSegment, rightVertex,
                                     leftMiddleSegment, rightMiddleSegment, centerMiddleSegment)
        return positions
      }

      positions = positions.concat(
                this.TesselationTriangle(leftVertex, leftMiddleSegment, centerMiddleSegment, degreeOfTessellation - 1),
                this.TesselationTriangle(leftMiddleSegment, centerVertex, rightMiddleSegment, degreeOfTessellation - 1),
                this.TesselationTriangle(centerMiddleSegment, rightMiddleSegment, rightVertex, degreeOfTessellation - 1),
                this.TesselationTriangle(leftMiddleSegment, rightMiddleSegment, centerMiddleSegment, degreeOfTessellation - 1))

      return positions
    }
}