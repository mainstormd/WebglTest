precision mediump float;

varying lowp vec2 textureCoordinate;
uniform sampler2D texture;

void main()
{
    gl_FragColor = texture2D(texture, textureCoordinate);
}