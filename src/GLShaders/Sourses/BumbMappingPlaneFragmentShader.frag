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

varying lowp vec4 objectPosition;
varying highp mat3 TBN;
varying lowp vec2 textureCoordinate;

uniform sampler2D textureHeightMapObject;
uniform sampler2D textureNormalMapObject;
uniform sampler2D textureObject;

uniform vec3 cameraPosition;
uniform int countPointLights;

uniform PointLight pointLights[MAX_POINT_LIGHTS];

float GetDiffCoeff(vec3 lightDirection, vec3 normal);
float GetSpecCoeff(vec3 lightDirection, vec3 normal, vec4 objectPosition, vec3 cameraPosition);
float GetAttenuation(float constant, float linear, float quadratic, vec3 lightPosition, vec4 objectPosition);

vec3 GetAmbient(float ambientStrength, vec3 color);
vec3 GetDiffuse(float diffuseStrength, float diffCoeff, vec3 color);
vec3 GetSpecular(float specularStrength, float specCoeff, vec3 color);

vec3 CalcPointLight(PointLight light, vec3 objectNormal, vec4 objectPosition, vec3 cameraPosition)
{
    vec3 normal = normalize(objectNormal);
    vec3 lightDirection = normalize(light.position - objectPosition.xyz);
    
    float diff = GetDiffCoeff(lightDirection, normal);
    float spec = GetSpecCoeff(lightDirection, normal, objectPosition, cameraPosition);
    float attenuation = GetAttenuation(light.constant, light.linear, light.quadratic, light.position, objectPosition);

    vec3 ambient = GetAmbient(light.ambientStrength, light.color) * attenuation;
    vec3 diffuse = GetDiffuse(light.diffuseStrength, diff, light.color) * attenuation;
    vec3 specular = GetSpecular(light.specularStrength, spec, light.color) * attenuation; 
    
    return ambient + diffuse + specular;
}

vec3 GetAmbient(float ambientStrength, vec3 color)
{
    return ambientStrength * color;
}

vec3 GetDiffuse(float diffuseStrength, float diffCoeff, vec3 color)
{
    return diffuseStrength * diffCoeff * color;
}

vec3 GetSpecular(float specularStrength, float specCoeff, vec3 color)
{
    return specularStrength * specCoeff * color;
}

float GetDiffCoeff(vec3 lightDirection, vec3 normal)
{
    return max(dot(normal, lightDirection), 0.0);        
}

float GetSpecCoeff(vec3 lightDirection, vec3 normal, vec4 objectPosition, vec3 cameraPosition)
{
    vec3 viewDirection = normalize(cameraPosition - objectPosition.xyz);
    vec3 reflectDirection = reflect(-lightDirection, normal);
    
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);
    
    return spec;        
}

float GetAttenuation(float constant, float linear, float quadratic, vec3 lightPosition, vec4 objectPosition)
{
    float distance = length(lightPosition - objectPosition.xyz);
    
    vec3 constants = vec3(constant, linear, quadratic);
    vec3 distances = vec3(distance, distance, distance * distance);
    
    float attenuation = 1.0 / (dot(constants, distances) + 1.0); // +1 that not zero divide

    return attenuation;
}

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
    float height_scale = 0.1;
    float height =  texture2D(textureHeightMapObject, texCoords).r;    
    vec2 p = viewDir.xy / viewDir.z * (height * height_scale);
    return texCoords - p;    
}


void main() {

    vec3 color = vec3(0, 0, 0);

    vec4 tangentPosition = vec4(TBN * objectPosition.xyz,objectPosition.w); 
    vec3 tangentCamera = TBN * cameraPosition;

    vec2 bumpedCoordinate = ParallaxMapping(textureCoordinate, normalize(tangentCamera - tangentPosition.xyz));

    vec3 normalTexture = normalize(2.0 * texture2D(textureNormalMapObject, bumpedCoordinate).rgb - 1.0);

    /*
    на нормаль можно умноджать только матрицы вида inverse(transpose(m)), 
    в нашем случае ничего не меняется т.к  inverse можно заменить на transpose ведь матрица ортогональная
    а вот в прошлых алгоритмах расчета освещения могли забыть этот момент
    */ 
    //vec3 tangentNormal = TBN * normalTexture; 
    
    for(int i = 0; i < MAX_POINT_LIGHTS; i++)
    {
        if(i >= countPointLights)
        {
            break;
        }
        
        PointLight pointLight = pointLights[i]; 
        pointLight.position = TBN * pointLight.position;
        
        //color += CalcPointLight(pointLights[i], tangentNormal, objectPosition, cameraPosition);
       
        color += CalcPointLight(pointLight, normalTexture, tangentPosition, tangentCamera);
    }
    
    color *= texture2D(textureObject, bumpedCoordinate).rgb;

    gl_FragColor = vec4(color, 1);
} 