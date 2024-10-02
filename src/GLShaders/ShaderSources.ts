
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
    uniform mat4 ModelMatrix;

    void main() { 
        gl_Position = position * ModelViewProjection;

        objectColor = color;
        objectPosition = vec4(position * ModelMatrix);
        objectNormal = vec3(normal * mat3(ModelMatrix));

        lightPosition = vec3(0.0, 1.0, 2.0);
    }
`;

export const VERTEX_SHADER_SOURCE_SPHERE = `
    attribute vec4 position; 
    attribute vec4 color;
    attribute vec3 normal;

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;
    varying lowp vec3 lightPosition;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform mat4 ModelMatrix;

    uniform float interpolationCoeff;
    uniform float radius;

    void main() { 
        vec4 spherePosition = vec4(normalize(position.xyz) * radius, position.w);
        //if animation enabled
        vec4 resultPosition = mix(position, spherePosition, 1.0);  
       
        gl_Position = resultPosition * ModelViewProjection;
        
        objectPosition = resultPosition * ModelMatrix;
        objectNormal = normal  * mat3(ModelMatrix);
        objectColor = color;

        lightPosition = vec3(0.0, 1.0, 2.0);
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
    
    uniform vec3 cameraPosition;

    void main() {
        float ambientStrength = 0.1;
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec3 ambient = ambientStrength * lightColor;
        
        vec3 normal = normalize(objectNormal);
        vec3 lightDirection = normalize(lightPosition - objectPosition.xyz);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse = diff * lightColor;

        float specularStrength = 0.5;
        vec3 viewDir = normalize(cameraPosition - objectPosition.xyz);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        vec3 specular = specularStrength * spec * lightColor; 

        vec3 result = (ambient + diffuse + specular ) * vec3(objectColor.xyz);
        gl_FragColor = vec4(result, objectColor.w);

        //gl_FragColor = objectColor;
    }  
`;

export const VERTEX_SHADER_SOURCE_LINE_NORMAL = `
    attribute vec4 position; 
    attribute vec4 color;

    uniform mat4 ModelViewProjection;
    
    varying lowp vec4 objectColor;

    void main() { 
        gl_Position = position * ModelViewProjection;

        objectColor = color;
    }
`;

export const FRAGMENT_SHADER_NOLIGHT_SOURCE =  `
    precision mediump float;

    varying lowp vec4 objectColor;

    void main() {
        gl_FragColor = objectColor;
    }  
`;