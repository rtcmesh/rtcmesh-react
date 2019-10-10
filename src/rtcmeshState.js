import { store } from 'react-easy-state'

const rtcmeshState = store({
  ws: null,
  callbacks_by_trans_id : {},
  broadcast_callbacks_by_resource : {},
  set_prop(key, val){
    rtcmeshState[key] = val;
  },
})

export default rtcmeshState