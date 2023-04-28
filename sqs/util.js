// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-2'});

const config = {
    endpoint: new AWS.Endpoint('http://localhost:4566'),
    accessKeyId: 'na',
    secretAccessKey: 'na',
    region: 'eu-west-2'
}

const QUEUE_NAME = 'ims';
const QUEUE_URL = 'http://localhost:4566/000000000000/ims';

// Create an SQS service object
const SQS = new AWS.SQS(config);

const listParams = {};

const createParams = {
    QueueName: QUEUE_NAME,
    Attributes: {
      'DelaySeconds': '60',
      'MessageRetentionPeriod': '86400'
    }
};

const msgParams = (msg)  => {
    return {
            // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,
        // MessageAttributes: {
        //     "Title": {
        //     DataType: "String",
        //     StringValue: "The Whistler"
        //     },
        //     "Author": {
        //     DataType: "String",
        //     StringValue: "John Grisham"
        //     },
        //     "WeeksOn": {
        //     DataType: "Number",
        //     StringValue: "6"
        //     }
        // },

       //MessageAttributes: require('./test.json'),
        MessageBody: msg,
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: QUEUE_URL
    }
 };

const receiveParam = {
    AttributeNames: [
       "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
       "All"
    ],
    QueueUrl: QUEUE_URL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
   };


module.exports = {
    SQS,
    QUEUE_NAME,
    QUEUE_URL,
    listParams,
    createParams,
    msgParams,
    receiveParam
}