"use strict";
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

module.exports = {
  /** **********************************************************
   * @param {Object} caseType type of case to create
   * @param {Object} caseType.FWTCaseCreate
   * @param {String} caseType.FWTCaseCreate.ClassificationEventCode
   ************************************************************/

  

  createCase: (caseType) => {
    const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, async function(err, client) {
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      var method = client[config.ims.createCaseApi];
      const {result, envelope, soapHeader} = await client.createCase(caseType);
      console.log('Response Envelope: \n' + envelope);
      console.log('Result: \n' + JSON.stringify(result, null, 2));
    });
  },
  /** **********************************************************
   * @param {Object} caseOptions case details
   * @param {Object} caseOptions.FWTCaseFullDetailsRequest 
   * @param {String} caseOptions.FWTCaseFullDetailsRequest.CaseReference
   * @param {String} caseOptions.FWTCaseFullDetailsRequest.Option
   ************************************************************/
  getCase: (caseOptions) => {
    const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, async function (err, client) {
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      var method = client[config.ims.getCaseApi];
      const {result, envelope, soapHeader} = await client.retrieveCaseDetails(caseOptions);
      console.log('Response Envelope: \n' + envelope);
      console.log('Result: \n' + JSON.stringify(result, null, 2));
    });
  }
}
