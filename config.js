'use strict';
/* eslint no-process-env: 0 */
module.exports = {
  env: process.env.NODE_ENV,
  ims: {
    wsdl: process.env.WSDL,
    apiUser: process.env.IMS_API_USER,
    apiPassword: process.env.IMS_API_PASSWORD,
    PublicAllegationsEventCode: 4000041,
    title : 'Incomplete Allegation',
    description : 'Allegation from Horizon',
    queue : 'Allegations Kainos',
    eformDefinitions: 'Allegations READ ONLY, Allegations EDITABLE',
    eforms: 'allegationsTablet, allegationsHorizon',
    endpoint: process.env.IMS_ENDPOINT
  },
  aws: {
    sqs: {
      region: process.env.AWS_REGION || 'eu-west-2',
      queueUrl: process.env.SQS_URL,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  },
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
  }
};

