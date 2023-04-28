
module.exports = {
    env: process.env.NODE_ENV,
    ims: {
      wsdl: process.env.WSDL,
      apiUser: process.env.IMS_API_USER,
      apiPassword: process.env.IMS_API_PASSWORD,
      PublicAllegationsEventCode: 4000041,
      eformDefinitions: 'Allegations EDITABLE, Allegations READ ONLY, IMS BACK OFFICE',
      eforms: 'allegationsHorizon, allegationsTablet, allegationsBackOffice',
      // eformDefinitionAllegationsEditable: 'Allegations EDITABLE',
      // eformNameAllegationsHorizon: 'allegationsHorizon',
      // eformDefinitionAllegationsReadOnly: 'Allegations READ ONLY',
      // eformNameAllegationsTablet: 'allegationsTablet',
      // eformDefinitionIMSBackOffice: 'IMS BACK OFFICE',
      // eformNameAllegationsBackOffice: 'allegationsBackOffice',
      endpoint: process.env.IMS_ENDPOINT,
    }
  };