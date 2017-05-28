#ifndef GEOMETRYENGINE_H
#define GEOMETRYENGINE_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>

class GeometryEngine : protected QOpenGLFunctions
{
public:
    GeometryEngine();
    ~GeometryEngine();
private:
    void initCubeGeometry();

    QOpenGLBuffer arrayBuf;
};

#endif // GEOMETRYENGINE_H
