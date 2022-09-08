
export const VERTEX_SHADER_SOURCE = `
    attribute vec4 a_Position; 
    attribute vec4 u_color;
    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 u_matrix;

    void main() { 
        gl_Position = a_Position * u_matrix;
        vColor = u_color;
    }
`;

export const FRAGMENT_SHADER_SOURCE =  `
    precision mediump float;
    varying lowp vec4 vColor;

    void main() {
            gl_FragColor = vColor;
    }  
`;