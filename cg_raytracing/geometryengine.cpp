#include "geometryengine.h"

GeometryEngine::GeometryEngine()
{
    initializeOpenGLFunctions();
    arrayBuf.create();

    initCubeGeometry();
}


GeometryEngine::~GeometryEngine()
{
    arrayBuf.destroy();
}


void GeometryEngine::initCubeGeometry()
{
    QVector3D vectdata[] = {QVector3D(-1.0f, -1.0f, 0.0f), QVector3D( 1.0f, -1.0f, 0.0f), QVector3D( 1.0f,  1.0f, 0.0f), QVector3D(-1.0f,  1.0f, 0.0f)};

    arrayBuf.bind();
    arrayBuf.allocate(vectdata, sizeof(vectdata));
}
