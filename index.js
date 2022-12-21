"use strict";

const soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke.
const config = require('./config');
const { createCase, getCase } = require('./models/ims-model');
const wsdlUrl = config.ims.wsdl;

const options = {};

const caseType = {
  FWTCaseCreate : {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

const caseOptions = {
  FWTCaseFullDetailsRequest : {
    CaseReference: '101000002989',
    Option: 'all'
  }
};

createCase(caseType);
getCase(caseOptions);



