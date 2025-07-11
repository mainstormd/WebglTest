//by default in attribute can do w = 1 if we pass 3 dimensional vector
attribute vec4 position; 
attribute vec2 positionInTexture;

attribute vec3 normal; // in tangent space
attribute vec3 tangent; // in tangent space
attribute vec3 biTangent; // in tangent space

varying lowp vec4 objectPosition;

varying lowp mat3 TBN; //column major order
varying lowp vec2 textureCoordinate;
    
// A matrix to transform the positions by
uniform mat4 ModelViewProjection;
uniform mat4 ModelMatrix;

highp mat3 transpose(in highp mat3 inMatrix) {
    highp vec3 i0 = inMatrix[0];
    highp vec3 i1 = inMatrix[1];
    highp vec3 i2 = inMatrix[2];

    highp mat3 outMatrix = mat3(
                 vec3(i0.x, i1.x, i2.x),
                 vec3(i0.y, i1.y, i2.y),
                 vec3(i0.z, i1.z, i2.z)
                 );

    return outMatrix;
}

void main() { 
    gl_Position = position * ModelViewProjection;

    objectPosition = position * ModelMatrix;
    vec3 objectNormal = normalize(normal * mat3(ModelMatrix)); // матрица не ортонормированная наверно надо задуматься о другой матрице для этих векторов
    vec3 objectTangent = normalize(tangent * mat3(ModelMatrix));
    vec3 objectBiTangent = normalize(biTangent * mat3(ModelMatrix));
    /*
        https://en.wikibooks.org/wiki/GLSL_Programming/Vector_and_Matrix_Operations#Operators

        vec3 column0 = vec3(0.0, 1.0, 0.0);
        vec3 column1 = vec3(1.0, 0.0, 0.0);
        vec3 column2 = vec3(0.0, 0.0, 1.0);
        mat3 n = mat3(column0, column1, column2); // sets columns of matrix n
    */

    //т.к хотим перейти в текстурное пространство, ищем обратную, вместо invers можно использовать транспонированную
    TBN = transpose(mat3(objectTangent, objectBiTangent, objectNormal));
    
    textureCoordinate = positionInTexture;
}
