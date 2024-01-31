'use strict';
/* eslint-disable consistent-return, no-console */
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;

const caseType = {
  FWTCaseCreate: {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

const eForm = {
  FWTCaseEformNew: {
    CaseReference: null,
    EformName: null
  },
  FLCaseEformInstance: {
    CaseReference: null,
    EformName: null
  }
};

const eformData = {
  FLEformFields: {
    CaseEformInstance: {
      CaseReference: null,
      EformName: config.ims.eformName
    },
    EformData: {
      EformFields: null
    }
  }
};

const extensionObject = {
  FLExtensionObjectCreate: {
    ObjectID: -1,
    BriefDetails: {
      ObjectID: {
        ObjectType: 20,
        ObjectReference: -1
      }
    },
    Value: []
  }
};

const setEformValue = (eform, fieldName, fieldValue) => {
  eform.EformFields.push({FieldName: fieldName, FieldValue: fieldValue});
};

// Mandatory fields TBD - move to config
const setEformValues = (eform, caseRef) => {
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();

  setEformValue(eform, 'casenum', caseRef);
  setEformValue(eform, 'casenum_1', caseRef);
  setEformValue(eform, 'caseid', caseRef);
  setEformValue(eform, 'caseref', caseRef);
  setEformValue(eform, 'rdborec', 'Online');
  setEformValue(eform, 'staffuserid', config.ims.apiUser);
  setEformValue(eform, 'dtborec', today.toLocaleDateString());
  setEformValue(eform, 'tmboec', time);

  setEformValue(eform, 'rdaboutcontact', 'No');
  setEformValue(eform, 'rdabout18', 'Yes');

  setEformValue(eform, 'txbofname', 'test');
  setEformValue(eform, 'txbosurname', 'test');
  setEformValue(eform, 'txbomobile', 'test');
  setEformValue(eform, 'txboemail', 'test@test.com');
  setEformValue(eform, 'rdbogroup', 'ImmigrationGroup');

  setEformValue(eform, 'rdbowho', 'Other');
  setEformValue(eform, 'txbodept', 'test');
};

const createClient = async () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err) {return reject(err);}
      client.setEndpoint(config.ims.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      return resolve(client);
    }
    )
  );

const createCase = async client =>
  new Promise((resolve, reject) =>
    client.createCase(caseType,
      (err, result) => {
        if (err) {return reject(err);}
        console.log('Case reference: ' + JSON.stringify(result, null, 2));
        return resolve(result);
      }
    )
  );

const addCaseForm = async (client, caseRef, eformDefinition, eformName) =>
  new Promise(function (resolve, reject) {
    eForm.FWTCaseEformNew.CaseReference =
    eForm.FLCaseEformInstance.CaseReference = caseRef;
    eForm.FWTCaseEformNew.EformName = eformDefinition;
    eForm.FLCaseEformInstance.EformName = eformName;
    client.addCaseEform(eForm,
      (err, result) => {
        if (err) {return reject(err);}

        return resolve(result);
      }
    );
  });


const writeFormData = async (client, caseRef, eform, msg) =>
  new Promise(function (resolve, reject) {
    console.log('eform: ', eform);
    eformData.FLEformFields.CaseEformInstance.EformName = eform;
    eformData.FLEformFields.EformData.EformFields = msg.EformFields;
    eformData.FLEformFields.CaseEformInstance.CaseReference = caseRef;
    setEformValues(eformData.FLEformFields.EformData, caseRef);
    console.log('eformData: ', eformData);
    client.writeCaseEformData(eformData,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

const clearFormData =  () => {
  eformData.FLEformFields.CaseEformInstance.EformName = null;
  eformData.FLEformFields.EformData.EformFields = null;
  eformData.FLEformFields.CaseEformInstance.CaseReference = null;
  console.log('eformData: ', eformData);
};

const addAdditionalPerson = async (client, caseRef, additionalPerson) =>
  new Promise(function (resolve, reject) {
    extensionObject.FLExtensionObjectCreate.Value = additionalPerson;
    extensionObject.FLExtensionObjectCreate.Value.push({Key: 'CASEID', StringValue: caseRef});
    extensionObject.FLExtensionObjectCreate.Value.push({Key: 'INITIALFORM', StringValue: 'Y'});

    client.createExtensionObject(extensionObject,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

const addAdditionalPeople = async (client, caseRef, additionalPeople) => {
  for (let i = 0; i < additionalPeople.length; i++) {
    const result = await addAdditionalPerson(client, caseRef, additionalPeople[i]);
    console.log('addAdditionalPerson result: ' + JSON.stringify(result, null, 2));
  }
};

module.exports = {
  createPublicAllegationsCase: async msg => {
    let result = 0;

    const client = await createClient();

    const caseRef = await createCase(client);

    const eformDefinitions = config.ims.eformDefinitions.split(', ');
    const eforms = config.ims.eforms.split(', ');

    for (let i = 0; i < eformDefinitions.length; i++) {
      result = await addCaseForm(client, caseRef, eformDefinitions[i], eforms[i]);
      console.log('addCaseForm ' + eformDefinitions[i] + ' result: ' + JSON.stringify(result, null, 2));

      result = await writeFormData(client, caseRef, eforms[i], msg);
      console.log('writeFormData ' +  eforms[i] + ' result: ' + JSON.stringify(result, null, 2));

      result = addAdditionalPeople(client, caseRef, msg.AdditionalPeople);
      console.log('addAdditionalPeopleclient result: ' + JSON.stringify(result, null, 2));
    }

    clearFormData();
  }
};
