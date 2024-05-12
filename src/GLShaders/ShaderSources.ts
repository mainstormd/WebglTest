
export const VERTEX_SHADER_SOURCE = `
    attribute vec4 a_Position; 
    attribute vec4 u_color;
    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 modelViewProjection_matrix;
   
    uniform float time;
    uniform int radius;

    uniform bool isSphere; // 1 sphere others

    void main() { 
        vec4 position;
        
        if(isSphere == true)
        {
            vec4 spherePosition = vec4(normalize(a_Position.xyz) * 3.0, a_Position.w);
            position = mix(a_Position, spherePosition, (sin(time)+(sin(3.0*time) / 3.0)  + 1.0)/2.0);  
        } else {
            position = a_Position;
        }

        gl_Position = position * modelViewProjection_matrix;
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