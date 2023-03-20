"use strict";

const soap = require('strong-soap').soap;
const config = require('./config');
const { createPublicAllegationsCase } = require('./models/ims-model');

const caseType = {
  FWTCaseCreate : {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

createPublicAllegationsCase(caseType);
