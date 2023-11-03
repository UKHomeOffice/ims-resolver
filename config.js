'use strict';
/* eslint no-process-env: 0 */
const AWS = require('aws-sdk');
module.exports = {
  env: process.env.NODE_ENV,
  ims: {
    wsdl: process.env.WSDL,
    apiUser: process.env.IMS_API_USER,
    apiPassword: process.env.IMS_API_PASSWORD,
    PublicAllegationsEventCode: 4000041,
    eformDefinitions: 'Allegations READ ONLY, Allegations EDITABLE',
    eforms: 'allegationsTablet, allegationsHorizon',
    endpoint: process.env.IMS_ENDPOINT
  },
  aws: {
    sqs: {
      endpoint: new AWS.Endpoint('http://localhost:4566'),
      region: process.env.AWS_REGION,
      queueUrl: process.env.SQS_URL,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  }
};
