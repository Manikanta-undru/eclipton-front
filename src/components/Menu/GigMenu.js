import React from 'react';
import A from '../A';
import './styles.scss';

function GigMenu(props) {
  return (
    <div className="widget cardBody">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100 menu">
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/requests/add' && 'current'
              }`}
            >
              <A
                href="/passionomy/requests/add"
                className="align-items-center d-flex"
              >
                <span className="aicon groups" /> Create Gig Request
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/request/my' && 'current'
              }`}
            >
              <A
                href="/passionomy/request/my"
                className="align-items-center d-flex"
              >
                <span className="aicon groups" /> My Gig Requests
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/passionomy/request' && 'current'
              }`}
            >
              <A
                href="/passionomy/request"
                className="align-items-center d-flex"
              >
                <span className="aicon courses" /> All Gig Requests
              </A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GigMenu;
