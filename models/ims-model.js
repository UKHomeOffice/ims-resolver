'use strict';
const soap = require('strong-soap').soap;
const config = require('../config');
const fv = require('../lib/file-vault-utils');
const logger = require('../lib/logger');
const wsdlUrl = config.ims.wsdl;

const maskFilename = name => name.replace(/^(.{2}).*(.{2}\..+)$/, '$1***$2');

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
      EformName: null
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
  // add 0 in front of single digit minutes
  const time = today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

  setEformValue(eform, 'caseid', caseRef);
  setEformValue(eform, 'dtBORec', today.toLocaleDateString('en-GB'));
  setEformValue(eform, 'tmBORec', time);
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
        logger.info({ caseReference: result }, 'Case created');
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
    eformData.FLEformFields.CaseEformInstance.EformName = eform;
    eformData.FLEformFields.EformData.EformFields = msg.EformFields;
    eformData.FLEformFields.CaseEformInstance.CaseReference = caseRef;
    setEformValues(eformData.FLEformFields.EformData, caseRef);
    client.writeCaseEformData(eformData,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

const clearFormData =  () => {
  eformData.FLEformFields.CaseEformInstance.EformName = null;
  eformData.FLEformFields.EformData.EformFields = null;
  eformData.FLEformFields.CaseEformInstance.CaseReference = null;
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
    logger.info({ result }, 'Additional person added');
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
    throw new Error(`Failed to retrieve document '${maskFilename(attachment.name)}' from file vault: ${error.message}`);
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

    const client = await createClient();
    logger.debug('SOAP client created');

    const caseRef = await createCase(client);

    const eformDefinitions = config.ims.eformDefinitions.split(', ');
    const eforms = config.ims.eforms.split(', ');

    for (let i = 0; i < eformDefinitions.length; i++) {
      await addCaseForm(client, caseRef, eformDefinitions[i], eforms[i]);
      await writeFormData(client, caseRef, eforms[i], msg);
    }

    await addAdditionalPeople(client, caseRef, msg.AdditionalPeople);

    clearFormData();

    if (msg.Attachments.length) {
      logger.debug({ count: msg.Attachments.length }, 'Processing attachments');
      const attachmentRefs = [];

      const fvToken = await fv.auth();
      for (const attachment of msg.Attachments) {
        const document = await createDocument(attachment, fvToken);
        const documentIdentifier = await addDocument(client, document);
        logger.debug({ documentIdentifier: documentIdentifier }, 'Document created');
        attachmentRefs.push({ name: attachment.name, identifier: documentIdentifier });
      }
      const note = createNote(attachmentRefs, caseRef);
      await addNote(client, note);
    }
  }
};
