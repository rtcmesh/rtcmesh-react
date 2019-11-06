import rtcmeshState from './rtcmeshState';

const SendRequest = (action, service, resource, parameters, callback) => {
  let transId = generateUUID();
  
  const req_msg = { 
    trans_id : transId,
    action : action,
    service : service,
    resource : resource,
    parameters : parameters
  }
  const { ws, alertCallback, setProp, callbacksByTransId } = rtcmeshState;

  try {
    ws.send(JSON.stringify(req_msg));
    console.log(JSON.stringify(req_msg));
    // Associate the transId with the callback so when we get the response we call it.
    callbacksByTransId[transId] = callback;
    setProp('callbacksByTransId', callbacksByTransId);
  } catch(e) {
    alertCallback('danger', 'Error sending request to server - \n' + e.message);
    transId = null;
  }

  return transId;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default SendRequest;


