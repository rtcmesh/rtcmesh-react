import React from "react";
import rtcmeshState from './rtcmeshState';
import send_request from './send_request';

class ServerConnection  extends React.Component {
  
  constructor(props) {
    super(props);
    // We pass a callback function to handle messages to user.
    const { set_prop } = rtcmeshState;
    set_prop('alert_callback', props.alert_callback); 
    set_prop('onopen', props.onopen);
  }
  
  componentDidMount() {
    const { ws } = rtcmeshState;

    if (! ws) {
      this.openConnection();
    }
  }
  
  openConnection = () => {
    const ws                                   = new WebSocket(this.props.REACT_APP_SERVER_URL);
    const { set_prop, alert_callback, onopen } = rtcmeshState;

    set_prop('ws', ws);  

    ws.onopen = () => {
      // If user is authenticated we should send a role request here.
      // We should support multiple auth system, initially AWS Cognito
      if (onopen) { 
        onopen();
      }
    }

    ws.onclose = () => {
      set_prop('ws', null);
      alert_callback('danger', 'Connection to server LOST - Trying to reconnect...');
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
      const { broadcast_callbacks_by_resource, callbacks_by_trans_id } = rtcmeshState;
      const data = JSON.parse(event.data);
      
      if (data.response && data.response.code === 200) {
        if (callbacks_by_trans_id[data.trans_id]) {
          // Call the function that handles the response.
          callbacks_by_trans_id[data.trans_id](data.response);
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
        if (broadcast_callbacks_by_resource[data.resource]) {
          broadcast_callbacks_by_resource[data.resource](data.response);
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


