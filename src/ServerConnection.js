import React from "react";
import rtcmeshState from './rtcmeshState';

class ServerConnection  extends React.Component {
  
  constructor(props) {
    super(props);
    // We pass a callback function to handle messages to user.
    const { setProp } = rtcmeshState;
    setProp('alertCallback', props.alertCallback); 
    setProp('onOpen', props.onOpen);
  }
  
  componentDidMount() {
    const { ws } = rtcmeshState;

    if (! ws) {
      this.openConnection();
    }
  }
  
  openConnection = () => {
    const ws                                 = new WebSocket(this.props.REACT_APP_SERVER_URL);
    const { setProp, alertCallback, onOpen } = rtcmeshState;

    setProp('ws', ws);  

    ws.onopen = () => {
      // If user is authenticated we should send a role request here.
      // We should support multiple auth system, initially AWS Cognito
      if (onOpen) { 
        onOpen();
      }
    }

    ws.onclose = () => {
      setProp('ws', null);
      alertCallback('danger', 'Connection to server LOST - Trying to reconnect...');
      setTimeout(function(_this){
        _this.openConnection();
      }, 2000, this)
    }

    ws.onerror = (event) => {
      // Need to handle this better and decide what we want to show to the user.
      // Perhaps we should send a message to the server to log the error.
      console.error("ServerConnection WebSocket error observed:", event);
    }

    ws.onmessage = (event) => {
      const { broadcastCallbacksByResource, callbacksByTransId } = rtcmeshState;
      const data = JSON.parse(event.data);
      
      if (data.response && data.response.code === 200) {
        console.log('callbacksByTransId', callbacksByTransId);
        if (callbacksByTransId[data.transId]) {
          // Call the function that handles the response.
          callbacksByTransId[data.transId](data.response);
          // TODO: remove entry on a timer
          
        } else {
          // How we should handle this? Should we send a message to log it?
          console.log('ServerConnection onmessage - message not handled', data);
        }
      } else if(data.response && data.response.code !== 200) {
        // How we should handle this?
        console.error('RETURN CODE', data.response.code, data);
      } else {
        // Handle messages sent from the server to clients without a direct corresponding request.
        if (broadcastCallbacksByResource[data.resource]) {
          broadcastCallbacksByResource[data.resource](data.response);
          // TODO: remove entry on a timer
        } else {
          console.log('ServerConnection onmessage - message not handled', data);
        }
      }
    }
  }
  
  render() {
    return null;   // Optionally we could add a visible indicator that shows the client is connected.
  }
}

export default ServerConnection;


