// import socketIOClient from 'socket.io-client';
// let socket = null;
// export const setSocket = () => {
//   socket = socketIOClient('http://localhost:8000/');
// }

// export const onUserChange = (callback) => {
//   socket.on('users_list_changed', (data) => callback(data));
// }

// export const onMessageReceived = (socketListenId, callback) => {
//   socket.on(socketListenId, (data) => callback(data));
// }

// export const emitEvent = (event, data) => {
//   socket.emit(event, data);
// }

import socketIOClient from 'socket.io-client';

const socket = socketIOClient(process.env.REACT_APP_SOCKETURL, {
  secure: true,
  transports: ['websocket'],
});
const socket2 = socketIOClient(process.env.REACT_APP_WALLETSOCKET, {
  secure: true,
  transports: ['websocket'],
});
export const connectSocket = (userid) => {
  console.log(userid, 'socket userid');
  // if(socket != null){
  // var data = {
  // 'amount': 1,
  // 'ordertype': "limit",
  // 'pair': "5e39359ae0458955902c210a",
  // 'price': 0.1943,
  // 'stop_price': 0.1943,
  // 'tocurrency_price': 0.1943,
  // 'type': "buy",
  // 'user_id': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWNyZXQiOiI1ZmFiYTc2MWE4YjhkYTQ3NWQ2Y2Y0YTIiLCJpYXQiOjE2MTQ0NDAzNjYsImV4cCI6MTYxNDQ1ODM2Nn0.rW9gFTCZjwMv7l_MXRhALGwR8Bi8DLH5tqMSvVLVbCY"
  // };
  // var o = socket.emit('createOrder', data);

  socket.emit('setUserId', userid);
  socket.on('connection', (data) => {
    console.log(data, 'datasssdsd');
  });
  // }
};

// export const send = (msg, userid) => {
//   // if(socket != null){
//   socket.emit('send', msg) // change 'red' to this.state.color
//   //}
// }
export const ticker = (pair, callback) => {
  socket2.on('pairtickerdetails', (data) => callback(data));
};

export const rewardFee = (callback) => {
  socket2.on('getRewardStatusChanges1', (data) => callback(data));
};

export const orderDetailsData = (callback) => {
  socket2.on('userOrderDetailsData', (data) => callback(data));
};

export const notificationReceived = (callback) => {
  socket.on('notification', (data) => {
    callback(data);
  });
};

export const notificationUpdate = (callback) => {
  socket.on('friend_request', (data) => {
    callback(data);
  });
};

export const messageReceived = (callback) => {
  socket.on('message', (data) => callback(data));
};

export const messageNotificationReceived = (callback) => {
  socket.on('message_notification', (data) => callback(data));
};

export const friendRequest = (callback) => {
  socket.on('friend_request', (data) => callback(data));
};

export const Rejectnotification = (callback) => {
  socket.on('Rejectnotification', (data) => callback(data));
};

// group post like GS

export const LikeReceived = (callback) => {
  socket.on('group_post_likes', (data) => {
    callback(data);
  });
};

export const productChatReceived = (callback) => {
  socket.on('product_chat', (data) => callback(data));
};

export const productCheckout = (callback) => {
  socket.on('product_checkout', (data) => callback(data));
};

export const productSharing = (callback) => {
  socket.on('product_sharing', (data) => callback(data));
};

export const GroupCreateNotification = (callback) => {
  socket.on('group_created', (data) => {
    callback(data);
  });
};
export const tribesgrpConnect = (name, room) => {
  socket.emit('tribesgrpConnect', { name, room }, (error) => {
    if (error) {
      alert(error);
    } else {
      console.log(name, room, 'socket_data');
    }
  });
};

export const Messagegrp = (callback) => {
  socket.on('group_receive_message', (data) => {
    callback(data);
  });
};

export const getComments = (callback) => {
  socket.on('group_receive_comment', (data) => {
    console.log(data);
    callback(data);
  });
};

export const grpMessageReceived = (callback) => {
  socket.on('grpMessage', (data) => {
    callback(data);
  });
};

export const productCheckoutCancel = (callback) => {
  socket.on('product_checkout_cancel', (data) => callback(data));
};

export const productCheckoutRefund = (callback) => {
  socket.on('product_checkout_refund', (data) => callback(data));
};
export const groupConnected = (name, room) => {
  socket.emit('groupConnected', { name, room }, (error) => {
    if (error) {
      alert(error);
    }
  });
};

// function notificationReceived(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
// }
// export { notificationReceived };
