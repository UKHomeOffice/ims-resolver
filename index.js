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

const createCaseRest = async(classificationID) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:flt="http://www.lagan.com/wsdl/FLTypes"
  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
   <soapenv:Header>
    <wsse:Security>
        <wsse:UsernameToken>
         <wsse:Username>${config.ims.apiUser}</wsse:Username>
                 <wsse:Password>${config.ims.apiPassword}</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
   <soapenv:Body>
        <flt:FWTCaseCreate>
           <ClassificationEventCode>${classificationID}</ClassificationEventCode>
           </flt:FWTCaseCreate>
     </soapenv:Body>
  </soapenv:Envelope>
  `
  const res = await fetch('https://core-report-and-manage-intelligence-ho-it-dev1-i-ie-ims.np.ebsa.homeoffice.gov.uk/lagan/services/FL', {
    method: 'POST',
    headers: {
      'content-type': 'application/xml',
      'SOAPAction': 'createCase'
    },
    body : xml
  });
  if (res.ok) {
    const data = await res.text();
    console.log(data);
  }
}

// createCaseRest(ClassificationEventCode);

createCase(caseType);
// getCase(caseOptions);



