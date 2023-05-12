import React from 'react';
import A from '../A';
import './styles.scss';

function SocialMenu(props) {
  return (
    <div className="widget cardBody SocialMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <i className="fa fa-bars" /> <span>Menu</span>
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == '/' && 'current')}>
                <A href="/" className="align-items-center d-flex"><i className="fa fa-home aicon"></i> Home</A>
              </li> */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/profile' && 'current'
              }`}
            >
              <A href="/profile" className="align-items-center d-flex">
                <i className="fa fa-user aicon" /> My Profile
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'trading' && 'current'
              }`}
            >
              <A href="/wallet/deposit" className="align-items-center d-flex">
                <i className="fa-solid fa-wallet aicon" /> My Wallet
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'blogs' && 'current'
              }`}
            >
              <A href="/blogs" className="align-items-center d-flex">
                <i className="fa fa-book aicon" /> My Blogs
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'gigonomy' && 'current'
              }`}
            >
              <A
                href="/passionomy/dashboard"
                className="align-items-center d-flex"
              >
                <i className="fa-solid fa-handshake-simple aicon" /> My Gigs
              </A>
            </li>
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == 'feed' && 'current')}>
                <A href="/feed" className="align-items-center d-flex"><span className="aicon newsfeed"></span> Feed</A>
              </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SocialMenu;
