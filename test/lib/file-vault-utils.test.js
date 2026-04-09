jest.mock('axios');

describe('auth', () => {
  it('should throw if tokenUrl is not defined', async () => {
    jest.resetModules();
    jest.mock('../../config', () => ({ keycloak: { tokenUrl: undefined } }));
    const { auth } = require('../../lib/file-vault-utils');

    await expect(auth()).rejects.toThrow('tokenUrlUndefined');
  });
});
