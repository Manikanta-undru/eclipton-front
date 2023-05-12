import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';

import FiltersAndMenu from '../../_widgets/filtersAndMenu';
import LiveChat from '../../_widgets/chatInbox/liveChat';

require('../../_styles/market-area.scss');
require('../chat-with-seller.scss');

class ChatWithSeller1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products:
        this.props.location.state && this.props.location.state.products
          ? this.props.location.state.products
          : [],
    };
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <FiltersAndMenu />

          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            <div className="middle content-area">
              <div className="chat-with-seller-block">
                <div className="right">
                  <LiveChat products={this.state.products} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatWithSeller1;
