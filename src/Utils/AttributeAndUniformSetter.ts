import { glContext } from "./GLUtilities";

export default class AttributeAndUniformSetter
{
    static SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram) : void
    {
        let matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
         // Set the matrix.
        glContext.uniformMatrix4fv(matrixLocation, false, resultMatrix);

        const { position, color, indices, normals } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, normals);

        let normalAttributeLocation = glContext.getAttribLocation(shaderProgram, "normal");
            glContext.vertexAttribPointer(normalAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(normalAttributeLocation);

        this.SetCommonAttributes(position, color, indices, shaderProgram)
    }

    static SetSphereAttrAndUniforms(attributes, uniforms, resultMatrix,  shaderProgram) : void
    {
        const { radius, interpolationCoeff } = uniforms
        this.SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram)

        let radiusUniform = glContext.getUniformLocation(shaderProgram, "radius");
        glContext.uniform1f(radiusUniform, radius)

        let interpolationCoeffUniform = glContext.getUniformLocation(shaderProgram, "interpolationCoeff");
        glContext.uniform1f(interpolationCoeffUniform, interpolationCoeff)
    }

    static SetCylinderAttrAndUniforms(attributes, uniforms, resultMatrix, shaderProgram) : void
    {
        this.SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram)
        
        const { weights } = attributes 
        
        //order important, first use bind, second enable attr pointer 
        glContext.bindBuffer(glContext.ARRAY_BUFFER, weights);

        let weightAttributeLocation = glContext.getAttribLocation(shaderProgram, "weight");
            glContext.vertexAttribPointer(weightAttributeLocation, 1, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(weightAttributeLocation);

        const { IdentityBone, RotateBone } = uniforms
        //  uniform mat4 IdentityBone;
        //  uniform mat4 RotateBone;    
        let matrixIdentityBone = glContext.getUniformLocation(shaderProgram, "IdentityBone");
        // Set the matrix.
        glContext.uniformMatrix4fv(matrixIdentityBone, false, IdentityBone);

        let matrixRotateBone = glContext.getUniformLocation(shaderProgram, "RotateBone");
        // Set the matrix.
        glContext.uniformMatrix4fv(matrixRotateBone, false, RotateBone);
       
    }

    static SetCommonAttributes(position, color, indices, shaderProgram) : void
    {
        //order important, first use bind, second enable attr pointer 
        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);

        let positionAttributeLocation = glContext.getAttribLocation(shaderProgram, "position");
            glContext.vertexAttribPointer(positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(positionAttributeLocation);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, color);

        let vertexColorAttribute = glContext.getAttribLocation(shaderProgram, "color");
            glContext.vertexAttribPointer(vertexColorAttribute, 4, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(vertexColorAttribute);
               
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)  
    }
}