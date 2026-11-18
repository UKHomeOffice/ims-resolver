jest.mock('strong-soap', () => ({
  soap: {
    createClient: jest.fn(),
    BasicAuthSecurity: jest.fn()
  }
}));

jest.mock('../../config', () => ({
  verint: {
    wsdl: 'http://test-wsdl',
    endpoint: 'http://test-endpoint',
    apiUser: 'testUser',
    apiPassword: 'testPass',
    formName: 'public-allegation',
    attachmentField: 'supporting-files'
  }
}));

jest.mock('../../lib/file-vault-utils', () => ({
  auth: jest.fn(),
  getFile: jest.fn()
}));

const { soap } = require('strong-soap');
const fv = require('../../lib/file-vault-utils');
const { createPublicAllegationsCase } = require('../../models/verint-model');

const client = {
  setEndpoint: jest.fn(),
  setSecurity: jest.fn(),
  Create: jest.fn(),
  AttachFile: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
  soap.createClient.mockImplementation((wsdl, options, callback) => callback(null, client));
  client.Create.mockImplementation((request, callback) => callback(null, {
    status: 'success',
    ref: 'FORM-001'
  }));
  client.AttachFile.mockImplementation((request, callback) => callback(null, { status: 'success' }));
  fv.auth.mockResolvedValue({ bearer: 'test-token' });
  fv.getFile.mockImplementation(async url => Buffer.from(`content for ${url}`));
});

describe('Verint submission model', () => {
  it('should create a populated form', async () => {
    await createPublicAllegationsCase({
      EformFields: [{ FieldName: 'rdcrimetype', FieldValue: 'Immigration Crime' }],
      Attachments: []
    });

    const createRequest = client.Create.mock.calls[0][0];
    expect(createRequest).toMatchObject({ name: 'public-allegation' });
    expect(createRequest.caseid).toBeUndefined();
    expect(client.Create).toHaveBeenCalledTimes(1);
    expect(client.AttachFile).not.toHaveBeenCalled();
    expect(fv.auth).not.toHaveBeenCalled();

    const fields = createRequest.data['form-data'].field;
    expect(fields).toEqual(expect.arrayContaining([
      { name: 'rdcrimetype', value: 'Immigration Crime' },
      { name: 'dtBORec', value: expect.any(String) },
      { name: 'tmBORec', value: expect.any(String) }
    ]));
  });

  it('should attach files to a form', async () => {
    await createPublicAllegationsCase({
      EformFields: [],
      Attachments: [
        { name: 'one.pdf', mimetype: 'application/pdf', url: 'https://files/one' },
        { name: 'two.txt', mimetype: 'text/plain', url: 'https://files/two' }
      ]
    });

    expect(fv.getFile.mock.calls.map(([url]) => url)).toEqual([
      'https://files/one',
      'https://files/two'
    ]);
    expect(client.AttachFile.mock.calls.map(([request]) => request)).toEqual([
      {
        ref: 'FORM-001',
        filename: 'one.pdf',
        file: Buffer.from('content for https://files/one').toString('base64'),
        mimetype: 'application/pdf',
        field: 'supporting-files'
      },
      {
        ref: 'FORM-001',
        filename: 'two.txt',
        file: Buffer.from('content for https://files/two').toString('base64'),
        mimetype: 'text/plain',
        field: 'supporting-files'
      }
    ]);
  });

  it('rejects unsuccessful Create responses', async () => {
    client.Create.mockImplementationOnce((request, callback) => callback(null, {
      status: 'failure',
      ref: null
    }));

    await expect(createPublicAllegationsCase({ EformFields: [], Attachments: [] }))
      .rejects.toThrow('Failed to create Verint form');
  });

  it('rejects AttachFile errors', async () => {
    client.AttachFile.mockImplementationOnce((request, callback) => callback(new Error('Attach file error')));

    await expect(createPublicAllegationsCase({
      EformFields: [],
      Attachments: [{ name: 'one.pdf', mimetype: 'application/pdf', url: 'https://files/one' }]
    })).rejects.toThrow('Attach file error');
  });

  it('rejects unsuccessful AttachFile responses', async () => {
    client.AttachFile.mockImplementationOnce((request, callback) => callback(null, { status: 'failure' }));

    await expect(createPublicAllegationsCase({
      EformFields: [],
      Attachments: [{ name: 'one.pdf', mimetype: 'application/pdf', url: 'https://files/one' }]
    })).rejects.toThrow('Failed to attach file to form');
  });
});
