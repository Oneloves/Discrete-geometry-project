attribute vec3 vPosSphere;
uniform float transX;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

mat4 translate(float x, float y, float z){
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(x,   y,   z,   1.0)
    );
}

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * (translate(transX, 0.0, 0.0) * vec4(vPosSphere, 1.0));
}
