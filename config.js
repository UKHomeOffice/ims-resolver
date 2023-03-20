
module.exports = {
    env: process.env.NODE_ENV,
    ims: {
      wsdl: process.env.WSDL,
      apiUser: process.env.IMS_API_USER,
      apiPassword: process.env.IMS_API_PASSWORD,
      PublicAllegationsEventCode: 4000041,
      eformDefinition: 'Allegations EDITABLE',
      eformName: 'allegationsHorizon',
      endpoint: process.env.IMS_ENDPOINT,
    }
  };