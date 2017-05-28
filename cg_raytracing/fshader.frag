#version 430
//деф не работает?
#define EPSILON = 0.001
#define BIG = 1000000.0
const int DIFFUSE = 1;
const int REFLECTION = 2;
const int REFRACTION = 3;

const int DIFFUSE_REFLECTION = 1;
const int MIRROR_REFLECTION = 2;

out vec4 FragColor;
in vec3 glPosition;

/*** DATA STRUCTURES ***/

struct SCamera
{
        vec3 Position;                  //позиция памеры
        vec3 View;
        vec3 Up;
        vec3 Side;
        vec2 Scale;                     //масштабирование
};

struct SRay
{
        vec3 Origin;			//происхождение (источник)
        vec3 Direction;			//направление
};

struct SSphere
{
    vec3 Center;
    float Radius;
    int MaterialIdx;
};

struct STriangle
{
    vec3 v1;
    vec3 v2;
    vec3 v3;
    int MaterialIdx;
};

struct SIntersection
{
    float Time;
    vec3 Point;
    vec3 Normal;
    vec3 Color;
    vec4 LightCoeffs;
    float ReflectionCoef;
    float RefractionCoef;
    int MaterialType; //тип
};

struct SLight
{
    vec3 Position;
};

struct SMaterial
{
        vec3 Color; //цвет лучей
        vec4 LightCoeffs;
        float ReflectionCoef; //отражение
        float RefractionCoef; //преломление
        int MaterialType;
};

struct STracingRay
{
    SRay ray;
    float contribution;
    int depth;
};

STriangle triangles[10];
SSphere spheres[2];
SCamera uCamera; //камера
SMaterial materials[6];
SLight uLight;

////////////////////////////
const int MAX_RAYS = 50;
int currentSize = 0;
STracingRay StackRays[MAX_RAYS];

bool isEmpty()
{
    if (currentSize == 0)
        return true;
    return false;
}

bool isFull()
{
    if (currentSize == MAX_RAYS - 1)
        return true;
    return false;
}

bool pushRay(STracingRay addRay)
{
    if(!isFull())
    {
        StackRays[currentSize] = addRay;
        currentSize++;
        return true;
    }
    return false;
}

STracingRay popRay()
{
    if (!isEmpty())
    {
        return StackRays[--currentSize];
    }
}

/////////////////


SRay GenerateRay(SCamera uCamera)
{
        vec2 coords = glPosition.xy * uCamera.Scale; //масштабирование
        vec3 direction = uCamera .View + uCamera .Side * coords.x + uCamera .Up * coords.y;
        return SRay( uCamera.Position, normalize(direction) );
}

void initializeDefaultCamera()
{
     //** CAMERA **//
    uCamera.Position = vec3(0.0, 0.0, -8.0);
    uCamera.View = vec3(0.0, 0.0, 1.0);
    uCamera.Up = vec3(0.0, 1.0, 0.0);
    uCamera.Side = vec3(1.0, 0.0, 0.0);
    uCamera.Scale = vec2(1.0);
}

void initializeDefaultScene(out STriangle triangles[10], out SSphere spheres[2])
{
    /** TRIANGLES **/
    //Левая грань
    triangles[0].v1 = vec3(-5.0,-5.0,-5.0);
    triangles[0].v2 = vec3(-5.0, 5.0, 5.0);
    triangles[0].v3 = vec3(-5.0, 5.0,-5.0);
    triangles[0].MaterialIdx = 0;

    triangles[1].v1 = vec3(-5.0,-5.0,-5.0);
    triangles[1].v2 = vec3(-5.0,-5.0, 5.0);
    triangles[1].v3 = vec3(-5.0, 5.0, 5.0);
    triangles[1].MaterialIdx = 0;

    //Задняя грань
    triangles[2].v1 = vec3(-5.0,-5.0, 5.0);
    triangles[2].v2 = vec3( 5.0,-5.0, 5.0);
    triangles[2].v3 = vec3(-5.0, 5.0, 5.0);
    triangles[2].MaterialIdx = 1;

    triangles[3].v1 = vec3( 5.0, 5.0, 5.0);
    triangles[3].v2 = vec3(-5.0, 5.0, 5.0);
    triangles[3].v3 = vec3( 5.0,-5.0, 5.0);
    triangles[3].MaterialIdx = 1;

    //Правая грань
    triangles[4].v1 = vec3(5.0, -5.0, 5.0);
    triangles[4].v2 = vec3(5.0, -5.0, -5.0);
    triangles[4].v3 = vec3(5.0, 5.0, 5.0);
    triangles[4].MaterialIdx = 2;

    triangles[5].v1 = vec3(5.0, -5.0, -5.0);
    triangles[5].v2 = vec3(5.0, 5.0, -5.0);
    triangles[5].v3 = vec3(5.0, 5.0, 5.0);
    triangles[5].MaterialIdx = 2;

    //Нижняя грань
    triangles[6].v1 = vec3(-5.0, -5.0, 5.0);
    triangles[6].v2 = vec3(-5.0, -5.0, -5.0);
    triangles[6].v3 = vec3(5.0, -5.0, 5.0);
    triangles[6].MaterialIdx = 3;

    triangles[7].v1 = vec3(-5.0, -5.0, -5.0);
    triangles[7].v2 = vec3(5.0, -5.0, -5.0);
    triangles[7].v3 = vec3(5.0, -5.0, 5.0);
    triangles[7].MaterialIdx = 3;

    //Верхняя грань
    triangles[8].v1 = vec3(-5.0, 5.0, 5.0);
    triangles[8].v2 = vec3(5.0, 5.0, 5.0);
    triangles[8].v3 = vec3(-5.0, 5.0, -5.0);
    triangles[8].MaterialIdx = 5;

    triangles[9].v1 = vec3(-5.0, 5.0, -5.0);
    triangles[9].v2 = vec3(5.0, 5.0, 5.0);
    triangles[9].v3 = vec3(5.0, 5.0, -5.0);
    triangles[9].MaterialIdx = 5;

    /** SPHERES **/
    spheres[0].Center = vec3(-1.0,-1.0,-2.0);
    spheres[0].Radius = 2.0;
    spheres[0].MaterialIdx = 4;

    spheres[1].Center = vec3(2.0, 1.0, 2.0);
    spheres[1].Radius = 1.0;
    spheres[1].MaterialIdx = 4;

}

void initializeDefaultLightMaterials(out SLight light)
{
    light.Position = vec3(0.0, 2.0, -4.0);

    /** MATERIALS **/
    vec4 lightCoefs = vec4(0.4, 0.9, 0.0, 512.0);

        //FF8500
    materials[0].Color = vec3(1.0, 0.5, 0.0);
    materials[0].LightCoeffs = vec4(lightCoefs);
    materials[0].ReflectionCoef = 0.5;
    materials[0].RefractionCoef = 1.0;
    materials[0].MaterialType = DIFFUSE;

        //FF2C00
    materials[1].Color = vec3(1.0, 0.173, 1.0);
    materials[1].LightCoeffs = vec4(lightCoefs);
    materials[1].ReflectionCoef = 0.5;
    materials[1].RefractionCoef = 1.0;
    materials[1].MaterialType = DIFFUSE;

        //A61D00
    materials[2].Color = vec3(0.651, 0.114, 0.0);
    materials[2].LightCoeffs = vec4(lightCoefs);
    materials[2].ReflectionCoef = 0.5;
    materials[2].RefractionCoef = 1.0;
    materials[2].MaterialType = DIFFUSE;

        //FFFFFF
    materials[3].Color = vec3(1.0, 1.0, 1.0);
    materials[3].LightCoeffs = vec4(lightCoefs);
    materials[3].ReflectionCoef = 0.5;
    materials[3].RefractionCoef = 1.0;
    materials[3].MaterialType = DIFFUSE;

        //808080, MIRROR
    materials[4].Color = vec3(0.5, 0.5, 0.5);
    materials[4].LightCoeffs = vec4(lightCoefs);
    materials[4].ReflectionCoef = 0.7;
    materials[4].RefractionCoef = 1.0;
    materials[4].MaterialType = MIRROR_REFLECTION;

        //FF8B73
    materials[5].Color = vec3(1.0, 0.545, 0.451);
    materials[5].LightCoeffs = vec4(lightCoefs);
    materials[5].ReflectionCoef = 0.5;
    materials[5].RefractionCoef = 1.0;
    materials[5].MaterialType = DIFFUSE;
}

bool IntersectSphere(SSphere sphere, SRay ray, float start, float final, out float time)
{
    ray.Origin -= sphere.Center;
    float A = dot(ray.Direction, ray.Direction);
    float B = dot(ray.Direction, ray.Origin);
    float C = dot(ray.Origin, ray.Origin) - sphere.Radius * sphere.Radius;
    float D = B * B - A * C;
    if (D > 0.0) {
        D = sqrt(D);
        float t1 = (-B - D) / A;
        float t2 = (-B + D) / A;
        if (t1 < 0 && t2 < 0)
            return false;
        if (min(t1, t2) < 0) {
            time = max(t1, t2);
            return true;
        }
        time = min(t1, t2);
        return true;
    }
    return false;
}

bool IntersectTriangle(SRay ray, vec3 v1, vec3 v2, vec3 v3, out float time)
{
    time = -1;
    vec3 A = v2 - v1;
    vec3 B = v3 - v1;
    vec3 N = cross(A, B);
    float NdotRayDirection = dot(N, ray.Direction);
    if (abs(NdotRayDirection) < 0.001)
        return false;
    float d = dot(N, v1);
    float t = -(dot(N, ray.Origin) - d) / NdotRayDirection;
    if (t < 0)
        return false;
    vec3 P = ray.Origin + t * ray.Direction;
    vec3 C;
    vec3 edge1 = v2 - v1;
    vec3 VP1 = P - v1;
    C = cross(edge1, VP1);
    if (dot(N, C) < 0)
        return false;
    vec3 edge2 = v3 - v2;
    vec3 VP2 = P - v2;
    C = cross(edge2, VP2);
    if (dot(N, C) < 0)
        return false;
    vec3 edge3 = v1 - v3;
    vec3 VP3 = P - v3;
    C = cross(edge3, VP3);
    if (dot(N, C) < 0)
        return false;
    time = t;
    return true;
}

bool Raytrace(SRay ray, SSphere spheres[2], STriangle triangles[10], SMaterial materials[6], float start, float final, inout SIntersection intersect)
{
        bool result = false;
        float test = start;
        intersect.Time = final;

        //сфера
        for(int i = 0; i < 2; i++)
        {
                SSphere sphere = spheres[i];
                if ( IntersectSphere (sphere, ray, start, final, test ) && test < intersect.Time )
                {
                        intersect.Time = test;
                        intersect.Point = ray.Origin + ray.Direction * test;
                        intersect.Normal = normalize(intersect.Point - spheres[i].Center);
                        intersect.Color = materials[sphere.MaterialIdx].Color;
                        intersect.LightCoeffs = materials[sphere.MaterialIdx].LightCoeffs;
                        intersect.ReflectionCoef = materials[sphere.MaterialIdx].ReflectionCoef;
                        intersect.RefractionCoef = materials[sphere.MaterialIdx].RefractionCoef;
                        intersect.MaterialType = materials[sphere.MaterialIdx].MaterialType;
                        result = true;
                }
        }

        //треугольник
        for(int i = 0; i < 10; i++)
        {
                STriangle triangle = triangles[i];
                if(IntersectTriangle(ray, triangle.v1, triangle.v2, triangle.v3, test) && test < intersect.Time )
                {
                        intersect.Time = test;
                        intersect.Point = ray.Origin + ray.Direction * test;
                        intersect.Normal = normalize ( cross(triangle.v1 - triangle.v2, triangle.v3 - triangle.v2) );
                        intersect.Color = materials[triangles[i].MaterialIdx].Color;
                        intersect.LightCoeffs = materials[triangles[i].MaterialIdx].LightCoeffs;
                        intersect.ReflectionCoef = materials[triangles[i].MaterialIdx].ReflectionCoef;
                        intersect.RefractionCoef = materials[triangles[i].MaterialIdx].RefractionCoef;
                        intersect.MaterialType = materials[triangles[i].MaterialIdx].MaterialType;
                        result = true;
                }
        }
        return result;
}

vec3 Phong(SIntersection intersect, SLight currLight, float shadow)
{
    float Unit = 1; //??
    vec3 light = normalize(currLight.Position - intersect.Point);
    float diffuse = max(dot(light, intersect.Normal), 0.0);
    vec3 view = normalize(uCamera.Position - intersect.Point);
    vec3 reflected = reflect(-view, intersect.Normal);
    float specular = pow(max(dot(reflected, light), 0.0), intersect.LightCoeffs.w);
    return intersect.LightCoeffs.x * intersect.Color + intersect.LightCoeffs.y * diffuse * intersect.Color * shadow
         + intersect.LightCoeffs.z * specular * Unit;
}

float Shadow(SLight currLight, SIntersection intersect)
{
    float shadowing = 1.0;
    vec3 direction = normalize(currLight.Position - intersect.Point);
    float distanceLight = distance(currLight.Position, intersect.Point);
    SRay shadowRay = SRay(intersect.Point + direction * 0.001 , direction);
    SIntersection shadowIntersect;
    shadowIntersect.Time = 1000000.0;
    if (Raytrace(shadowRay, spheres, triangles, materials, 0, distanceLight, shadowIntersect)) {
            shadowing = 0.0;
        }
    return shadowing;
}

void main ( void )
{
    float start = 0;
    float final = 1000000.0;
    initializeDefaultScene(triangles, spheres);
    initializeDefaultCamera();
    SRay ray = GenerateRay(uCamera);
    vec3 resultColor = vec3(0,0,0);
    initializeDefaultLightMaterials(uLight);
    STracingRay trRay = STracingRay(ray, 1, 0);
    pushRay(trRay);
    while (!isEmpty())
    {
        STracingRay trRay = popRay();
        ray = trRay.ray;
        SIntersection intersect;
        intersect.Time = 1000000.0;
        start = 0;
        final = 1000000.0;
        if (Raytrace(ray, spheres, triangles, materials, start, final, intersect)) {
            switch (intersect.MaterialType)
            {
            case DIFFUSE_REFLECTION:
            {
                float shadowing = Shadow(uLight, intersect);
                resultColor += trRay.contribution * Phong(intersect, uLight, shadowing);
                break;
            }
            case MIRROR_REFLECTION:
            {
                if (intersect.ReflectionCoef < 1) {
                    float contribution = trRay.contribution * (1 - intersect.ReflectionCoef);
                    float shadowing = Shadow(uLight, intersect);
                    resultColor += contribution * Phong(intersect, uLight, shadowing);
                }
                vec3 reflectDirection = reflect(ray.Direction, intersect.Normal);
                float contribution = trRay.contribution * intersect.ReflectionCoef;
                STracingRay reflectRay = STracingRay(SRay(intersect.Point + reflectDirection * 0.001, reflectDirection), contribution, trRay.depth + 1);
                pushRay(reflectRay);
                break;
            }
            }
        }
    }
    FragColor = vec4 (resultColor, 1.0);
}
