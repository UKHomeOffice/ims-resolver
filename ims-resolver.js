const { Consumer } = require('sqs-consumer');
const { createPublicAllegationsCase } = require('./models/ims-model');
const config = require('./config');
const { SQSClient } = require('@aws-sdk/client-sqs');
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
    console.log(`Resolver is listening for messages from: ${config.aws.sqs.queueUrl}`);
  },

  handleMessage: async message => {
    console.dir(message, {depth: null});
    return new Promise(async (resolve, reject) => {
      const messageBody = JSON.parse(message.Body);
      // console.log(messageBody);

      try {
        await createPublicAllegationsCase(messageBody);
        return resolve();
      } catch (err) {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
        console.error(localISOTime, err.message);
        console.error(localISOTime, err.body);
        return reject(err);
      }
    });
  }
};

module.exports = imsResolver;
