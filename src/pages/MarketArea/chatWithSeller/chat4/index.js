import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';

import UserReportModal from './userReportModal';

require('../../_styles/market-area.scss');
require('../chat-with-seller.scss');

class ChatWithSeller4 extends React.Component {
  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            {/* <div className="middle content-area">  
              <div className="chat-with-seller-block">
                <div className="left">
                  <ChatInbox />
                </div>

                <div className="right">
                  <LiveChat />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <UserReportModal />
      </div>
    );
  }
}

export default ChatWithSeller4;
