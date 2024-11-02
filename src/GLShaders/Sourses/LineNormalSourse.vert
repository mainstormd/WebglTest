attribute vec4 position; 
attribute vec4 color;

uniform mat4 ModelViewProjection;

varying lowp vec4 objectColor;

void main() { 
    gl_Position = position * ModelViewProjection;

    objectColor = color;
}