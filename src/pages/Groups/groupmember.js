import React from 'react';
import { Link } from 'react-router-dom';
import { profilePic } from '../../globalFunctions';

import { alertBox } from '../../commonRedux';
import './style/groupmember.scss';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';
import {
  getGroupMember,
  getPositions,
  ChangeMemberStatus,
  particularGroups,
} from '../../http/group-calls';

import RewardsWidget from '../../components/RewardsWidget';

class GroupMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsall: [],
      followerss: [],
      groupmembers: [],
      balance: [],
      managegrop: [],
      workpositions: [],
      groupcount: [],
      groupStatus: 'active',
      groupsdata: [],
    };
  }

  componentDidMount() {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    const Grps = [];
    getPositions().then((res) => {
      let ii = 0;
      res.map((item, index) => {
        Grps[item.userId] = {
          position: item.designation,
          location: item.country,
        };
        ii++;
      });
      this.setState({
        workpositions: Grps,
      });
    });
    this.getAllmember();

    particularGroups(d).then(
      (res) => {
        this.setState({
          groupsdata: res,
        });
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  }

  handleadmin = (memberid) => {
    const gropid = this.props.match.params.id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(true, 'Successfully set the moderator', 'Success');
          // this.props.history("/groupmembers/" + this.props.match.params.id)
          // window.location.href = "/groupmembers/" + this.props.match.params.id;
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err.data.message, 'Error');
      }
    );
  };

  handleBlock = (memberid) => {
    const gropid = this.props.match.params.id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    d.block = 1;
    ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(true, 'Successfully blocked', 'Success');
          setTimeout(() => {
            window.location.href = '';
          }, 3000);
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err.data.message, 'Error');
      }
    );
  };

  handleReadmin = (memberid) => {
    const gropid = this.props.match.params.id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    d.unset = 1;
    ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(
            true,
            'Successfully Remove this member in moderator',
            'Success'
          );
          window.location.href = `/groupmembers/${this.props.match.params.id}`;
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err.data.message, 'Error');
      }
    );
  };

  handleReBlock = (memberid) => {
    const gropid = this.props.match.params.id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    d.unsetblock = 1;
    ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(
            true,
            'Successfully Remove the member from block',
            'Success'
          );
          setTimeout(() => {
            window.location.href = '';
          }, 3000);
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err.data.message, 'Error');
      }
    );
  };

  getAllmember() {
    const dataupdate = [];
    const dataupdates = [];
    getGroupMember().then((res) => {
      let ii = 0;
      let i = 0;
      res.map((item, index) => {
        let work_pos;
        let work_loc;
        if (
          this.props.match.params.id == item._id &&
          item.groupsMembers.memberstatus != 'left'
        ) {
          if (
            this.state.workpositions[item.groupsMembers.userid] != undefined
          ) {
            const positions =
              this.state.workpositions[item.groupsMembers.userid];
            work_pos = positions.position;
            work_loc = positions.location;
          } else {
            work_pos = '-';
            work_loc = '';
          }
          dataupdate[ii] = {
            groupuserid: item.userid,
            member_status: item.groupsMembers.memberstatus,
            member_pos: item.groupsMembers.position,
            grop_admin: item.userid,
            userid: item.groupsMembers.userid,
            name: item.usersdata.name,
            avatar: item.usersdata.avatar,
            groupid: item.groupsMembers.group_id,
            work_post: work_pos,
            work_loc,
          };
          ii++;
        }
        if (this.props.match.params.id == item._id) {
          if (item.groupsMembers.memberstatus != 'blocked') {
            const count = i + 1;
            dataupdates[0] = { count, groupuserid: item.userid };
            i++;
          }
          if (dataupdates.length == 0) {
            dataupdates[0] = { count: 0, groupuserid: item.userid };
          }
        }

        if (
          this.props.match.params.id == item._id &&
          this.props.currentUser._id != item.groupsMembers.userid &&
          item.groupsMembers.memberstatus != 'left'
        ) {
          const status = item.groupsMembers.memberstatus;
          if (status == 'blocked') {
            this.setState({
              groupStatus: status,
            });
          } else {
            this.setState({
              groupStatus: 'active',
            });
          }
        } else {
          this.setState({
            groupStatus: 'active',
          });
        }
      });
      this.setState({
        groupmembers: dataupdate,
        groupcount: dataupdates[0],
      });
    });
  }

  render() {
    const { currentTab } = { ...this.state };
    const userall = this.state.groupmembers.map((groupsdata, index) => (
      <>
        {(groupsdata.member_status != 'blocked' &&
          groupsdata.member_status != 'left') ||
        groupsdata.groupuserid == this.props.currentUser._id ? (
          <>
            {groupsdata.avatar != undefined ? (
              <img src={profilePic(groupsdata.avatar)} alt="img" key={index} />
            ) : (
              <img src={profilePic()} alt="img" />
            )}
          </>
        ) : (
          ''
        )}
      </>
    ));

    const memberList = this.state.groupmembers.map((groupsdata, index) => (
      <>
        {(groupsdata.member_status != 'blocked' &&
          groupsdata.member_status != 'left') ||
        groupsdata.groupuserid == this.props.currentUser._id ? (
          <div className="membersCard" key={index}>
            <div className="profileImg">
              {groupsdata.avatar != undefined ? (
                <img src={profilePic(groupsdata.avatar)} alt="img" />
              ) : (
                <img src={profilePic()} alt="img" />
              )}
            </div>
            <div className="Details">
              <span className="name">
                {groupsdata.name}{' '}
                {this.props.currentUser._id == groupsdata.userid ? (
                  <span className="status"> - You </span>
                ) : (
                  ''
                )}
              </span>
              <div className="position">
                <span>
                  {groupsdata.work_post}. {groupsdata.work_loc}
                </span>
              </div>
              {groupsdata.member_pos == 'moderator' ? (
                <span className="role">Moderator</span>
              ) : (
                ''
              )}

              {groupsdata.member_status == 'blocked' &&
              groupsdata.groupuserid == this.props.currentUser._id ? (
                <span className="status">Blocked</span>
              ) : (
                ''
              )}
            </div>
            <div className="action">
              <li className="list-group-item p-1 pr-2 pointer  dropdown">
                <img src={images.MoreDetails} alt="dots" />
                <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                  {/* <a className="dropdown-item">
                                <span className="m-1">Message</span>
                            </a> */}
                  <a href="" className="dropdown-item">
                    <span className="m-1">View Profile</span>
                  </a>
                  {groupsdata.grop_admin == this.props.currentUser._id ? (
                    <>
                      {groupsdata.member_pos == 'moderator' ? (
                        <a
                          href="javascript:void(0)"
                          onClick={(e) => this.handleReadmin(groupsdata.userid)}
                          className="dropdown-item"
                        >
                          <span className="m-1">Remove from Moderator</span>
                        </a>
                      ) : (
                        <a
                          href="javascript:void(0)"
                          onClick={(e) => this.handleadmin(groupsdata.userid)}
                          className="dropdown-item"
                        >
                          <span className="m-1">Set Moderator</span>
                        </a>
                      )}

                      {groupsdata.member_status == 'blocked' ? (
                        <a
                          className="dropdown-item red"
                          onClick={(e) => this.handleReBlock(groupsdata.userid)}
                        >
                          <span className="m-1">UnBlock</span>
                        </a>
                      ) : (
                        <a
                          className="dropdown-item red"
                          onClick={(e) => this.handleBlock(groupsdata.userid)}
                        >
                          <span className="m-1">Block</span>
                        </a>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </li>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    ));

    return (
      console.log(this.state.groupcount, 'groupcount'),
      (
        <div className="viewMembersTotalWrapper">
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
          />
          <div className="container my-wall-container ">
            <div className="row mt-2">
              {/* <!-- left column --> */}
              <div className="col-sm empty-container-with-out-border left-column">
                <SocialActivities
                  group_id={this.props.match.params.id}
                  user_id={this.props.currentUser._id}
                />
                <div className="groupAreaWrapper">
                  <div className="group">
                    <div className="groupImg">
                      <img src={this.state.groupsdata.banner} alt="img" />
                    </div>
                    <span className="groupName">
                      {this.state.groupsdata.name}
                    </span>
                    <div className="groupAccessType">
                      <img src={images.locked} alt="locked" />
                      <span>{this.state.groupsdata.privacy} Group</span>
                    </div>
                    <span className="groupDescription">
                      {this.state.groupsdata.description}
                    </span>
                    <div className="float-right">
                      <Link className="float-right">
                        See More <i className="fa fa-caret-down" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- end left column --> */}

              {/* <!-- center column --> */}

              <div className="col-sm empty-container-with-out-border center-column">
                {this.state.groupStatus == 'blocked' ? (
                  <div className="membersOverallAreaWrapper">
                    <br />
                    <p style={{ 'text-align': 'center', color: 'red' }}>
                      You are Blocked from this group contact group admin
                    </p>
                    <br />
                  </div>
                ) : (
                  ''
                )}
                {this.state.groupStatus == 'active' ? (
                  <div className="membersOverallAreaWrapper">
                    <div className="header">
                      <div className="leftArea">
                        <div>
                          <span>Group Members</span>
                        </div>
                      </div>
                    </div>
                    <div className="hLine" />
                    <div className="membersAreaWrapper">
                      <div className="topArea">
                        <div className="left">
                          <div className="members">{userall}</div>
                          <div className="count">
                            {this.state.groupcount != undefined ? (
                              this.state.groupcount.length > 0 &&
                              this.state.groupcount.groupuserid ==
                                this.props.currentUser._id ? (
                                <>
                                  {this.state.groupmembers.length > 1000 ? (
                                    <span>
                                      + {this.state.groupmembers.length}
                                      <br />K Members
                                    </span>
                                  ) : (
                                    <span>
                                      {' '}
                                      + {this.state.groupmembers.length}
                                      <br /> Members
                                    </span>
                                  )}{' '}
                                </>
                              ) : (
                                <>
                                  {this.state.groupcount.count > 1000 ? (
                                    <span>
                                      + {this.state.groupcount.count}
                                      <br />K Members
                                    </span>
                                  ) : (
                                    <span>
                                      {' '}
                                      + {this.state.groupcount.count}
                                      <br /> Members
                                    </span>
                                  )}{' '}
                                </>
                              )
                            ) : (
                              <div>No Members Found</div>
                            )}
                          </div>
                        </div>
                        <div className="right">
                          <img src={images.search} alt="search" />
                          <input type="text" placeholder="Invite Members" />
                        </div>
                      </div>
                      <div className="bottomArea">{memberList}</div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              {/* <!-- end center column --> */}

              {/* <!--  right column --> */}
              <div className="col-sm empty-container-with-out-border right-column">
                <RewardsWidget {...this.props} />
              </div>
              {/* <!-- end right column --> */}
            </div>
          </div>
        </div>
      )
    );
  }
}

export default GroupMembers;
