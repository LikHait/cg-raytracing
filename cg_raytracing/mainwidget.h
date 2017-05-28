#ifndef MAINWIDGET_H
#define MAINWIDGET_H


#include <QWidget>
#include <QOpenGLWidget>
#include <QOpenGLFunctions>
#include <QString>
#include <QOpenGLShader>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QVector>
/*
#include <QMatrix4x4>
#include <QQuaternion>
#include <QVector2D>
*/

class MainWidget : public QOpenGLWidget, protected QOpenGLFunctions
{
    Q_OBJECT

public:
    MainWidget(QWidget *parent = 0);
    ~MainWidget();

protected:
    void initializeGL();
    void resizeGL(int width, int height);
    void paintGL();

private:
    QOpenGLShaderProgram program;
    void initShaders();
    void initData();


//data
    GLuint vbo_position;
    GLuint attribute_vpos;
};

#endif // MAINWIDGET_H
