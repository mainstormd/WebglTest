import { expect, test } from "@jest/globals";
import { Camera } from "../src/Camera";
import { m3 } from "../src/Math/math";


test('Test eye of matrix', () => {
    let camera = new Camera()
    let matrix = camera.matrix
    let position = camera.position
    expect(m3.MultiplyMatrixAndVectors( matrix, [...position, 1])).toEqual([0,0,0,1]);
});