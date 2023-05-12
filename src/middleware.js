import io from 'socket.io-client';
import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from './constants/actionTypes';
import { alertBox } from './commonRedux';

const promiseMiddleware = (store) => (next) => (action) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const { skipTracking } = action;

    action.payload.then(
      (res) => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return;
        }

        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      (error) => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return;
        }

        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = (store) => (next) => (action) => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.user.token);
      agent.setToken(action.payload.user.token);

      window.localStorage.setItem(
        'currentUser',
        action.payload.user.currentUser
      );
      agent.setCurrentUser(action.payload.user.currentUser);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);

    window.localStorage.setItem('walletToken', '');
    agent.setWalletToken(null);

    window.localStorage.setItem('currentUser', '');
    agent.setCurrentUser(null);
  }

  next(action);
};

const socketMiddleware = (store) => (next) => (action) => {
  const currentState = store.getState();
  const token = window.localStorage.getItem('jwt');
  if (!currentState.socket.socket && token) {
    let socket;
    socket = io.connect(process.env.REACT_APP_WALLETSOCKET, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      query: `token=${token}&app=SOCIAL`,
    });
    socket.on('connect', () => {
      console.log(`Socket IO SOCKET_CONNECTED`);
      // alertBox(true, `Socket Server Connected`, `success`)
      store.dispatch({
        type: SOCKET_CONNECTED,
        socket,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket IO SOCKET_DISCONNECTED`);
      store.dispatch({
        type: SOCKET_DISCONNECTED,
        socket,
      });
    });

    socket.on('connect_error', () => {
      socket.connect();
    });
    socket.on('OrderUpdate', (OrderResponse) => {
      if (OrderResponse) {
        if (OrderResponse.Data && OrderResponse.Data.status != 0) {
          alertBox(
            true,
            String(
              `${OrderResponse.Data.type} ${String(
                OrderResponse.Data.pairName
              ).replace('_', '/')}-${OrderResponse.Data.msg}`
            ).toUpperCase(),
            `success`
          );
          // alertBox(true, String(`${OrderResponse.Data.type} ${OrderResponse.Data.Amount}  ${String(OrderResponse.Data.pairName).replace('_','/')}-${OrderResponse.Data.msg}`).toUpperCase(), `success`)
        } else {
          alertBox(true, OrderResponse.Data.msg);
        }
      }
    });

    socket.on('Connected', (resp) => {
      if (resp) {
        console.log('Socket Connected', resp);
        // alertBox(true, resp,`success`)
      }
    });
  }
  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}

export { promiseMiddleware, localStorageMiddleware, socketMiddleware };
