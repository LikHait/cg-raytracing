#version 430

out vec4 FragColor;
in vec3 glPosition;

void main ( void )
{
    FragColor = vec4 ( abs(glPosition.xy), 0, 1.0);
}
/*
uniform sampler2D qt_Texture0;
varying vec4 qt_TexCoord0;

void main(void)
{
    gl_FragColor = texture2D(qt_Texture0, qt_TexCoord0.st);
}
*/
