attribute vec3 vPos;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec3 lumPos;

mat4 translate(float x, float y, float z){
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(x,   y,   z,   1.0)
    );
}

void main(void) {
	
	vec4 vPosTrandform = translate(lumPos.x, lumPos.y, lumPos.z) * vec4(vPos, 1.0);
	gl_PointSize = 10.0;
	gl_Position = uPMatrix * uMVMatrix * vPosTrandform;

}
