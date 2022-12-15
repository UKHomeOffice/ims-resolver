"use strict";

const soap = require('strong-soap').soap;
// const WSDL = soap.WSDL;
// wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
const url = 'https://proservices.capreview.empro.verintcloudservices.com/lagan/services/FL?WSDL';

// const requestArgs = {
//   ClassificationEventCode:'4000041'
// };

const options = {};
// soap.createClient(url, options, function(err, client) {
//   const method = client['createCase'];
//   client.setSecurity(new soap.BasicAuthSecurity('sahmed', 'HomeOffice1!'));
//   method(requestArgs, function(err, result, envelope, soapHeader) {
//     //response envelope
//     console.log('Response Envelope: \n' + envelope);
//     //'result' is the response body
//     console.log('Result: \n' + JSON.stringify(result));
//   });
// });

// const requestArgs = {
//   FWTCaseCreate : {
//     ClassificationEventCode: '4000041'
//   }
// };
// const auth = "Basic " + new Buffer('sahmed:HomeOffice1!').toString("base64");
// soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function(err, client) {
//   client.setSecurity(new soap.BasicAuthSecurity('sahmed', 'HomeOffice1!'));
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
const auth = "Basic " + new Buffer('sahmed:HomeOffice1!').toString("base64");
soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function(err, client) {
  client.setSecurity(new soap.BasicAuthSecurity('sahmed', 'HomeOffice1!'));
  var method = client['retrieveCaseDetails'];
  method(requestArgs, function(err, result, envelope, soapHeader) {
    console.log('Response Envelope: \n' + envelope);
    console.log('Result: \n' + JSON.stringify(result));
  });
});

