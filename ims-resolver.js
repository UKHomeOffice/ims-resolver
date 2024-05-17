const { Consumer } = require('sqs-consumer');
const { createPublicAllegationsCase } = require('./models/ims-model');
const config = require('./config');
const { SQSClient } = require('@aws-sdk/client-sqs');
const logger = require('./lib/logger')({ env: config.env });
/* eslint-disable consistent-return, no-console */

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
      console.error(err.message);
    });

    consumer.on('processing_error', err => {
      console.error(err.message);
    });

    consumer.start();
    logger.log('info', `Resolver is listening for messages from: ${config.aws.sqs.queueUrl}`);
  },

  handleMessage: async message => {
    return new Promise(async (resolve, reject) => {
      const messageBody = JSON.parse(message.Body);
      const messageId = message.MessageId;
      const previousReceives = message.Attributes.ApproximateReceiveCount;
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const messageCreatedAt = new Date(message.Attributes.SentTimestamp - tzoffset).toISOString();
      // logger.log('info', messageBody);

      try {
        logger.log('info', `Processing message ID: ${messageId}`);
        logger.log('info', `Message created: ${messageCreatedAt}`);
        logger.log('info', `Previous receive count: ${previousReceives}`);
        await createPublicAllegationsCase(messageBody);
        return resolve();
      } catch (err) {
        logger.log('error', `Message: ${err.message}`);
        logger.log('error', `Body: ${err.body}`);
        return reject(err);
      }
    });
  }
};

module.exports = imsResolver;
