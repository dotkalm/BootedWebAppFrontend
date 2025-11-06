export function createMockGL() {
  const glMock = {
    createShader: jest.fn(() => ({})),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(() => true),
    getShaderInfoLog: jest.fn(() => ''),
    createProgram: jest.fn(() => ({})),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    getProgramInfoLog: jest.fn(() => ''),
    useProgram: jest.fn(),
    getExtension: jest.fn(),
    // add anything else you use later
  };
  return glMock;
}