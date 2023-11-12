import { glContext } from "./GLUtilities";

export class Plane{

    get RenderAssets() {

        const positions = [
            70,  0, -50, 
           -70,  0, -50,
           -70,  0,  50, 
            70,  0,  50,
        ]
  
        let positionBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
            glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW)
  
        const faceColors = [ 
          //[1.0,  0.0,  0.0,  1.0],  
          [0.0,  0.0,  1.0,  0.5],
          [0.0,  0.0,  1.0,  0.5]   
        ]   
        
        let colors : any = [];
        
        for (var j = 0; j < faceColors.length; ++j) {
          const c = faceColors[j];
      
          // Repeat each color four times for the four vertices of the face
          colors = colors.concat(c, c, c);
        }
        
        const colorBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(colors), glContext.STATIC_DRAW);
  
        const indexBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        const indices = [0, 1, 2, 0, 2, 3]
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
        
        let count = indices.length
  
        return {
          modelMatrix: null,
          position: positionBuffer,
          countVertex: count,
          color: colorBuffer,
          indices: indexBuffer
        };
    }
    
}