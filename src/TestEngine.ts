/*namespace MainProgram{

    export let m4 = {
  
      perspective: function(fieldOfViewInRadians : any, aspect : any, near : any, far : any) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / ( near - far );
  
        return [
          f / aspect,       0,                          0,                         0,
                   0,       f,                          0,                         0,
                   0,       0,    (near + far) * rangeInv, 2 * near * far * rangeInv,
                   0,       0,                         -1,                         0
        ];
      },    
  
      translation: function(tx : any, ty : any, tz : any) {
        return [
           1,  0,  0,  tx,
           0,  1,  0,  ty,
           0,  0,  1,  tz,
           0,  0,  0,   1,
        ];
      },
     
      xRotation: function(angleInRadians : any) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
          1, 0,  0, 0,
          0, c, -s, 0,
          0, s,  c, 0,
          0, 0,  0, 1, 
        ];
      },
     
      yRotation: function(angleInRadians : any) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
           c, 0, s, 0,
           0, 1, 0, 0,
          -s, 0, c, 0,
           0, 0, 0, 1,
        ];
      },
     
      zRotation: function(angleInRadians : any) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
           c, -s, 0, 0,
           s,  c,  0, 0,
           0,  0, 1, 0,
           0,  0, 0, 1,
        ];
      },
     
      scaling: function(sx : any, sy : any, sz : any) {
        return [
          sx, 0,  0,  0,
          0, sy,  0,  0,
          0,  0, sz,  0,
          0,  0,  0,  1,
        ];
      },

      translate: function(m : any, tx : any, ty : any, tz : any) {
        return m4.MultiplyMatrix(m, m4.translation(tx, ty, tz));
      },
  
      MultiplyMatrix: function (a: any, b: any){
        const dimentionOfMatrix = 4;
        let resultMatrix = new Array(dimentionOfMatrix * dimentionOfMatrix).fill(0);
        let step = dimentionOfMatrix - 1;
        
        for(let i = 0; i < dimentionOfMatrix; i++)
          for(let j = 0; j < dimentionOfMatrix; j++)
            for(let k = 0; k < dimentionOfMatrix; k++)
              resultMatrix[i + j + step * i] += a[i + k + step * i] * b[k + j + step * k];
        
        return resultMatrix;
      },
      ///matrix row major
      MultiplyMatrixAndVectors: function (a: any, b: any)
      {
        const dimentionOfMatrix = 4;
        const dimentionOfVector = 1; // dimension of vector may be bad name but let it be
        let resultMatrix = new Array(dimentionOfMatrix * dimentionOfVector).fill(0);
        let stepVector = dimentionOfVector - 1;
        let stepMatrix = dimentionOfMatrix - 1;
        
        for(let i = 0; i < dimentionOfMatrix; i++)
          for(let j = 0; j < dimentionOfVector; j++)
            for(let k = 0; k < dimentionOfMatrix; k++)
              resultMatrix[i + j + stepVector * i] += a[i + k + stepMatrix * i] * b[k + j + stepVector * k];
        
        return resultMatrix;
      },
       ///old multiply column major
      vectorMultiply: function(v : any, m : any) {
        var dst = [];
        for (var i = 0; i < 4; ++i) {
          dst[i] = 0.0;
          for (var j = 0; j < 4; ++j) {
            dst[i] += v[j] * m[j * 4 + i];
          }
        }
        return dst;
      },
  
      subtractVectors: function (a : any, b : any) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      },
  
      additionVectors: function(a: any, b: any){
        return  [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
      },
  
      multiplyScalarOnVector: function(scalar : any, vector : any)
      {
        return  [scalar * vector[0], scalar * vector[1], scalar * vector[2]];
      },
  
      normalize: function normalize(v : any) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
          return [v[0] / length, v[1] / length, v[2] / length];
        } else {
          return [0, 0, 0];
        }
      },
  
      cross: function (a : any, b : any) {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
      },
  
      scalarMultiply: function(a: any, b: any){
        return a[0] * b[0] + a[1] * b[1] + a[2]*b[2];
      },
      inverse: function(m : any) {
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;
    
        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    
        return [
          d * t0,
          d * t1,
          d * t2,
          d * t3,
          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
      }
    };
  
    function degToRad(d : any) {
      return d * Math.PI / 180;
    }
  
      export class TestEngine{
          
          private _canvas: HTMLCanvasElement;
          private _shaderProgram: WebGLProgram;
          public Camera: Camera = new Camera();
  
          constructor()
          {
              this._canvas = GlUtilities.initialize("glcanvas")
              console.log(this._canvas)
              if (glContext) {
                  glContext.clearColor(0.1, 0.3, 0.1, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
                  glContext.enable(glContext.DEPTH_TEST);                               // включает использование буфера глубины
                  glContext.depthFunc(glContext.LESS);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
                  glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
                
                //TODO add draw scene
                this.setGeometry()
              }
  
              this._shaderProgram = this.InitShadersAndGetProgram();
          }
          
          private InitShadersAndGetProgram()
          {
              //Init shaders
              let vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
              let fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER); 
              
              if(!!vertexShader && !!fragmentShader)
              {
                  glContext.shaderSource(vertexShader, VERTEX_SHADER_SOURCE);
                  glContext.compileShader(vertexShader);
  
                  glContext.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
                  glContext.compileShader(fragmentShader);
              }
              else 
                  throw "Can't init shaders" 
  
              //создаем объект программы шейдеров
              let shaderProgram : WebGLProgram = glContext.createProgram()  as WebGLProgram;
              
              if(shaderProgram != null )
              {
                  // прикрепляем к ней шейдеры
                  glContext.attachShader(shaderProgram , vertexShader);
                  glContext.attachShader(shaderProgram, fragmentShader);
                  // связываем программу с контекстом webgl
                  glContext.linkProgram(shaderProgram);
                  glContext.useProgram(shaderProgram);
              }
              else
                  throw "Can't init shader program"
              
              return shaderProgram
          }
  
          public DrawScence (camera : Camera) : void
          {
            glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
            glContext.disable(glContext.CULL_FACE);
            glContext.enable(glContext.DEPTH_TEST);
            glContext.useProgram(this._shaderProgram);
  
            this.setGeometry()
              
            let positionAttributeLocation = glContext.getAttribLocation(this._shaderProgram, "a_Position");
                glContext.enableVertexAttribArray(positionAttributeLocation);
                glContext.vertexAttribPointer(positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
    
                let matrixLocation = glContext.getUniformLocation(this._shaderProgram, "u_matrix");
            
            // Compute the matrix
            let zNear = 1;
            let zFar = 2000;
            let fieldOfViewRadians = degToRad(60);
            let aspect = glContext.canvas.width / glContext.canvas.height;
  
            let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
            

            var radius = 200;
            var cameraAngleRadians = degToRad(30);
            var fPosition = [radius, 0, 0];    

            var WEBGLFoundamntalsCameraMatrix = m4.yRotation(cameraAngleRadians);
                WEBGLFoundamntalsCameraMatrix = m4.translate(WEBGLFoundamntalsCameraMatrix, 0, 0, radius * 1.5);

            // Get the camera's position from the matrix we computed
            var cameraPosition = [
                 WEBGLFoundamntalsCameraMatrix[3],
                 WEBGLFoundamntalsCameraMatrix[7],
                 WEBGLFoundamntalsCameraMatrix[11],   
            ];

            var up = [0, 1, 0];

            let cameraMatrix = new Camera(cameraPosition, fPosition, up).matrix;
            let viewMatrix = m4.inverse(cameraMatrix)
            console.log('inverseCamera',cameraMatrix)
            let viewProjectionMatrix = m4.MultiplyMatrix(projectionMatrix, cameraMatrix);
            
            var numFs = 5;
            for (var ii = 0; ii < numFs; ++ii) {
                var angle = ii * Math.PI * 2 / numFs;
                var x = Math.cos(angle) * radius;
                var y = Math.sin(angle) * radius;
          
                // starting with the view projection matrix
                // compute a matrix for the F
                var matrix = m4.translate(viewProjectionMatrix, x, 0, y);
          
                // Set the matrix.
                glContext.uniformMatrix4fv(matrixLocation, false, matrix);
          
                // Draw the geometry.
                var primitiveType = glContext.TRIANGLES;
                var offset = 0;
                var count = 16 * 6;
                glContext.drawArrays(primitiveType, offset, count);
              }
              
          }
  
          public setGeometry() 
          {
            let gl = glContext;
            var positions = new Float32Array([
                    // left column front
                    0,   0,  0,
                    0, 150,  0,
                    30,   0,  0,
                    0, 150,  0,
                    30, 150,  0,
                    30,   0,  0,
          
                    // top rung front
                    30,   0,  0,
                    30,  30,  0,
                    100,   0,  0,
                    30,  30,  0,
                    100,  30,  0,
                    100,   0,  0,
          
                    // middle rung front
                    30,  60,  0,
                    30,  90,  0,
                    67,  60,  0,
                    30,  90,  0,
                    67,  90,  0,
                    67,  60,  0,
          
                    // left column back
                      0,   0,  30,
                     30,   0,  30,
                      0, 150,  30,
                      0, 150,  30,
                     30,   0,  30,
                     30, 150,  30,
          
                    // top rung back
                     30,   0,  30,
                    100,   0,  30,
                     30,  30,  30,
                     30,  30,  30,
                    100,   0,  30,
                    100,  30,  30,
          
                    // middle rung back
                     30,  60,  30,
                     67,  60,  30,
                     30,  90,  30,
                     30,  90,  30,
                     67,  60,  30,
                     67,  90,  30,
          
                    // top
                      0,   0,   0,
                    100,   0,   0,
                    100,   0,  30,
                      0,   0,   0,
                    100,   0,  30,
                      0,   0,  30,
          
                    // top rung right
                    100,   0,   0,
                    100,  30,   0,
                    100,  30,  30,
                    100,   0,   0,
                    100,  30,  30,
                    100,   0,  30,
          
                    // under top rung
                    30,   30,   0,
                    30,   30,  30,
                    100,  30,  30,
                    30,   30,   0,
                    100,  30,  30,
                    100,  30,   0,
          
                    // between top rung and middle
                    30,   30,   0,
                    30,   60,  30,
                    30,   30,  30,
                    30,   30,   0,
                    30,   60,   0,
                    30,   60,  30,
          
                    // top of middle rung
                    30,   60,   0,
                    67,   60,  30,
                    30,   60,  30,
                    30,   60,   0,
                    67,   60,   0,
                    67,   60,  30,
          
                    // right of middle rung
                    67,   60,   0,
                    67,   90,  30,
                    67,   60,  30,
                    67,   60,   0,
                    67,   90,   0,
                    67,   90,  30,
          
                    // bottom of middle rung.
                    30,   90,   0,
                    30,   90,  30,
                    67,   90,  30,
                    30,   90,   0,
                    67,   90,  30,
                    67,   90,   0,
          
                    // right of bottom
                    30,   90,   0,
                    30,  150,  30,
                    30,   90,  30,
                    30,   90,   0,
                    30,  150,   0,
                    30,  150,  30,
          
                    // bottom
                    0,   150,   0,
                    0,   150,  30,
                    30,  150,  30,
                    0,   150,   0,
                    30,  150,  30,
                    30,  150,   0,
          
                    // left side
                    0,   0,   0,
                    0,   0,  30,
                    0, 150,  30,
                    0,   0,   0,
                    0, 150,  30,
                    0, 150,   0]);
          
            var matrix = m4.xRotation(Math.PI);
                matrix = m4.translate(matrix, -50, -75, -35);
          
             for (var ii = 0; ii < positions.length; ii += 3) {

               var vector = m4.MultiplyMatrixAndVectors(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1] );

              positions[ii + 0] = vector[0];
              positions[ii + 1] = vector[1];
              positions[ii + 2] = vector[2];
             }

            let positionBuffer = glContext.createBuffer();
                gl.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }
      }
  }
  */