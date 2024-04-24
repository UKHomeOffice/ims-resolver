'use strict';
/* eslint-disable consistent-return, no-console */
const soap = require('strong-soap').soap;
const config = require('../config');
const fv = require('../lib/file-vault-utils');
const wsdlUrl = config.ims.wsdl;

const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;

const caseType = {
  FWTCaseCreate: {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode,
    Title: config.ims.title,
    Description: config.ims.description,
    Queue: config.ims.queue
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

const setEformValues = (eform, caseRef) => {
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();

  setEformValue(eform, 'caseid', caseRef);
  setEformValue(eform, 'dtborec', today.toLocaleDateString());
  setEformValue(eform, 'tmboec', time);
};

const createClient = async () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err) {return reject(err);}
      console.log('client created');
      client.setEndpoint(config.ims.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      console.log('end point and security set');
      const description = client.describe();
      console.log('WSDL:\n', description);
      return resolve(client);
    }
    )
  );

const createCase = async client =>
  new Promise((resolve, reject) =>
    client.createCase(caseType,
      (err, result, envelope, soapHeader) => {
        if (err) {
          console.log('last request: ', client.lastRequest);
          return reject(err);
        }
        console.log('Case reference: ' + JSON.stringify(result, null, 2));
        console.log('Envelope: ', JSON.stringify(envelope, null, 2));
        console.log('SOAP Headers: ', JSON.stringify(soapHeader, null, 2));
        console.log('last request: ', client.lastRequest);
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

const createDocument = async (attachment, fvToken) => {
  try {
    const file = await fv.getFile(attachment.url, fvToken);
    const base64File = Buffer.from(file).toString('base64');
    return {
      FWTDocument: {
        Document: base64File,
        DocumentType: 1,
        DocumentName: attachment.name
      }
    };
  } catch (error) {
    throw error;
  }
};

const addDocument = (client, document) =>
  new Promise((resolve, reject) =>
    client.addDocumentToRepository(document,
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );

const createNote = (attachmentRefs, caseRef) => {
  const note = {
    FWTNoteToParentRef: {
      ParentId: caseRef,
      ParentType: 0,
      NoteDetails: {
        Text: 'Document attachments',
        NoteLabels: {
          NoteLabel: ''
        },
        NoteAttachments: {
          NoteAttachmentList: []
        }
      }
    }
  };
  for (const reference of attachmentRefs) {
    const { name, identifier } = reference;
    note.FWTNoteToParentRef.NoteDetails.NoteAttachments.NoteAttachmentList.push({
      AttachmentName: name,
      AttachmentIdentifier: identifier,
      AttachmentType: 0
    });
  }
  return note;
};

const addNote = (client, note) =>
  new Promise((resolve, reject) =>
    client.createNotes(note,
      (err, result) => (err ? reject(err) : resolve(result))
    )
  );

module.exports = {
  createPublicAllegationsCase: async msg => {
    let result = 0;

    const client = await createClient();

    console.log('CLIENT\n', client)

    const caseRef = await createCase(client);

    const eformDefinitions = config.ims.eformDefinitions.split(', ');
    const eforms = config.ims.eforms.split(', ');

    for (let i = 0; i < eformDefinitions.length; i++) {
      result = await addCaseForm(client, caseRef, eformDefinitions[i], eforms[i]);
      console.log('addCaseForm ' + eformDefinitions[i] + ' result: ' + JSON.stringify(result, null, 2));

      result = await writeFormData(client, caseRef, eforms[i], msg);
      console.log('writeFormData ' +  eforms[i] + ' result: ' + JSON.stringify(result, null, 2));
    }

    result = addAdditionalPeople(client, caseRef, msg.AdditionalPeople);
    console.log('addAdditionalPeople result: ' + JSON.stringify(result, null, 2));

    clearFormData();

    if (msg.Attachments.length) {
      const attachmentRefs = [];
      try {
        const fvToken = await fv.auth();
        for (const attachment of msg.Attachments) {
          const document = await createDocument(attachment, fvToken);
          result = await addDocument(client, document);
          console.log('addDocument result: ' + JSON.stringify(result, null, 2));
          attachmentRefs.push({ name: attachment.name, identifier: result });
        }
        const note = createNote(attachmentRefs, caseRef);
        result = await addNote(client, note);
        console.log('createNotes result: ' + JSON.stringify(result, null, 2));
      } catch (error) {
        throw error;
      }
    }
  }
};
