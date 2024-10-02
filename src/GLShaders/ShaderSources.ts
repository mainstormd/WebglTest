
export const VERTEX_SHADER_SOURCE_COMMON = `
    attribute vec4 position; 
    attribute vec4 color;
    attribute vec3 normal;

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform mat4 ModelMatrix;

    void main() { 
        gl_Position = position * ModelViewProjection;

        objectColor = color;
        objectPosition = vec4(position * ModelMatrix);
        objectNormal = vec3(normal * mat3(ModelMatrix));
    }
`;

export const VERTEX_SHADER_SOURCE_SPHERE = `
    attribute vec4 position; 
    attribute vec4 color;
    attribute vec3 normal;

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;

    // A matrix to transform the positions by
    uniform mat4 ModelViewProjection;
    uniform mat4 ModelMatrix;

    uniform float interpolationCoeff;
    uniform float radius;

    void main() { 
        vec4 spherePosition = vec4(normalize(position.xyz) * radius, position.w);
        //if animation enabled
        vec4 resultPosition = mix(position, spherePosition, 1.0); //1.0  is off animation  
       
        gl_Position = resultPosition * ModelViewProjection;
        
        objectPosition = resultPosition * ModelMatrix;
        objectNormal = normal  * mat3(ModelMatrix);
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

    /*
        if MAX_POINT_LIGHTS >= 128 we have error:
        FRAGMENT shader uniforms count exceeds MAX_FRAGMENT_UNIFORM_VECTORS(1024)
    */
    #define MAX_POINT_LIGHTS 10

    struct PointLight{
        vec3 position;
        vec3 color;

        float ambientStrength;
        float diffuseStrength;
        float specularStrength;

        float constant;
        float linear;
        float quadratic;
    };

    struct SpotLight{
        vec3 color;
        vec3 position;
        vec3 direction;

        float ambientStrength;
        float diffuseStrength;
        float specularStrength;

        float constant;
        float linear;
        float quadratic;

        float cosOfCutoff;
        float cosOfOuterCutoff;
    };

    varying lowp vec4 objectColor;
    varying lowp vec4 objectPosition;
    varying lowp vec3 objectNormal;
    
    uniform vec3 cameraPosition;
    uniform int countPointLights;
    
    uniform PointLight pointLights[MAX_POINT_LIGHTS];
    uniform SpotLight spotLight;

    vec3 CalcPointLight(PointLight light, vec3 objectNormal, vec4 objectPosition, vec3 cameraPosition)
    {
        vec3 normal = normalize(objectNormal);
        vec3 lightDirection = normalize(light.position - objectPosition.xyz);
        
        float diff = max(dot(normal, lightDirection), 0.0);
        
        vec3 viewDir = normalize(cameraPosition - objectPosition.xyz);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        
        float distance = length(light.position - objectPosition.xyz);
        float attenuation = 1.0 / (light.constant * distance + light.linear * distance + light.quadratic * (distance * distance) );

        vec3 ambient = light.ambientStrength * light.color;
        vec3 diffuse = light.diffuseStrength * diff * light.color;
        vec3 specular = light.specularStrength * spec * light.color; 

        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;
        
        return ambient + diffuse + specular;
    }

    vec3 CalcSpotLight(SpotLight light, vec3 objectNormal, vec4 objectPosition, vec3 cameraPosition)
    {   
        vec3 normal = normalize(objectNormal);
        vec3 lightDirection = normalize(light.position - objectPosition.xyz);
        float diff = max(dot(normal, lightDirection), 0.0);
        
        vec3 viewDir = normalize(cameraPosition - objectPosition.xyz);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        
        float distance = length(light.position - objectPosition.xyz);
        float attenuation = 1.0 / (light.constant * distance + light.linear * distance + light.quadratic * distance * distance);

        vec3 ambient = light.ambientStrength * light.color;
        vec3 diffuse = light.diffuseStrength * diff * light.color;
        vec3 specular = light.specularStrength * spec * light.color;
        
        float theta = dot(lightDirection, normalize(light.direction));
        float epsilon = light.cosOfCutoff - light.cosOfOuterCutoff;
        float intensity = clamp((theta - light.cosOfOuterCutoff) / epsilon, 0.0, 1.0);
        

        ambient *= attenuation * intensity;
        diffuse *= attenuation * intensity;
        specular *= attenuation * intensity;
        
        return ambient + diffuse + specular;
    }
    
    void main() {

        vec3 color = vec3(0, 0, 0);
 
        for(int i = 0; i < MAX_POINT_LIGHTS; i++)
        {
            if(i >= countPointLights)
            {
                break;
            }
            
            color += CalcPointLight(pointLights[i], objectNormal, objectPosition, cameraPosition);
        }

        color += CalcSpotLight(spotLight, objectNormal, objectPosition, cameraPosition);

        color *= objectColor.xyz;
        gl_FragColor = vec4(color.xyz, objectColor.w);
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