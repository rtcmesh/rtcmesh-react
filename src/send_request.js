import rtcmeshState from './rtcmeshState';
import SetDeceleratingTimeout from './util';

const SendRequest = (action, service, resource, parameters, callback) => {
  let transId = generateUUID();

  const req_msg = { 
    trans_id : transId,
    action : action,
    service : service,
    resource : resource,
    parameters : parameters
  }
  const { alertCallback } = rtcmeshState;

  try {
    SetDeceleratingTimeout(function() {
      return sendMessage(req_msg, callback);
    }, 1000 * 2, 3, function(success) {
      if (!success) {
        SetDeceleratingTimeout(function() {
          return sendMessage(req_msg, callback);
        }, 1000 * 10, 6, function(success) {
          if (!success) {
            SetDeceleratingTimeout(function() {
              return sendMessage(req_msg, callback);
            }, 1000 * 60, 20, function(success) {
              if (!success) {
                alertCallback('danger', 'Server is not responding afer repeated attempts; giving up.');
              }
            });
          }
        });
      }
    });
  } catch(e) {
    alertCallback('danger', 'Error sending request to server - \n' + e.message);
    transId = null;
  }

  return transId;
}

const sendMessage = (message, callback) => {
  const { ws, setProp, callbacksByTransId } = rtcmeshState;

  if (ws.readyState != 1) {
    return false;
  }

  ws.send(JSON.stringify(message));
  console.log(JSON.stringify(message));
  // Associate the transId with the callback so when we get the response we call it.
  callbacksByTransId[message.trans_id] = callback;
  setProp('callbacksByTransId', callbacksByTransId);

  return true;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default SendRequest;


