import { glContext } from "./GLUtilities";

export default class AttributeAndUniformSetter
{
    static SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram) : void
    {
        let matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
         // Set the matrix.
        glContext.uniformMatrix4fv(matrixLocation, false, resultMatrix);

        const { position, color, indices } = attributes

        this.SetCommonAttributes(position, color, indices, shaderProgram)
    }

    static SetSphereAttrAndUniforms(time, attributes, resultMatrix, shaderProgram) : void
    {
        this.SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram)

        let timeUniform = glContext.getUniformLocation(shaderProgram, "time");
        //set objectType time
        glContext.uniform1f(timeUniform, time)
    }

    static SetCylinderAttrAndUniforms(attributes, resultMatrix, shaderProgram) : void
    {
        this.SetCommonAttrAndUniforms(attributes, resultMatrix, shaderProgram)
    }

    static SetCommonAttributes(position, color, indices, shaderProgram) : void
    {
        //order important, first use bind, second enable attr pointer 
        glContext.bindBuffer(glContext.ARRAY_BUFFER, position);

        let positionAttributeLocation = glContext.getAttribLocation(shaderProgram, "a_Position");
            glContext.vertexAttribPointer(positionAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(positionAttributeLocation);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, color);

        let vertexColorAttribute = glContext.getAttribLocation(shaderProgram, "u_color");
            glContext.vertexAttribPointer(vertexColorAttribute, 4, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(vertexColorAttribute);
               
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indices)  
    }
}