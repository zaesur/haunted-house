uniform float uSize;
uniform float uTime;

attribute vec3 velocity;

void main()
{
    vec3 newPosition = position;

    newPosition.x = mod(newPosition.x + (uTime * velocity.x), 15.0) - 7.5;
    newPosition.y = mod(newPosition.y + (uTime * velocity.y), 5.0);
    newPosition.z = mod(newPosition.z + (uTime * velocity.z), 15.0) - 7.5;

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);

    gl_PointSize = uSize / length(mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
}