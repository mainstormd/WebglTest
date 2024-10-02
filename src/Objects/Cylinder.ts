import { ColorBuffer } from "../GLBuffers/ColorBuffer";
import { IndexBuffer } from "../GLBuffers/IndexBuffer";
import { PositionBuffer } from "../GLBuffers/PositionBuffer";
import { WeightsBuffer } from "../GLBuffers/WeightsBuffer";
import { ShaderProgram } from "../GLShaders/ShaderProgram";
import { VERTEX_SHADER_SOURCE_CYLINDER } from "../GLShaders/ShaderSources";
import { degToRad, m3 } from "../Math/math";
import { ColorBufferHelper } from "../Utils/ColorBufferHelper";
import { glContext } from "../Utils/GLUtilities";
import { ObjectsEnum } from "./ObjectEnum";

class vec3{
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

class PositionWeight
{
    public position : vec3 
    public weight : number
    
    constructor(position : vec3, weight : number)
    {
      this.position = position
      this.weight = weight
    }
}

export class Cylinder{

    private modelMatrix : number[] | null = m3.IdentityMatrix() 
    private IdentityBone : number[] | null = m3.IdentityMatrix() 
    private RotateBone : number[] | null = m3.yRotation(0) 

    public GetCirclePositionWeight( radius: number, height: number) : PositionWeight []
    {
        let points : PositionWeight[] = []
        const delta = 5

        for(let angle = 0; angle <= 360; angle += delta)
        {
            let angleInRadians = degToRad(angle)
            let cos = Math.cos(angleInRadians);
            let sin = Math.sin(angleInRadians);
            points.push(new PositionWeight(new vec3(radius * cos, height, radius * sin), height))
        }
        
        return points
    }

    public GetReactanglesPositionsWeights(circlePositionsWeightsA : PositionWeight [], circlePositionsWeightsB : PositionWeight[]) : PositionWeight []
    {
      let rectanglesPostionsWeights : PositionWeight[] = []

      for( let i = 0; i < circlePositionsWeightsA.length; i++ )
      {
        const nextI = i + 1 < circlePositionsWeightsA.length ? i + 1 : 0

        // first triangle
        rectanglesPostionsWeights.push(circlePositionsWeightsA[i])
        rectanglesPostionsWeights.push(circlePositionsWeightsA[nextI])
        rectanglesPostionsWeights.push(circlePositionsWeightsB[i])

        // second triangle
        rectanglesPostionsWeights.push(circlePositionsWeightsA[nextI])
        rectanglesPostionsWeights.push(circlePositionsWeightsB[nextI])
        rectanglesPostionsWeights.push(circlePositionsWeightsB[i])
      }

      return rectanglesPostionsWeights
    }

    public GetDiscPositionsWeights(circlePositionsWeights : PositionWeight[]) : PositionWeight []
    {
       let positionsWeights : PositionWeight[] = []

       for( let i = 0; i < circlePositionsWeights.length; i++ )
       {
          const nextI = i + 1 < circlePositionsWeights.length ? i + 1 : 0

          positionsWeights.push(circlePositionsWeights[i])
          positionsWeights.push(new PositionWeight(new vec3(0, circlePositionsWeights[i].position.y, 0), circlePositionsWeights[i].weight)) 
          positionsWeights.push(circlePositionsWeights[nextI])  
        }

       return positionsWeights
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
          reducer.push(item,indexesOld[0])
          return reducer
        }
        
        reducer.push(item,item,indexesOld[(index + 1) - 3]);
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
      const radius = 1
      const delta = 1/6
      const vicinity = 0.00001
      
      let positionsWeights : PositionWeight[] = [] 
      
      for( let weight = delta; weight <= 1 ; weight += delta) 
      {
        if(1 - weight <= vicinity)
        {
          positionsWeights = positionsWeights.concat(this.GetDiscPositionsWeights(this.GetCirclePositionWeight(radius, weight)))
        }

        if(weight - delta <= vicinity)
        {
          positionsWeights = positionsWeights.concat(this.GetDiscPositionsWeights(this.GetCirclePositionWeight(radius, weight - delta)))
        }

        positionsWeights = positionsWeights.concat(this.GetReactanglesPositionsWeights(this.GetCirclePositionWeight(radius, weight - delta), this.GetCirclePositionWeight(radius, weight) )) 
      }

      let positions : number [] = []
      let weights : number [] = []

      positionsWeights.forEach( positionWeight => {
        
        positions.push(positionWeight.position.x)
        positions.push(positionWeight.position.y)
        positions.push(positionWeight.position.z)
        
        weights.push(positionWeight.weight)
      })

      const faceColor = [0.0,  1.0,  0.0,  1.0] //green        
      
      let colors : number[] = ColorBufferHelper.GenerateDuplicateColorByVertexCount(faceColor, positions.length / 3)
      
      const indexes = Array.from(Array(positions.length).keys())
      const count = indexes.length

      const inputIndexes= renderMode === glContext.LINES ? this.GetCircleIdexesForRenderModeLines(indexes) :  indexes

      return {
        shaderProgram: new ShaderProgram(VERTEX_SHADER_SOURCE_CYLINDER),
        attributes:{
          position: new PositionBuffer(positions).buffer,
          color: new ColorBuffer(colors).buffer,
          indices: new IndexBuffer(inputIndexes).buffer,
          weights: new WeightsBuffer(weights).buffer
        },
        bones: {
          IdentityBone: this.IdentityBone,
          RotateBone: this.RotateBone
        },
        modelMatrix: this.modelMatrix,
        countVertex: count,
        renderMode: renderMode,
        type: ObjectsEnum.Cylinder,
      };
    }

    public Animate(time : number)
    {
      const speedOfAnimation = 5 
      let alpha = Math.sin(degToRad(time / speedOfAnimation))
      this.RotateBone = m3.zRotation(alpha)
    }
}