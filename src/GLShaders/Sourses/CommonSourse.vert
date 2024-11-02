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
    objectNormal = (vec4(normal, 0) * ModelMatrix).xyz;
}