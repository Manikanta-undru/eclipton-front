import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

function SavedGroups(props) {
  const userall = props.saveGroups.map((groups, index) => (
    <div className="group-box" key={index}>
      <div className="group-img">
        <img
          src={groups.groupdata.banner}
          alt="banner"
          style={{ height: '80px', width: '100px', padding: '10px' }}
        />
      </div>
      <div className="group-text">
        <span>{groups.groupdata.name}</span>
        {props.follower[groups.groupdata._id] ? (
          <span>{props.follower[groups.groupdata._id]} followers</span>
        ) : (
          <span>0 followers</span>
        )}
      </div>
    </div>
  ));

  return (
    <div className="savedGroups">
      <div className="group-header">Saved Groups</div>
      <div className="hline" />
      <div className="group-body">
        {props.saveGroups.length > 0 ? (
          <>
            {userall}
            <div className="group-footer">
              <li className="list-group-item p-1 pr-2 pointer  dropdown">
                <Link
                  onClick={() => {
                    window.location.href = '/mygroup';
                  }}
                >
                  See more
                  <i className="fa fa-caret-down" />
                </Link>
                {/* <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <a className="dropdown-item">
                <span className="m-1">Options</span>
              </a>
            </div> */}
              </li>
            </div>
          </>
        ) : (
          <span style={{ 'font-size': '15px' }}>No Saved Groups</span>
        )}
      </div>
    </div>
  );
}

export default SavedGroups;
