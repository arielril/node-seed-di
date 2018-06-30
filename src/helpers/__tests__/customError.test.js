const { customError } = require('../customError');

describe('Test case for custom error', () => {
  it('Should create a beautiful error (1 level error)', () => {
    const error = customError('2084411925', 'Error message');

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Error message');
    expect(error.code).toBe('2084411925');

    expect(error.message).not.toBe('Some other error message');
    expect(error.code).not.toBe('1347108063');
  });

  it('Should create a beatiful error (2 level error)', () => {
    const err1 = customError('1023122189', 'Error level 1');
    const err2 = customError('4070052414', err1);

    expect(err2).toBeDefined();
    expect(err2).toBeInstanceOf(Error);
    expect(err2.message).toBe(err1.message);
    expect(err2.message).toBe('Error level 1');
    expect(err2.code.includes('1023122189')).toBeTruthy();
    expect(err2.code.includes('4070052414')).toBeTruthy();
    expect(err2.code).toBe('1023122189.4070052414');
  });

  it('Should create a beatiful error (3 level error)', () => {
    const err1 = customError('1023122189', 'Error level 1');
    const err2 = customError('4070052414', err1);
    const err3 = customError('408893196', err2);

    expect(err2).toBeDefined();
    expect(err2).toBeInstanceOf(Error);
    expect(err2.message).toBe(err1.message);
    expect(err2.message).toBe('Error level 1');
    expect(err2.code.includes('1023122189')).toBeTruthy();
    expect(err2.code.includes('4070052414')).toBeTruthy();
    expect(err2.code.includes('1023122189.4070052414')).toBeTruthy();
    expect(err3.code).toBe('1023122189.4070052414.408893196');
  });
});
