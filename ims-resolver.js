const { Consumer } = require('sqs-consumer');
const { createPublicAllegationsCase } = require('./models/ims-model');
const config = require('./config');
const { SQSClient } = require('@aws-sdk/client-sqs');
/* eslint-disable no-console */

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
    console.log(`Resolver is listening for messages from: ${config.aws.sqs.queueUrl}`);
  },

  handleMessage: async message => {
    const messageBody = JSON.parse(message.Body);

    try {
      await createPublicAllegationsCase(messageBody);
    } catch (err) {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
      console.error(localISOTime, err.message);
      console.error(localISOTime, err.body);
      throw err;
    }
  }
};

module.exports = imsResolver;
