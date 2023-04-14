const { SQS, listParams, createParams, msgParams, receiveParam, QUEUE_URL } = require('./util.js');
const config = require('../config');
const { createPublicAllegationsCase } = require('../models/ims-model');

const caseType = {
  FWTCaseCreate : {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

module.exports = {
    listSQS: async () => {
        SQS.listQueues(listParams, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.QueueUrls);
            }
        });
    },

    createSqsQueue: async () => {
        SQS.createQueue(createParams, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.QueueUrl);
            }
        });
    },

    sendMessage: async (msg) => {
        SQS.sendMessage(msgParams(msg), function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.MessageId);
            }
        });
    },
    getMessage: async () => {
        SQS.receiveMessage(receiveParam, function(err, data) {
            if (err) {
              console.log("Receive Error", err);
            } else if (data.Messages) {
              console.log('-----Message------');
              console.log(data.Messages);
              console.log('-----Message End------');
              createPublicAllegationsCase(caseType, data.Messages[0].Body);
              var deleteParams = {
                QueueUrl: QUEUE_URL,
                ReceiptHandle: data.Messages[0].ReceiptHandle
              };
              SQS.deleteMessage(deleteParams, function(err, data) {
                if (err) {
                  console.log("Delete Error", err);
                } else {
                  console.log("Message Deleted", data);
                }
              });
            }
          });
    }

}