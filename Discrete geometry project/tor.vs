attribute vec3 vPosTor;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosTor, 1.0);
}
