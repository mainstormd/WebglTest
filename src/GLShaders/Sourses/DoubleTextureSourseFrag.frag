precision mediump float;

varying lowp vec2 textureCoordinate;
uniform sampler2D texture0;
uniform sampler2D texture1;

void main()
{
    vec4 color0 = texture2D(texture0, textureCoordinate);
    vec4 color1 = texture2D(texture1, textureCoordinate);
    gl_FragColor = color1 * color0;
}