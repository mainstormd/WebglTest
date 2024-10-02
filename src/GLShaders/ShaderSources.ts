
export const VERTEX_SHADER_SOURCE_COMMON = `
    attribute vec4 position; 
    attribute vec4 color;
    attribute vec3 normal;

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;
    varying lowp vec3 lightPosition;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
   

    void main() { 
        gl_Position = position * ModelViewProjection;

        objectColor = color;
        objectPosition = position;
        objectNormal = normal;
        lightPosition = vec3(0.0, 1.0, 10.0);
    }
`;

export const VERTEX_SHADER_SOURCE_SPHERE = `
    attribute vec4 position; 
    attribute vec4 color;

    varying lowp vec4 objectColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;

    uniform float interpolationCoeff;
    uniform float radius;

    void main() { 
        vec4 spherePosition = vec4(normalize(position.xyz) * radius, position.w);
        vec4 resultPosition = mix(position, spherePosition, interpolationCoeff);  
        gl_Position = resultPosition * ModelViewProjection;
        
        objectColor = color;
    }
`;

export const VERTEX_SHADER_SOURCE_CYLINDER = `
    attribute vec4 position; 
    attribute vec4 color;   
    attribute float weight;
  
    varying lowp vec4 objectColor;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    
    //bones
    uniform mat4 IdentityBone;
    uniform mat4 RotateBone;
    
    void main() { 
        vec4 totalPosition = position * ((1.0 - weight) * IdentityBone + weight * RotateBone);
        gl_Position = totalPosition * ModelViewProjection;
        objectColor = color;
    }
`;

export const FRAGMENT_SHADER_SOURCE =  `
    precision mediump float;

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;
    varying lowp vec3 lightPosition;
 
    void main() {
        float ambientStrength = 0.1;
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 ambient = ambientStrength * lightColor;
        
        vec3 normal = normalize(objectNormal);
        vec3 lightDirection = (lightPosition - objectPosition.xyz);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse = diff * lightColor;

        vec3 result = (ambient + diffuse) * vec3(objectColor.xyz);
        gl_FragColor = vec4(result, objectColor.w);

        //gl_FragColor = objectColor;
    }  
`;