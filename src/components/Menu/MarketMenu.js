import React from 'react';
import A from '../A';
import './styles.scss';

function MarketMenu(props) {
  return (
    <div className="widget empty-inner-container-with-border SocialMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <span>Activities</span>
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == '/' && 'current')}>
                <A href="/" className="align-items-center d-flex"><i className="fa fa-home aicon"></i> Home</A>
              </li> */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-default-view' && 'current'
              }`}
            >
              <A
                href="/market-default-view"
                className="align-items-center d-flex"
              >
                <i className="fa fa-user aicon" /> Home
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-dashboard' && 'current'
              }`}
            >
              <A href="/market-dashboard" className="align-items-center d-flex">
                <i className="fa fa-dollar aicon" /> Dashboard
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-chat-with-seller-2' && 'current'
              }`}
            >
              <A
                href="/market-chat-with-seller-2"
                className="align-items-center d-flex"
              >
                <i className="fa fa-book aicon" /> Chat
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-my-orders' && 'current'
              }`}
            >
              <A href="/market-my-orders" className="align-items-center d-flex">
                <span className="aicon newsfeed" /> My Orders
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-my-cart' && 'current'
              }`}
            >
              <A href="/market-my-cart" className="align-items-center d-flex">
                <span className="aicon newsfeed" /> My Cart
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/market-account-flow-regular' && 'current'
              }`}
            >
              <A
                href="/market-account-flow-regular"
                className="align-items-center d-flex"
              >
                <i className="fa fa-handshake-o aicon" /> Account
              </A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MarketMenu;
