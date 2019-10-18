import rtcmeshState from './rtcmeshState';

// Register callbacks to handle messages sent from the server to clients without a direct corresponding request.
const RegisterServiceCallback = (resource, callback) => {
  const { broadcastCallbacksByResource } = rtcmeshState;
  broadcastCallbacksByResource[resource] = callback;
}

export default RegisterServiceCallback;


