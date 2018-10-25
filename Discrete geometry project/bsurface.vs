attribute vec3 vPosBSurface;
attribute vec3 vNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 dirLum;
varying vec3 norm;

void main(void) {
	norm = vNormal;
	dirLum = normalize(vec3(0.0, 0.0, 1.0)-vPosBSurface);
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosBSurface, 1.0);
}
