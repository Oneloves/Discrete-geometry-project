attribute vec3 vPosBSurface;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosBSurface, 1.0);
}
