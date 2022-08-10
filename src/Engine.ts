namespace MainProgram{

  export let m3 = {

    perspective: function(fieldOfViewInRadians : any, aspect : any, near : any, far : any) {
      var f = 1 / Math.tan( 0.5 * fieldOfViewInRadians );
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
         0,  0,  0, 1,
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
    }
  };

  export function degToRad(d : any) {
    return d * Math.PI / 180;
  }
/*
  function matrixToString( matrix : any )
  {
    let stringOfMatrices = ""

    for(let i = 0; i < 4; i++)
        for(let j = 0; j < 4; j++)
          stringOfMatrices += matrix[i]

  }
*/
    export class Engine{
        
        private _canvas: HTMLCanvasElement;
        private _shaderProgram: WebGLProgram;
        public Camera: Camera = new Camera();

        constructor()
        {
            this._canvas = GlUtilities.initialize("glcanvas")

            if (glContext) {
                glContext.clearColor(0.1, 0.3, 0.1, 1.0); // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
                glContext.enable(glContext.DEPTH_TEST);                               // включает использование буфера глубины
                glContext.depthFunc(glContext.LESS);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
                glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
              
              //TODO add draw scene
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

          let count = this.SetPlaneGeometry()
            
          let positionAttributeLocation = glContext.getAttribLocation(this._shaderProgram, "a_Position");
              glContext.enableVertexAttribArray(positionAttributeLocation);
              glContext.vertexAttribPointer(positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);

          let matrixLocation = glContext.getUniformLocation(this._shaderProgram, "u_matrix");
          
          // Compute the matrix
          let zNear = 1;
          let zFar = 2000;
          let fieldOfViewRadians = degToRad(60);
          let aspect = glContext.canvas.width / glContext.canvas.height;

          let projectionMatrix = m3.perspective(fieldOfViewRadians, aspect, zNear, zFar);
          let cameraMatrix = camera.matrix;
          let matrix = m3.MultiplyMatrix(projectionMatrix, cameraMatrix);

          // Set the matrix.
          glContext.uniformMatrix4fv(matrixLocation, false, matrix);

          // draw
          let offset = 0;
              glContext.drawArrays(glContext.TRIANGLES, offset, count);
        }

        public SetPlaneGeometry() : any
        {
          const positions = [
            -70,  50, 0, 
            -70, -50, 0,
             50,  50, 0, 
            -70, -50, 0,
             50,  50, 0,
             50, -50, 0
          ]

          let count = positions.length;

          let positionBuffer = glContext.createBuffer();
              glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
              glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW)
          
          return count;
        }

        public SetCoubeGeometry() : any
        {    
          const positionBuffer = glContext.createBuffer();

          // Select the positionBuffer as the one to apply buffer
          // operations to from here out.

          glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);

          const positions = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
          
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
          
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
          
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
          
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
          
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
          ];

          const indexBuffer = glContext.createBuffer();
          glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);

          const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
          ];
        
          // Convert the array of colors into a table for all the vertices.
        
          let colors : any = [] ;
        
          for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
        
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
          }
        
          const colorBuffer = glContext.createBuffer();
          glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
          glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(colors), glContext.STATIC_DRAW);

          const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
          ];

          glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);

          return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
          };
        }
    }
}