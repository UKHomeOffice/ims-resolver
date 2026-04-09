const { Consumer } = require('sqs-consumer');
const { createPublicAllegationsCase } = require('./models/ims-model');
const config = require('./config');
const { SQSClient } = require('@aws-sdk/client-sqs');
const logger = require('./lib/logger');

const imsResolver = {
  start: function () {
    const consumer = Consumer.create({
      queueUrl: config.aws.sqs.queueUrl,
      sqs: new SQSClient({
        region: config.aws.sqs.region,
        credentials: {
          accessKeyId: config.aws.sqs.accessKeyId,
          secretAccessKey: config.aws.sqs.secretAccessKey
        }
      }),
      attributeNames: ['All', 'ApproximateFirstReceiveTimestamp', 'ApproximateReceiveCount'],
      handleMessage: imsResolver.handleMessage
    });

    consumer.on('error', err => {
      logger.error({ err }, 'Consumer error');
    });

    consumer.on('processing_error', err => {
      logger.error({ err }, 'Processing error');
    });

    consumer.start();
    logger.info(`Resolver is listening for messages from: ${config.aws.sqs.queueUrl}`);
  },

  handleMessage: async message => {
    const messageBody = JSON.parse(message.Body);

    try {
      await createPublicAllegationsCase(messageBody);
      return message;
    } catch (err) {
      logger.error({ err }, 'Failed to process message');
      throw err;
    }
  }
};

module.exports = imsResolver;
