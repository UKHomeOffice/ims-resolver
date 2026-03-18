jest.mock('sqs-consumer', () => ({
  Consumer: { create: jest.fn(() => ({ on: jest.fn(), start: jest.fn() })) }
}));
jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn()
}));
jest.mock('strong-soap', () => ({
  soap: {}
}));
jest.mock('../models/ims-model');

const { handleMessage } = require('../ims-resolver');
const { createPublicAllegationsCase } = require('../models/ims-model');

describe('imsResolver.handleMessage', () => {
  it('should call createPublicAllegationsCase with parsed message body', async () => {
    const message = { Body: JSON.stringify({ key: 'value' }) };
    createPublicAllegationsCase.mockResolvedValue();

    await handleMessage(message);

    expect(createPublicAllegationsCase).toHaveBeenCalledWith({ key: 'value' });
  });

  it('should throw when createPublicAllegationsCase fails', async () => {
    const message = { Body: JSON.stringify({ key: 'value' }) };
    createPublicAllegationsCase.mockRejectedValue(new Error('IMS error'));

    await expect(handleMessage(message)).rejects.toThrow('IMS error');
  });
});
