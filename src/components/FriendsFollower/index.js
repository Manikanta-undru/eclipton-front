import React from 'react';
import images from '../../assets/images/images.js';
import './index.scss';
import { Link } from 'react-router-dom';

function FriendsFollowerSummary() {
  return (
    <div className="followerSummaryWrapper">
      <div className="headerArea">
        <div className="heading selected">
          <span className="count">2200</span>
          <span className="tabName">Followers</span>
        </div>
        <div className="heading">
          <span className="count">2145</span>
          <span className="tabName">Following</span>
        </div>
        <div className="heading">
          <li className="list-group-item p-1 pr-2 pointer  dropdown">
            <Link>
              57 Mutual
              <i className="fa fa-caret-down" />
            </Link>
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <a className="dropdown-item">
                <span className="m-1">Options</span>
              </a>
            </div>
          </li>
        </div>
      </div>
      <div className="bodyArea">
        <div className="user">
          <div className="userImage">
            <img src={images.user1} alt="userImage" />
          </div>
          <div className="userDetails">
            <span className="userName">Laurentius Rando</span>
            <span className="position">Consultant at Google .Inc</span>
          </div>
          <div className="action">
            <button>Add</button>
          </div>
        </div>
        <div className="user">
          <div className="userImage">
            <img src={images.user1} alt="userImage" />
          </div>
          <div className="userDetails">
            <span className="userName">Laurentius Rando</span>
            <span className="position">Consultant at Google .Inc</span>
          </div>
          <div className="action">
            <button>Add</button>
          </div>
        </div>
        <div className="user">
          <div className="userImage">
            <img src={images.user1} alt="userImage" />
          </div>
          <div className="userDetails">
            <span className="userName">Laurentius Rando</span>
            <span className="position">Consultant at Google .Inc</span>
          </div>
          <div className="action">
            <button>Add</button>
          </div>
        </div>
        <div className="group-footer">
          <li className="list-group-item p-1 pr-2 pointer  dropdown">
            <Link>
              See more
              <i className="fa fa-caret-down" />
            </Link>
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <a className="dropdown-item">
                <span className="m-1">Options</span>
              </a>
            </div>
          </li>
        </div>
      </div>
    </div>
  );
}

export default FriendsFollowerSummary;
