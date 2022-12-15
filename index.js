"use strict";

const soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke.
const config = require('./config');
const { getCase } = require('./models/ims-model');
const wsdlUrl = config.ims.wsdl;

// const requestArgs = {
//   ClassificationEventCode:'4000041'
// };

const options = {};

// const requestArgs = {
//   FWTCaseCreate : {
//     ClassificationEventCode: '4000041'
//   }
// };
// const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;
// soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, function(err, client) {
//   client.setSecurity(new soap.BasicAuthSecurity(, ));
//   var method = client['createCase'];
//   method(requestArgs, function(err, result, envelope, soapHeader) {
//     console.log('Response Envelope: \n' + envelope);
//     console.log('Result: \n' + JSON.stringify(result));
//   });
// });

const requestArgs = {
  FWTCaseFullDetailsRequest : {
    CaseReference: '101000002951',
    Option: 'all'
  }
};

getCase(requestArgs);


