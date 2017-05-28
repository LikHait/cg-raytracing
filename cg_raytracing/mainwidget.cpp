#include "mainwidget.h"
#include <QMessageBox>
MainWidget::MainWidget(QWidget *parent) :
    QOpenGLWidget(parent)
{
}

MainWidget::~MainWidget()
{

}


void MainWidget::initData()
{
    QVector3D vectdata[] = {QVector3D(-1.0f, -1.0f, 0.0f), QVector3D( 1.0f, -1.0f, 0.0f), QVector3D( 1.0f,  1.0f, 0.0f), QVector3D(-1.0f,  1.0f, 0.0f)};
    glGenBuffers(1, &vbo_position);
    glBindBuffer(GL_ARRAY_BUFFER,  vbo_position);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vectdata), vectdata, GL_STATIC_DRAW);
    glVertexAttribPointer(attribute_vpos, 3, GL_FLOAT, false, 0, 0);

    glBindBuffer(GL_ARRAY_BUFFER, 0);
}

void MainWidget::initializeGL()
{
    initializeOpenGLFunctions();

    glClearColor(0, 1, 0, 1);

    initShaders();
}

void MainWidget::initShaders()
{
    // Compile vertex shader
    if (!program.addShaderFromSourceFile(QOpenGLShader::Vertex, ":/vshader.vert"))
        close();

    // Compile fragment shader
    if (!program.addShaderFromSourceFile(QOpenGLShader::Fragment, ":/fshader.frag"))
        close();

    initData();
    // Link shader pipeline
    if (!program.link())
        close();
    qDebug() << program.log();
    // Bind shader pipeline for use
    if (!program.bind())
        close();

}

void MainWidget::resizeGL(int width, int height)
{
   glViewport(0, 0, width, height);
}

void MainWidget::paintGL()
{
    /*
    glClear(GL_COLOR_BUFFER_BIT);
    update();
        */
}
