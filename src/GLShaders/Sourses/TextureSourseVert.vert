
attribute vec4 position;
attribute vec2 positionInTexture;

uniform mat4 ModelViewProjection;

varying vec2 textureCoordinate;

void main()
{
    gl_Position = position * ModelViewProjection;
    textureCoordinate = vec2( 1.0 - positionInTexture.s , 1.0 - positionInTexture.t);
}