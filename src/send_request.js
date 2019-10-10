import React from "react";
import rtcmeshState from './rtcmeshState';

const send_request = (action, service, resource, parameters, callback) => {
  var trans_id = Math.uuid();
  var req_msg = { 
    trans_id : trans_id,
    action : action,
    service : service,
    resource : resource,
    parameters : parameters
  }
  const { ws, alert_callback } = rtcmeshState;
  try{
    if(ws){
      ws.send(JSON.stringify(req_msg));
      // Associate the trans_id with the callback so when we get the response we call it.
      callbacks_by_trans_id[trans_id] = callback;
    }else{
      alert_callback('danger', 'Error sending request to server - Not connected');
      trans_id = null;
    }
  }catch(e){
    alert_callback('danger', 'Error sending request to server - \n' + e.message);
    trans_id = null;
  }
  return trans_id;
}

export default send_request;


