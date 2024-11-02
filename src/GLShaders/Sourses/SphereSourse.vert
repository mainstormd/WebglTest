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
    vec4 resultPosition = mix(position, spherePosition, interpolationCoeff); //1.0  is off animation  
    
    gl_Position = resultPosition * ModelViewProjection;
    
    objectPosition = resultPosition * ModelMatrix;
    objectNormal = (vec4(normal, 0) * ModelMatrix).xyz;
    objectColor = color;
}