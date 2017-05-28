#version 430
in vec3 vPosition;
out vec3 glPosition;

void main (void)
{
        gl_Position = vec4(vPosition, 1.0);
        glPosition = vPosition;
}

/*attribute vec4 qt_Vertex;
attribute vec4 qt_MultiTexCoord0;
uniform mat4 qt_ModelViewProjectionMatrix;
varying vec4 qt_TexCoord0;

void main(void)
{
    gl_Position = qt_ModelViewProjectionMatrix * qt_Vertex;
    qt_TexCoord0 = qt_MultiTexCoord0;
}
*/
