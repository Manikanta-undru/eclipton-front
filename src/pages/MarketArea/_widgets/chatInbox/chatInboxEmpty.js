import React, { Component } from 'react';

import chatImg from '../../../../assets/images/market-place/chat.png';

require('./chat-inbox.scss');

class ChatInboxEmpty extends Component {
  render() {
    return (
      <div className="widget-inbox">
        <div className="head">
          <div className="left">
            <h4> Inbox </h4>
          </div>

          <div className="right">
            <select name="" id="">
              <option value=""> All </option>
            </select>
          </div>
        </div>
        <div className="body empty">
          <div className="auto">
            <img src={chatImg} alt="" />
            <h3> No Messages, Yet </h3>
            <p>
              {' '}
              No messages in your inbox yet!Start chatting with your sellers by
              selectinga particular product{' '}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatInboxEmpty;
