import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { profilePic } from '../../globalFunctions';

function GroupMembers(props) {
  const userall = props.groupmembers.map((groupsdata, index) => (
    <>
      {groupsdata.avatar != undefined ? (
        <img
          src={profilePic(groupsdata.avatar)}
          className="user-members"
          alt="img"
          key={index}
        />
      ) : (
        <img src={profilePic()} className="user-members" alt="img" />
      )}
    </>
  ));
  const url = `/groupmembers/${props.group_id}`;
  return (
    <div className="groupMembers">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="fa fa-search" />
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </div>
      <div className="group-header">
        <label>Group Members</label>
        <Link
          onClick={() => {
            window.location.href = url;
          }}
        >
          See More <i className="fa fa-caret-down" />
        </Link>
      </div>
      <div className="hline" />
      <div className="group-header">
        <div>{userall}</div>
        {props.groupmembers.length > 1000 ? (
          <span className="count">
            + {props.groupmembers.length}
            <br />K Members
          </span>
        ) : (
          <span className="count">
            {' '}
            + {props.groupmembers.length}
            <br /> Members
          </span>
        )}
      </div>
      <div className="hline" />
      <div className="group-body suggested">
        <label>Suggested Members</label>
        {props.suggestion.map((frnds) => (
          <div className="user-details" key={frnds}>
            <div className="left" key={frnds}>
              <img
                className="suggested-members"
                src={frnds.avatar}
                alt="user1"
                key={frnds}
              />
              <span key={frnds}>{frnds.name}</span>
            </div>
            <div className="right" key={frnds}>
              <button key={frnds}>Invite</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupMembers;
