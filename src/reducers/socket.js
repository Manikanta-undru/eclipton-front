import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from '../constants/actionTypes';

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return {
        ...state,
        isSocketConnected: true,
        socket: action.socket,
      };
    case SOCKET_DISCONNECTED:
      return {
        ...state,
        IsSocketConnected: false,
        socket: action.socket,
      };
    default: {
      return state;
    }
  }
}
