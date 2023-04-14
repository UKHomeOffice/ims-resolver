"use strict";

const soap = require('strong-soap').soap;
const config = require('./config');
const { createPublicAllegationsCase } = require('./models/ims-model');
const { listSQS, createSqsQueue, msgParams, sendMessage, getMessage } = require('./sqs/create.js');
const msg = require('./sqs/test.json')

const caseType = {
  FWTCaseCreate : {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

//createPublicAllegationsCase(caseType);
createSqsQueue();
listSQS();
//sendMessage(JSON.stringify(msg));
//getMessage();
