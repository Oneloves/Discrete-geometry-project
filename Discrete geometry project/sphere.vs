
attribute vec3 vPosSphere;
attribute vec3 vNormal;

uniform float transX;
uniform vec3 lumPos;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 dirLum;
varying vec3 norm;

mat4 translate(float x, float y, float z){
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(x,   y,   z,   1.0)
    );
}

void main(void) {
	norm = vNormal;
	dirLum = normalize(lumPos-vPosSphere);
	gl_Position = uPMatrix * uMVMatrix * (translate(transX, 0.0, 0.0) * vec4(vPosSphere, 1.0));
}
