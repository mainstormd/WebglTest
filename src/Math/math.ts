export let m3 = {

    perspective: function(fieldOfViewInRadians : number, aspect : number, near : number, far : number) {
      var f = 1 / Math.tan( 0.5 * fieldOfViewInRadians ); // tan that not divide by zero
      var rangeInv = 1.0 / ( near - far );
  
      return [
         f / aspect,       0,                          0,                         0,
                  0,       f,                          0,                         0,
                  0,       0,    (near + far) * rangeInv, 2 * near * far * rangeInv,
                  0,       0,                         -1,                         0
      ];
    },    
  
    IdentityMatrix : function() : number[] {
      return [
        1,  0,  0,   0,
        0,  1,  0,   0,
        0,  0,  1,   0,
        0,  0,  0,   1,
      ]
    },
  
    translation: function(tx : number, ty : number, tz : number) {
      return [
          1,  0,  0,  tx,
          0,  1,  0,  ty,
          0,  0,  1,  tz,
          0,  0,  0,   1,
      ];
    },
    
    xRotation: function(angleInRadians : number) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
    
      return [
        1, 0,  0, 0,
        0, c, -s, 0,
        0, s,  c, 0,
        0, 0,  0, 1, 
      ];
    },
    
    yRotation: function(angleInRadians : number) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
    
      return [
         c, 0, s, 0,
         0, 1, 0, 0,
        -s, 0, c, 0,
         0, 0, 0, 1,
      ];
    },
    
    zRotation: function(angleInRadians : number) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
    
      return [
        c, -s, 0, 0,
        s,  c,  0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1,
      ];
    },
    
    scaling: function(sx : number, sy : number, sz : number) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },
  
    MultiplyMatrix: function (a: any, b: any) : number [] {
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
  
    multiplyScalarOnVector: function(scalar : any, vector : any){
      return  [scalar * vector[0], scalar * vector[1], scalar * vector[2]];
    },
  
    normalize: function normalize(v : any) {
      var length = this.length(v)
      // make sure we don't divide by 0.
      if (length > 0) {
        return [v[0] / length, v[1] / length, v[2] / length];
      } else {
        return [0, 0, 0];
      }
    },
  
    length: function(v: any) : number
    {
        let l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (l > 0.00001) {
            return l;
        } else {
            return 0;
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
  };
  
  export function degToRad(d : any) {
    return d * Math.PI / 180;
  }