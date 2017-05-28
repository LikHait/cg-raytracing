#include "mainwidget.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    a.setApplicationName("Ray tracing");
    a.setApplicationVersion("0.1");
    MainWidget w;
    w.show();

    return a.exec();
}
