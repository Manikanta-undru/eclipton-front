import React from 'react';
import images from '../../assets/images/images';
import { alertBox } from '../../commonRedux';
import { ApproveMember } from '../../http/group-calls';

import './style/memberrequest.scss';

const handlerequest = (group_id, userid, status) => {
  const d = {};
  d.group_id = group_id;
  d.user_id = userid;
  if (status == 'approve') {
    d.approval_type = 'approved';
  } else {
    d.approval_type = 'rejected';
  }
  ApproveMember(d).then((JoinResult) => {
    let message_dis = '';
    if (JoinResult.message == 'update_success') {
      if (status == 'approve') {
        message_dis = 'Successfully approved Group';
      } else {
        message_dis = 'Successfully Rejected Group';
      }
      alertBox(true, message_dis, 'success');
      window.location.href = `/settings/${group_id}`;
    } else {
      if (status == 'approve') {
        message_dis = 'Error! approved Group';
      } else {
        message_dis = 'Error! Rejected Group';
      }
      alertBox(true, message_dis);
    }
  });
};

function MemberRequest(props) {
  const MembersAll = props.members.map((member, index) => (
    <div className="post mt-0" key={index}>
      <div className="header">
        <div className="leftArea">
          <img
            className="profile-icon"
            src={images.profileM}
            alt="profile-icon"
          />
          <div className="profileDetails">
            <span className="name">{member.username}</span>
            <span className="position">
              {member.member_position != '' ? member.member_position : '-'}
            </span>
            <span className="time">Just now</span>
          </div>
        </div>
        <div className="rightArea">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Pending
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                className="dropdown-item"
                href="javascript:void(0)"
                onClick={(e) =>
                  handlerequest(member.groupid, member.userid, 'approve')
                }
              >
                Approved
              </a>
              <a
                className="dropdown-item"
                href="javascript:void(0)"
                onClick={(e) =>
                  handlerequest(member.groupid, member.userid, 'reject')
                }
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="memberRequestWrapper">
      <div className="bottom">
        <div className="post">
          <div className="containerHeader">
            <span>Member Request</span>
          </div>
        </div>
      </div>
      <br />

      {props.members.length > 0 ? (
        <div className="bottom">{MembersAll}</div>
      ) : (
        <div className="top">
          <div className="header">
            <span>0 Request</span>
          </div>
          <div className="content">
            <img src={images.noPendingMembers} alt="img" />
            <p className="caption">NO PENDING MEMBERS</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberRequest;
