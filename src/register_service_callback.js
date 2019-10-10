import React from "react";
import rtcmeshState from './rtcmeshState';

// Register callbacks to handle messages sent from the server to clients without a direct corresponding request.
const register_service_callback = (resource, callback) => {
  const { broadcast_callbacks_by_resource } = rtcmeshState;
  broadcast_callbacks_by_resource[resource] = callback;
}

export default register_service_callback;


