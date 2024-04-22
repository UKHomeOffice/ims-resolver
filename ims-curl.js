const { Curl } = require('node-libcurl');
const config = require('./config');

const imsCurl = {
  start: () => {
    const url = config.ims.endpoint;
    const soapXml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:flt="http://www.lagan.com/wsdl/FLTypes" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
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
          <ClassificationEventCode>${config.ims.PublicAllegationsEventCode}</ClassificationEventCode>
        </flt:FWTCaseCreate>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    const curl = new Curl();
    curl.setOpt(Curl.option.URL, url);
    curl.setOpt(Curl.option.POST, true);
    curl.setOpt(Curl.option.POSTFIELDS, soapXml);
    curl.setOpt(Curl.option.HTTPHEADER, ['Content-Type: text/xml', 'SOAPAction: your_soap_action_here']);
    curl.setOpt(Curl.option.VERBOSE, true); // Enable verbose mode for debugging
    curl.setOpt(Curl.option.SSL_VERIFYPEER, false); // Ignore SSL certificate verification

    curl.on('end', (statusCode, body, headers) => {
      console.log('Response:', body);
      curl.close();
    });

    curl.on('error', curl.close.bind(curl));

    curl.perform();
  }
}


module.exports = imsCurl;
