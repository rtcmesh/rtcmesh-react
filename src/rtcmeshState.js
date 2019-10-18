import { store } from 'react-easy-state'

const rtcmeshState = store({
  ws: null,
  callbacksByTransId : {},
  broadcastCallbacksByResource : {},
  setProp(key, val){
    rtcmeshState[key] = val;
  },
})

export default rtcmeshState