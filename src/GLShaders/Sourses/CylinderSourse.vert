attribute vec4 position; 
attribute vec3 normal;
attribute vec4 color;   

attribute float weight;

// A matrix to transform the positions by
uniform mat4 ModelViewProjection;
uniform mat4 ModelMatrix;

//bones
uniform mat4 IdentityBone;
uniform mat4 RotateBone;

//varyings
varying lowp vec4 objectColor;
varying lowp vec4 objectPosition;
varying lowp vec3 objectNormal;

void main() { 
    mat4 ResultBone = (1.0 - weight) * IdentityBone + weight * RotateBone;
    vec4 totalPosition = position * ResultBone;
    gl_Position = totalPosition * ModelViewProjection;
    
    objectPosition = totalPosition * ModelMatrix;
    objectNormal = (vec4(normal, 0)  * ResultBone * ModelMatrix).xyz;
    objectColor = color;
}