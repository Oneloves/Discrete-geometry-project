attribute vec3 vPosCone;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;


void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosCone, 1.0);
}
