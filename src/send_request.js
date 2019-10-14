import React from "react";
import rtcmeshState from './rtcmeshState';

const send_request = (action, service, resource, parameters, callback) => {
  let trans_id = generateUUID();
  
  const req_msg = { 
    trans_id : trans_id,
    action : action,
    service : service,
    resource : resource,
    parameters : parameters
  }
  const { ws, alert_callback, set_prop, callbacks_by_trans_id } = rtcmeshState;
  try {
    if (ws) {
      ws.send(JSON.stringify(req_msg));
      // Associate the trans_id with the callback so when we get the response we call it.
      callbacks_by_trans_id[trans_id] = callback;
      set_prop('callbacks_by_trans_id', callbacks_by_trans_id);
    } else {
      alert_callback('danger', 'Error sending request to server - Not connected');
      trans_id = null;
    }
  } catch(e) {
    alert_callback('danger', 'Error sending request to server - \n' + e.message);
    trans_id = null;
  }

  return trans_id;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default send_request;


