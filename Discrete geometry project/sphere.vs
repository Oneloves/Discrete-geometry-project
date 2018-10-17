attribute vec3 vPosSphere;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosSphere, 1.0);
}
