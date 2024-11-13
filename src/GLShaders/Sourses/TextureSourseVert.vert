
attribute vec4 position;
attribute vec2 positionInTexture;

uniform mat4 ModelViewProjection;

varying vec2 textureCoordinate;

void main()
{
    gl_Position = position * ModelViewProjection;
    textureCoordinate = positionInTexture;
}