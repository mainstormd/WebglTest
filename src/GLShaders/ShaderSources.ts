
export const VERTEX_SHADER_SOURCE_COMMON = `
    attribute vec4 a_Position; 
    attribute vec4 u_color;
    
    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;

    void main() { 
        gl_Position = a_Position * ModelViewProjection;
        vColor = u_color;
    }
`;

export const VERTEX_SHADER_SOURCE_SPHERE = `
    attribute vec4 a_Position; 
    attribute vec4 u_color;
   
    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform float time;
    uniform int radius;

    void main() { 
        vec4 spherePosition = vec4(normalize(a_Position.xyz) * 3.0, a_Position.w);
        vec4 position = mix(a_Position, spherePosition, (sin(time)+(sin(3.0*time) / 3.0)  + 1.0)/2.0);  
        gl_Position = position * ModelViewProjection;
        
        vColor = u_color;
    }
`;

export const VERTEX_SHADER_SOURCE_CYLINDER = `
    attribute vec4 a_Position; 
    attribute vec4 u_color;   
    //attribute float weight;

    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform float time;

    void main() { 
        gl_Position = a_Position * ModelViewProjection;
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