import React from 'react';
import A from '../A';
import './styles.scss';

function MyGigsMenu(props) {
  return (
    <div className="widget cardBody">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="list-group-item d-flex justify-content-between align-items-center header-drak widgetTitle">
              My Gigs
            </li>
          </ul>
          <ul className="list-group w-100 menu">
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/dashboard' && 'current'
              }`}
            >
              <A
                href="/passionomy/dashboard"
                className="align-items-center d-flex"
              >
                <span className="fa-solid fa-handshake-simple aicon" /> My Gigs
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/dashboard/purchased' &&
                'current'
              }`}
            >
              {/* <A href='/passionomy/gig/purchased' className="align-items-center d-flex"><span className="aicon fa fa-star-half-empty"></span> Purchased Gigs</A> */}
              <A
                href="/passionomy/dashboard/purchased"
                className="align-items-center d-flex"
              >
                <span className="aicon fa fa-star-half-empty" /> Purchased Gigs
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/dashboard/requests' &&
                'current'
              }`}
            >
              <A
                href="/passionomy/dashboard/requests"
                className="align-items-center d-flex"
              >
                <span className="aicon fa fa-send" /> My Gig Requests
              </A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyGigsMenu;
