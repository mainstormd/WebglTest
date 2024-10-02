
export const VERTEX_SHADER_SOURCE_COMMON = `
    attribute vec4 position; 
    attribute vec4 color;

    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;

    void main() { 
        gl_Position = position * ModelViewProjection;
        vColor = color;
    }
`;

export const VERTEX_SHADER_SOURCE_SPHERE = `
    attribute vec4 position; 
    attribute vec4 color;

    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform float time;
    uniform int radius;

    void main() { 
        vec4 spherePosition = vec4(normalize(position.xyz) * 3.0, position.w);
        vec4 resultPosition = mix(position, spherePosition, (sin(time)+(sin(3.0*time) / 3.0)  + 1.0)/2.0);  
        gl_Position = resultPosition * ModelViewProjection;
        
        vColor = color;
    }
`;

export const VERTEX_SHADER_SOURCE_CYLINDER = `
    attribute vec4 position; 
    attribute vec4 color;   
    attribute float weight;
  
    varying lowp vec4 vColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    
    //bones
    uniform mat4 IdentityBone;
    uniform mat4 RotateBone;
    
    void main() { 
        vec4 totalPosition = position * ((1.0 - weight) * IdentityBone + weight * RotateBone);
        gl_Position = totalPosition * ModelViewProjection;
        vColor = color;
    }
`;

export const FRAGMENT_SHADER_SOURCE =  `
    precision mediump float;
    varying lowp vec4 vColor;

    void main() {
            gl_FragColor = vColor;
    }  
`;