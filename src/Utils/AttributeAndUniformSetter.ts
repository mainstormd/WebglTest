import { Camera } from "../Camera";
import { glContext } from "./GLUtilities";

export default class AttributeAndUniformSetter
{
    static SetCommonAttrAndUniforms(attributes, ModelViewProjectionMatrix, ModelMatrix, camera : Camera, shaderProgram) : void
    {
        let matrixLocation = glContext.getUniformLocation(shaderProgram, "ModelViewProjection");
        glContext.uniformMatrix4fv(matrixLocation, false, ModelViewProjectionMatrix);

        let modelMatrixLocation = glContext.getUniformLocation(shaderProgram, "ModelMatrix");
        glContext.uniformMatrix4fv(modelMatrixLocation, false, ModelMatrix);

        let cameraPosition = glContext.getUniformLocation(shaderProgram, "cameraPosition");
        glContext.uniform3fv(cameraPosition, camera.position);

        const { position, color, indices, normals } = attributes

        glContext.bindBuffer(glContext.ARRAY_BUFFER, normals);

        let normalAttributeLocation = glContext.getAttribLocation(shaderProgram, "normal");
            glContext.vertexAttribPointer(normalAttributeLocation, 3, glContext.FLOAT, false, 0, 0);
            glContext.enableVertexAttribArray(normalAttributeLocation);

        this.SetCommonAttributes(position, color, indices, shaderProgram)
    }

    static SetSphereAttrAndUniforms(attributes, uniforms, ModelViewProjectionMatrix, ModelMatrix, camera : Camera, shaderProgram) : void
    {
        const { radius, interpolationCoeff } = uniforms
        this.SetCommonAttrAndUniforms(attributes, ModelViewProjectionMatrix, ModelMatrix, camera, shaderProgram)

        let radiusUniform = glContext.getUniformLocation(shaderProgram, "radius");
        glContext.uniform1f(radiusUniform, radius)

        let interpolationCoeffUniform = glContext.getUniformLocation(shaderProgram, "interpolationCoeff");
        glContext.uniform1f(interpolationCoeffUniform, interpolationCoeff)
    }

    static SetCylinderAttrAndUniforms(attributes, uniforms, ModelViewProjectionMatrix, ModelMatrix, camera : Camera, shaderProgram) : void
    { 
        this.SetCommonAttrAndUniforms(attributes, ModelViewProjectionMatrix, ModelMatrix, camera, shaderProgram)
        
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

    static SetEffectsUnifoms(effects, shaderProgram): void
    {
        if(effects.fog)
        {
            this.SetFogUniforms(effects.fog.uniforms, shaderProgram)
        }
        
        if(effects.directionalLight)
        {
            this.SetDirectionalLightUniforms(effects.directionalLight.uniforms, shaderProgram)
        }

        if(effects.spotLight)
        {
            this.SetSpotLightUniforms(effects.spotLight.uniforms, shaderProgram)
        }

        if(effects.pointLigts && effects.pointLigts.length !== 0)
        {
            let countPointLightsUniform = glContext.getUniformLocation(shaderProgram, "countPointLights");
            glContext.uniform1i(countPointLightsUniform, effects.pointLigts.length);   

            effects.pointLigts.forEach(
                (pointLigt, index) => {
                    this.SetPointLightUniforms(pointLigt.uniforms, index, shaderProgram);
                }
            );
        }
    }

    static SetPointLightUniforms(uniforms, pointNumberInArray, shaderProgram) : void
    { 
        const { 
            position, 
            color, 
            ambientStrength, 
            diffuseStrength, 
            specularStrength, 
            constant, 
            linear, 
            quadratic
        } = uniforms
         
        let positionUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].position`);
        glContext.uniform3fv(positionUniform, position);

        let colorUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].color`);
        glContext.uniform3fv(colorUniform, color);

        let ambientStrengthUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].ambientStrength`);
        glContext.uniform1f(ambientStrengthUniform, ambientStrength);

        let diffuseStrengthUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].diffuseStrength`);
        glContext.uniform1f(diffuseStrengthUniform, diffuseStrength);
        
        let specularStrengthUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].specularStrength`);
        glContext.uniform1f(specularStrengthUniform, specularStrength);

        let constantUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].constant`);
        glContext.uniform1f(constantUniform, constant);

        let linearUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].linear`);
        glContext.uniform1f(linearUniform, linear);

        let quadraticUniform = glContext.getUniformLocation(shaderProgram, `pointLights[${pointNumberInArray}].quadratic`);
        glContext.uniform1f(quadraticUniform, quadratic); 
    }

    static SetDirectionalLightUniforms(uniforms, shaderProgram) : void
    { 
        const { 
            direction, 
            color, 
            ambientStrength, 
            diffuseStrength, 
            specularStrength, 
        } = uniforms
         
        let positionUniform = glContext.getUniformLocation(shaderProgram, `directionalLight.direction`);
        glContext.uniform3fv(positionUniform, direction);

        let colorUniform = glContext.getUniformLocation(shaderProgram, `directionalLight.color`);
        glContext.uniform3fv(colorUniform, color);

        let ambientStrengthUniform = glContext.getUniformLocation(shaderProgram, `directionalLight.ambientStrength`);
        glContext.uniform1f(ambientStrengthUniform, ambientStrength);

        let diffuseStrengthUniform = glContext.getUniformLocation(shaderProgram, `directionalLight.diffuseStrength`);
        glContext.uniform1f(diffuseStrengthUniform, diffuseStrength);
        
        let specularStrengthUniform = glContext.getUniformLocation(shaderProgram, `directionalLight.specularStrength`);
        glContext.uniform1f(specularStrengthUniform, specularStrength);
    }

    static SetSpotLightUniforms(uniforms, shaderProgram) : void
    { 
        const { 
            color,
            position, 
            direction,
            ambientStrength, 
            diffuseStrength, 
            specularStrength, 
            constant, 
            linear, 
            quadratic,
            cosOfCutoff, 
            cosOfOuterCutoff
        } = uniforms
         
        let colorUniform = glContext.getUniformLocation(shaderProgram, `spotLight.color`);
        glContext.uniform3fv(colorUniform, color);

        let positionUniform = glContext.getUniformLocation(shaderProgram, `spotLight.position`);
        glContext.uniform3fv(positionUniform, position);

        let directionUniform = glContext.getUniformLocation(shaderProgram, `spotLight.direction`);
        glContext.uniform3fv(directionUniform, direction);

        let ambientStrengthUniform = glContext.getUniformLocation(shaderProgram, `spotLight.ambientStrength`);
        glContext.uniform1f(ambientStrengthUniform, ambientStrength);

        let diffuseStrengthUniform = glContext.getUniformLocation(shaderProgram, `spotLight.diffuseStrength`);
        glContext.uniform1f(diffuseStrengthUniform, diffuseStrength);
        
        let specularStrengthUniform = glContext.getUniformLocation(shaderProgram, `spotLight.specularStrength`);
        glContext.uniform1f(specularStrengthUniform, specularStrength);

        let constantUniform = glContext.getUniformLocation(shaderProgram, `spotLight.constant`);
        glContext.uniform1f(constantUniform, constant);

        let linearUniform = glContext.getUniformLocation(shaderProgram, `spotLight.linear`);
        glContext.uniform1f(linearUniform, linear);

        let quadraticUniform = glContext.getUniformLocation(shaderProgram, `spotLight.quadratic`);
        glContext.uniform1f(quadraticUniform, quadratic); 

        let cosOfCutoffUniform = glContext.getUniformLocation(shaderProgram, `spotLight.cosOfCutoff`);
        glContext.uniform1f(cosOfCutoffUniform, cosOfCutoff); 

        let cosOfOuterCutoffUniform = glContext.getUniformLocation(shaderProgram, `spotLight.cosOfOuterCutoff`);
        glContext.uniform1f(cosOfOuterCutoffUniform, cosOfOuterCutoff); 
    }

    static SetFogUniforms(uniforms, shaderProgram) : void
    {    
        const { 
            color,
            start, 
            end,
            density, 
            mode, 
            isEnabled, 
        } = uniforms
         
        let colorUniform = glContext.getUniformLocation(shaderProgram, `fog.color`);
        glContext.uniform3fv(colorUniform, color);

        let startUniform = glContext.getUniformLocation(shaderProgram, `fog.start`);
        glContext.uniform1f(startUniform, start);

        let endUniform = glContext.getUniformLocation(shaderProgram, `fog.end`);
        glContext.uniform1f(endUniform, end);
        
        let densityUniform = glContext.getUniformLocation(shaderProgram, `fog.density`);
        glContext.uniform1f(densityUniform, density);

        let modeUniform = glContext.getUniformLocation(shaderProgram, `fog.mode`);
        glContext.uniform1i(modeUniform, mode);

        let isEnabledUniform = glContext.getUniformLocation(shaderProgram, "fog.isEnabled");
        glContext.uniform1i(isEnabledUniform, isEnabled);
    }
}