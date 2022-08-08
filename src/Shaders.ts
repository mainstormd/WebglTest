
namespace MainProgram{
    
    export const VERTEX_SHADER_SOURCE = `
        attribute vec4 a_Position; 
        // A matrix to transform the positions by
        uniform mat4 u_matrix;

        void main() { 
            gl_Position = a_Position * u_matrix;
        }
    `;

    export const FRAGMENT_SHADER_SOURCE =  `
        
        void main() {
          gl_FragColor = vec4(1, 0, 0.5, 1);
        }    
    `;
}    