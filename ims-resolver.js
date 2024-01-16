const { Consumer } = require('sqs-consumer');
const { createPublicAllegationsCase } = require('./models/ims-model');
const config = require('./config');
const { SQSClient } = require('@aws-sdk/client-sqs');
const AWS = require('aws-sdk');
const getCertificate = require('./certs');
/* eslint-disable consistent-return, no-console */


const imsResolver = {
  start: function (){
    getCertificate()
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
  },

  handleMessage: async message => {
    return new Promise(async resolve => {
      const messageBody = JSON.parse(message.Body);
      console.log(messageBody);

      try {
        await createPublicAllegationsCase(messageBody);

        return resolve();
      } catch (err) {
        console.error(err.message);
      }
    });
  }
};

module.exports = imsResolver;
