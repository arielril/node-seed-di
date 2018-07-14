const moment = require('moment-timezone');

const { toUnixEpoch } = require('../datetime');

describe('Test of datetime helper', () => {
  it('Should NOT transform null to unix epoch', () => {
    expect(toUnixEpoch(null)).toBe(null);
    expect(toUnixEpoch('')).toBe(null);

    const now = moment.utc();
    expect(toUnixEpoch(now.toDate())).toBe(now.valueOf());
  });
});
