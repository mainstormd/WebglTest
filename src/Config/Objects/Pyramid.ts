import { glContext } from "../GLUtilities";

export class Pyramid{

    get RenderAssets() {  

         let positions = [
              //up
             -1.0,  0, -1.0,
                0,  4,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0,  4,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0,  4,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0,  4,    0,
             -1.0,  0, -1.0,
             
             // bot
             -1.0,  0, -1.0,   
                0, -4,    0,   
              1.0,  0, -1.0,
               
              1.0,  0, -1.0,
                0, -4,    0, 
              1.0,  0,  1.0,
              
              1.0,  0,  1.0,
                0, -4,    0,
             -1.0,  0,  1.0,
             
             -1.0,  0,  1.0,
                0, -4,    0,
             -1.0,  0, -1.0,
         ]

        let positionBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW)
  
        const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
        
        let colors : any = [];
        
        for (var j = 0; j < positions.length / 3; ++j ) {

          const c = faceColor
          
          colors = colors.concat(c)
        }
        
        const colorBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(colors), glContext.STATIC_DRAW);
  
        const indexBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = Array.from(Array(positions.length).keys())
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
        
        let count = indices.length
 
        return {
          modelMatrix: null,
          position: positionBuffer,
          countVertex: count,
          color: colorBuffer,
          indices: indexBuffer,
          renderMode: glContext.TRIANGLES
        };
    }
}