jest.mock('strong-soap', () => ({
  soap: {
    createClient: jest.fn(),
    BasicAuthSecurity: jest.fn()
  }
}));
jest.mock('../../config', () => ({
  ims: {
    wsdl: 'http://test-wsdl',
    apiUser: 'testUser',
    apiPassword: 'testPass',
    PublicAllegationsEventCode: 4000041,
    title: 'Incomplete Allegation',
    description: 'Allegation from Horizon',
    queue: 'Allegations Kainos',
    eformDefinitions: 'Allegations READ ONLY, Allegations EDITABLE',
    eforms: 'allegationsTablet, allegationsHorizon',
    eformName: 'testEform',
    endpoint: 'http://test-endpoint'
  },
  aws: { sqs: {} },
  keycloak: {}
}));
jest.mock('../../lib/file-vault-utils');

const soap = require('strong-soap').soap;
const fv = require('../../lib/file-vault-utils');
const { createPublicAllegationsCase } = require('../../models/ims-model');

const mockClient = {
  setEndpoint: jest.fn(),
  setSecurity: jest.fn(),
  createCase: jest.fn(),
  addCaseEform: jest.fn(),
  writeCaseEformData: jest.fn(),
  createExtensionObject: jest.fn(),
  addDocumentToRepository: jest.fn(),
  createNotes: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
  soap.createClient.mockImplementation((url, opts, cb) => cb(null, mockClient));
  mockClient.createCase.mockImplementation((data, cb) => cb(null, 'CASE-001'));
  mockClient.addCaseEform.mockImplementation((data, cb) => cb(null, 'eform-ok'));
  mockClient.writeCaseEformData.mockImplementation((data, cb) => cb(null, 'write-ok'));
  mockClient.createExtensionObject.mockImplementation((data, cb) => cb(null, 'ext-ok'));
  mockClient.addDocumentToRepository.mockImplementation((data, cb) => cb(null, 'doc-ref-001'));
  mockClient.createNotes.mockImplementation((data, cb) => cb(null, 'note-ok'));
});

describe('createPublicAllegationsCase', () => {
  const baseMsg = {
    EformFields: [{ FieldName: 'test', FieldValue: 'value' }],
    AdditionalPeople: [],
    Attachments: []
  };

  it('should create a SOAP client', async () => {
    await createPublicAllegationsCase(baseMsg);

    expect(soap.createClient).toHaveBeenCalledTimes(1);
    expect(mockClient.setEndpoint).toHaveBeenCalledWith('http://test-endpoint');
  });

  it('should create a case', async () => {
    await createPublicAllegationsCase(baseMsg);

    expect(mockClient.createCase).toHaveBeenCalledTimes(1);
  });

  it('should add eforms and write form data for each eform definition', async () => {
    await createPublicAllegationsCase(baseMsg);

    expect(mockClient.addCaseEform).toHaveBeenCalledTimes(2);
    expect(mockClient.writeCaseEformData).toHaveBeenCalledTimes(2);
  });

  it('should handle additional people', async () => {
    const msg = {
      ...baseMsg,
      AdditionalPeople: [
        [{ Key: 'Name', StringValue: 'John' }]
      ]
    };

    await createPublicAllegationsCase(msg);

    expect(mockClient.createExtensionObject).toHaveBeenCalledTimes(1);
  });

  it('should not process attachments when there are none', async () => {
    await createPublicAllegationsCase(baseMsg);

    expect(fv.auth).not.toHaveBeenCalled();
    expect(mockClient.addDocumentToRepository).not.toHaveBeenCalled();
  });

  it('should process attachments and create notes', async () => {
    fv.auth.mockResolvedValue({ bearer: 'test-token' });
    fv.getFile.mockResolvedValue(Buffer.from('file-content'));

    const msg = {
      ...baseMsg,
      Attachments: [
        { name: 'doc1.pdf', url: 'http://file-vault/doc1' }
      ]
    };

    await createPublicAllegationsCase(msg);

    expect(fv.auth).toHaveBeenCalledTimes(1);
    expect(fv.getFile).toHaveBeenCalledWith('http://file-vault/doc1', { bearer: 'test-token' });
    expect(mockClient.addDocumentToRepository).toHaveBeenCalledTimes(1);
    expect(mockClient.createNotes).toHaveBeenCalledTimes(1);
  });

  it('should throw when SOAP client creation fails', async () => {
    soap.createClient.mockImplementation((url, opts, cb) => cb(new Error('SOAP error')));

    await expect(createPublicAllegationsCase(baseMsg)).rejects.toThrow('SOAP error');
  });

  it('should throw when case creation fails', async () => {
    mockClient.createCase.mockImplementation((data, cb) => cb(new Error('Case error')));

    await expect(createPublicAllegationsCase(baseMsg)).rejects.toThrow('Case error');
  });

  it('should throw when file retrieval fails', async () => {
    fv.auth.mockResolvedValue({ bearer: 'test-token' });
    fv.getFile.mockRejectedValue(new Error('file vault error'));

    const msg = {
      ...baseMsg,
      Attachments: [{ name: 'doc1.pdf', url: 'http://file-vault/doc1' }]
    };

    await expect(createPublicAllegationsCase(msg)).rejects.toThrow(
      "Failed to retrieve document 'doc1.pdf' from file vault: file vault error"
    );
  });
});
