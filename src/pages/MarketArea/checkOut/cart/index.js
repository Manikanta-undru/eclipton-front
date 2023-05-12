import React from 'react';

import CartModal from './cartModal';

require('../../_styles/market-area.scss');
require('../../chatWithSeller/chat-with-seller.scss');

class Cart1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: '',
      isLoadedFrom:
        this.props.location.state && this.props.location.state.isLoadedFrom
          ? this.props.location.state.isLoadedFrom
          : 'chat',
      products:
        this.props.location.state && this.props.location.state.products
          ? this.props.location.state.products
          : [],
    };
  }

  render() {
    return (
      <div className="market-place-styles">
        {/* <ChatWithSeller2 products={this.state.products} newItem={this.state.newItem}/> */}

        <CartModal />
      </div>
    );
  }
}

export default Cart1;
