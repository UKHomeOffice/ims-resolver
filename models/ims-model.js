"use strict";
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

module.exports = {
  createCase: () => {},

  // getCase: (requestArgs) => {
  //   const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;
  //   soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, function(err, client) {
  //     client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
  //     var method = client[config.ims.getCaseApi];
  //     method(requestArgs, function(err, result, envelope, soapHeader) {
  //       console.log('Response Envelope: \n' + envelope);
  //       console.log('Result: \n' + JSON.stringify(result, null, 2));
  //     });
  //   })
  // }

  getCase: (requestArgs) => {
    const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, async function (err, client) {
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      var method = client[config.ims.getCaseApi];
      const {result, envelope, soapHeader} = await client.retrieveCaseDetails(requestArgs);
      console.log('Response Envelope: \n' + envelope);
      console.log('Result: \n' + JSON.stringify(result, null, 2));
    });
  }
}
