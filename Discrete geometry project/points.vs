attribute vec3 vPos;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_PointSize = 10.0;
	gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
}
