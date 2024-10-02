import { DefaultBuffer } from "../GLBuffers/DefaultBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { FRAGMENT_SHADER_NOLIGHT_SOURCE, FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE_CYLINDER, VERTEX_SHADER_SOURCE_LINE_NORMAL } from "../GLShaders/ShaderSources";
import { degToRad, m3 } from "../Math/math";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { CommonAttribureAndUniformSetter } from "../Utils/CommonAttribureAndUniformSetter";
import { CylinderAttribureAndUniformSetter } from "../Utils/CylinderAttribureAndUniformSetter";
import { glContext } from "../Utils/GLUtilities";
import { ObjectsEnum } from "./ObjectEnum";

class vec3
{
  public x: number
  public y: number
  public z: number

  constructor(x:number, y:number, z:number)
  {
    this.x = x
    this.y = y
    this.z = z
  }
}

class CylinderPoint
{
    public position : vec3 
    public weight : number
    public normal : [number, number, number]

    constructor(position : vec3, weight : number, normal: [number, number, number])
    {
      this.position = position
      this.weight = weight
      this.normal = normal
    }
}

export class Cylinder{

    private modelMatrix  : number[] | null = m3.IdentityMatrix() 
    private IdentityBone : number[] | null = m3.IdentityMatrix() 
    private RotateBone   : number[] | null = m3.IdentityMatrix()
    
    private _positions : number [] = []
    private _weights : number [] = []
    private _normals : number [] = [] 

    private _shaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_CYLINDER, FRAGMENT_SHADER_SOURCE)
    public assetSetter = new CylinderAttribureAndUniformSetter(this._shaderProgram.program)

    constructor()
    {
      const radius = 1
      const delta = 1/6
      const vicinity = 0.00001
      
      let points : CylinderPoint[] = [] 
      
      for( let weight = delta; weight <= 1 ; weight += delta) 
      {
        if(1 - weight <= vicinity)
        {
          points = points.concat(this.GetDiscCylinderPoints(this.GetCylinderPointOfCircle(radius, weight), [0, 1, 0]))
        }

        if(weight - delta <= vicinity)
        {
          points = points.concat(this.GetDiscCylinderPoints(this.GetCylinderPointOfCircle(radius, weight - delta), [0, -1,  0]))
        }

        points = points.concat(this.GetReactanglesCylinderPoint(this.GetCylinderPointOfCircle(radius, weight - delta), this.GetCylinderPointOfCircle(radius, weight) )) 
      }

      points.forEach( point => {
        
        this._positions.push(point.position.x)
        this._positions.push(point.position.y)
        this._positions.push(point.position.z)
        
        this._weights.push(point.weight)
        this._normals.push(...point.normal)
      })

    }

    public GetCylinderPointOfCircle( radius: number, height: number) : CylinderPoint []
    {
        let points : CylinderPoint[] = []
        const delta = degToRad(5)

        for(let angle = 0; angle <= 2 * Math.PI; angle += delta)
        {
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);

            points.push(new CylinderPoint(new vec3(radius * cos, height, radius * sin), height, [radius * cos, 0, radius * sin ]))
        }
        
        return points
    } 

    public GetReactanglesCylinderPoint(circlePointsA : CylinderPoint [], circlePointsB : CylinderPoint[]) : CylinderPoint []
    {
      let rectanglesPoints : CylinderPoint[] = []

      for( let i = 0; i < circlePointsA.length; i++ )
      {
        const nextI = i + 1 < circlePointsA.length ? i + 1 : 0

        // first triangle
        rectanglesPoints.push(circlePointsA[i])
        rectanglesPoints.push(circlePointsA[nextI])
        rectanglesPoints.push(circlePointsB[i])

        // second triangle
        rectanglesPoints.push(circlePointsA[nextI])
        rectanglesPoints.push(circlePointsB[nextI])
        rectanglesPoints.push(circlePointsB[i])
      }

      return rectanglesPoints
    }

    public GetDiscCylinderPoints(circlePoints : CylinderPoint[],  normal: [number, number, number]) : CylinderPoint []
    {
       let points : CylinderPoint[] = []

       for( let i = 0; i < circlePoints.length; i++ )
       {
          const nextI = i + 1 < circlePoints.length ? i + 1 : 0

          points.push(circlePoints[i])
          points.push(new CylinderPoint(new vec3(0, circlePoints[i].position.y, 0), circlePoints[i].weight, normal)) 
          points.push(circlePoints[nextI])  
        }

       return points
    }

    public GetCircleIdexesForRenderModeLines(indexesOld : number [])
    {
      let indexes = indexesOld.reduce((reducer : number [], item : number, index: number) => {
       
        if((index + 1) % 3 !== 0)
        {
           reducer.push(item,item)
           return reducer
        } 
          
        if(index === indexesOld.length)
        {
          reducer.push(item, indexesOld[0])
          return reducer
        }
        
        reducer.push(item, item, indexesOld[(index + 1) - 3]);
        return reducer
      },[])

      let firstItem : number | undefined = indexes.shift()
      
      if(firstItem != null)
      {
        indexes.push(firstItem)
      }

      return indexes
    }

    public GetRenderAssets(renderMode : GLenum = glContext.TRIANGLES) 
    {  
      const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
        
      let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColor, this._positions.length / 3)
      
      const indexes = Array.from(Array(this._positions.length).keys())
      const count = indexes.length

      const inputIndexes= renderMode === glContext.LINES ? this.GetCircleIdexesForRenderModeLines(indexes) :  indexes

      return {
        shaderProgram: this._shaderProgram,
        attributes:{
          position: new DefaultBuffer(this._positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(inputIndexes).buffer,
          normals: new DefaultBuffer(this._normals).buffer,
          weights: new DefaultBuffer(this._weights).buffer
        },
        uniforms: {
          IdentityBone: this.IdentityBone,
          RotateBone: this.RotateBone
        },
        assetSetter: this.assetSetter,
        modelMatrix: this.modelMatrix,
        countVertex: count,
        renderMode: renderMode,
        type: ObjectsEnum.Cylinder,
      };
    }

    public GetRenderLineOfNormalsAssets()
    {
      const lengthLine = 0.1
      const vectorDimention = 3

      let positions : number [] = []

      for(let i = 0; i < this._positions.length / vectorDimention; i++)
      {
        const startPositionOfLine = [
          this._positions[ i * 3 ], 
          this._positions[ i * 3 + 1 ], 
          this._positions[ i * 3 + 2 ]
        ]

        const endPositionOfLine = m3.additionVectors(startPositionOfLine, 
                                    m3.multiplyScalarOnVector(
                                      lengthLine,
                                      [
                                        this._normals[ i * 3 ], 
                                        this._normals[ i * 3 + 1 ], 
                                        this._normals[ i * 3 + 2 ]
                                      ]
                                    )
        )
        
        positions.push(...startPositionOfLine, ...endPositionOfLine)
      }

      const faceColors = [0.0,  1.0,  1.0, 1.0] 

      const colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColors, positions.length / vectorDimention )
      
      const indexes = Array.from(Array(positions.length).keys())
      
      const count = indexes.length

      const shaderProgram = new ShaderProgram(VERTEX_SHADER_SOURCE_LINE_NORMAL,FRAGMENT_SHADER_NOLIGHT_SOURCE) 
      const assetSetter = new CommonAttribureAndUniformSetter(shaderProgram.program)

      return {
        shaderProgram,
        assetSetter,
        modelMatrix: this.modelMatrix,
        attributes:{
          position: new DefaultBuffer(positions).buffer,
          color: new DefaultBuffer(colors).buffer,
          indices: new IndexBuffer(indexes).buffer,
        },
        type: ObjectsEnum.Common,
        countVertex: count,
        renderMode: glContext.LINES
      };
    }

    public Animate(time : number)
    {
      const speedOfAnimation = 10
      let alpha = Math.sin(degToRad(time / speedOfAnimation))
      this.RotateBone = m3.zRotation(alpha)
    }
}