import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';

import ChatInbox from '../../_widgets/chatInbox';
import LiveChat from '../../_widgets/chatInbox/liveChat';
import UserReportModal from '../chat4/userReportModal';
import { productChatReceived } from '../../../../hooks/socket';

require('../../_styles/market-area.scss');
require('../chat-with-seller.scss');

class ChatWithSeller2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: this.props.newItem ? this.props.newItem : '',
      receiverId:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.receiverId
          ? this.props.location.state.receiverId
          : '',

      isLoadedFrom:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.isLoadedFrom
          ? this.props.location.state.isLoadedFrom
          : this.props.isLoadedFrom
          ? this.props.isLoadedFrom
          : 'chat',

      products:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.products
          ? this.props.location.state.products
          : this.props.products
          ? this.props.products
          : [],
      chatId:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.chatId
          ? this.props.location.state.chatId
          : '',
      isUserReport: false,
      reportChatId: '',
      removeChatId: '',
    };
  }

  componentDidMount() {
    productChatReceived((newMessage) => {
      this.setState({
        newItem: newMessage,
      });
    });
  }

  handleCallback = (childData) => {
    this.setState({
      newItem: childData,
    });
  };

  handleCallbackReport = (data) => {
    if (data.type && data.type === 'remove') {
      this.setState({
        removeChatId: data.removeChatId,
      });
    } else {
      this.setState({
        isUserReport: data.isUserReport,
        reportChatId: data.reportChatId,
      });
    }
  };

  componentDidUpdate(previousProps, previousState) {
    if (
      this.props.location.state &&
      previousProps.location.state &&
      previousProps.location.state.chatId !== this.props.location.state.chatId
    ) {
      this.setState({
        products: this.props.location.state.products,
        chatId: this.props.location.state.chatId
          ? this.props.location.state.chatId
          : '',
      });
    }
  }

  render() {
    return (
      <>
        <div className="container-fluid container-layout-1">
          {/* <FiltersAndMenu /> */}

          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            <div className="middle content-area">
              <div className="chat-with-seller-block">
                {this.state.isLoadedFrom === 'chat' && (
                  <div className="left">
                    <ChatInbox
                      newItem={this.state.newItem ? this.state.newItem : null}
                      parentCallback={this.handleCallbackReport}
                    />
                  </div>
                )}
                {this.state.isLoadedFrom === 'cart' && (
                  <div className="left">
                    <ChatInbox
                      newItem={this.state.newItem ? this.state.newItem : null}
                      parentCallback={this.handleCallbackReport}
                    />
                  </div>
                )}
                {this.state.isLoadedFrom === 'notification' && (
                  <div className="left">
                    <ChatInbox
                      newItem={
                        this.state && this.state.newItem !== 'undefined'
                          ? this.state.newItem
                          : null
                      }
                      parentCallback={this.handleCallbackReport}
                    />
                  </div>
                )}
                {this.props.location.state &&
                  this.props.location.state.chatId &&
                  !this.state.removeChatId && (
                    <div className="right">
                      <LiveChat
                        products={this.state.products}
                        chatId={
                          this.props.location.state.chatId
                            ? this.props.location.state.chatId
                            : this.state.chatId
                        }
                        parentCallback={this.handleCallback}
                      />
                    </div>
                  )}
                {this.props.location.state &&
                  !this.props.location.state.chatId &&
                  !this.state.removeChatId && (
                    <div className="right">
                      <LiveChat
                        receiverId={this.state.receiverId}
                        products={this.state.products}
                        parentCallback={this.handleCallback}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {this.state.isUserReport && (
          <UserReportModal
            parentCallback={this.handleCallbackReport}
            isUserReport={this.state.isUserReport}
            reportChatId={this.state.reportChatId}
          />
        )}
      </>
    );
  }
}

export default ChatWithSeller2;
