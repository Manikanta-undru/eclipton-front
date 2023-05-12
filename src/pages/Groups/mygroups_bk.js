import React from 'react';
import { Link } from 'react-router-dom';
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import { profilePic } from '../../globalFunctions';
import { Memberget, PostCount } from '../../GroupFunctions';
import { alertBox } from '../../commonRedux';
import Images from '../../assets/images/images';
import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import { LikeReceived } from '../../hooks/socket';
import * as group from '../../http/group-calls';
import Filteredgroup from './filteredgroup';
import Share from '../../components/Post/Share';
import { history } from '../../store';

import './style/mygroups.scss';

class Mygroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      currentdata: '',
      limit: 4,
      page: 1,
      perpage: 4,
      filter: 0,
      managegrop: [],
      usergroups: [],
      manageusergrp: [],
      mygroupsall: [],
      data: {},
      followerss: [],
      filterdata: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
      groupscategory: [],
      saveposts: [],
      particularpost: [],
      particularuserpost: [],
      saveGroups: [],
      groupmembers: [],
      this_session_mem_grp: [],
      allmemberCnt: 0,
      postcounts: [],
      groupsall: [],
    };
  }

  componentDidMount() {
    const dataa = {};
    const d = dataa;
    this.setState({ currentData: this.props.match.params.id });
    if (this.props.match.params.id == 'all') {
      d._id = this.props.currentUser._id;
    } else {
      d.page = this.state.page;
      d.perpage = 4;
      d.limit = this.state.limit;
      d._id = this.props.currentUser._id;
    }
    this.likes();
    this.getAllmember();
    group.mygroups(d).then(
      (res) => {
        this.setState({
          managegrop: res.data,
          usergroups: res.data,
        });
        const usergroup = res.data;
        let count = 1;
        let allmem = 0;
        usergroup.map((items) => {
          Memberget(items._id, this.props.currentUser._id).then((members) => {
            allmem += members.member.length;
            if (usergroup.length == count) {
              this.setState({ allmemberCnt: allmem });
            }
            count++;
          });
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getallgroup().then(
      (resp) => {
        const datas = resp.data;

        this.setState({
          groupsall: datas,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
        followresult[key] = value;
      }
      this.setState({
        followerss: followresult,
      });
    });
    group.joinedgroups(d).then(
      (res) => {
        this.setState({
          manageusergrp: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getSavepost().then(
      (res) => {
        this.setState({
          saveposts: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getSaveGroups().then(
      (res) => {
        this.setState({
          saveGroups: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getGpCategory().then(
      (resp) => {
        if (resp.message == 'success' && resp.status == 200) {
          this.setState({
            groupscategory: resp.data,
          });
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    PostCount().then((res) => {
      console.log(res.postdatas[0], 'res');
      this.setState({ postcounts: res.postdatas });
      console.log(this.state.postcounts, 'postcount');
    });
  }

  dataChange = (data = {}) => {
    console.log(data, 'data', Object.keys(data).length);
    if (Object.keys(data).length > 0) {
      if (
        (data.category != undefined &&
          data.search != '' &&
          data.sub != undefined &&
          data.location != '' &&
          data.value != '') ||
        data.search != '' ||
        data.category != undefined ||
        data.sub != undefined ||
        data.location != '' ||
        data.value != ''
      ) {
        this.setState({
          current: '',
          data,
          filter: 1,
        });
      } else {
        this.setState({
          current: '',
          data,
          filter: 0,
        });
      }
    } else {
      this.setState({
        current: '',
        data,
        filter: 0,
      });
    }
  };

  getAllmember() {
    const allmemGrp = [];
    const members = [];
    const dataupdate = [];
    const Grp = [];
    group.getGroupMember().then((res) => {
      let ii = 0;
      res.map((item, index) => {
        if (this.props.currentUser._id == item.groupsMembers.userid) {
          dataupdate[ii] = {
            userid: item.groupsMembers.userid,
            groupid: item.groupsMembers.group_id,
          };
          Grp[item.groupsMembers.group_id] = 'Joined';
          ii++;
        }
      });

      allmemGrp.push(dataupdate);

      this.setState({
        groupmembers: allmemGrp[0],
        this_session_mem_grp: Grp,
      });
      // this.Dynamic();
    });
  }

  likes = () => {
    LikeReceived((request) => {
      const particularpost = [];
      const particularuserpost = [];
      const countdetail = request.likecount;
      const userdetail = request.usercount;
      if (countdetail.length > 0 && userdetail.length > 0) {
        countdetail.map((item, i) => {
          particularpost.push(item[this.props.match.params.id]);
        });
        userdetail.map((item, i) => {
          particularuserpost.push(item[this.props.match.params.id]);
        });
        this.setState({
          particularpost: particularpost[0],
          particularuserpost: particularuserpost[0],
        });
      }
    });
  };

  datediffer = (date1) => {
    const dates = new Date(date1);
    const date2 = new Date();
    const diffMs = date2 - dates;
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    // var convert = [];
    // convert.push({"days":diffDays,"hours":diffHrs,"mint":diffMins})
    if (diffDays > 0) {
      return `${diffDays} days ago`;
    }
    if (diffHrs > 1) {
      return `${diffHrs} hours ago`;
    }
    if (diffMins == '0') {
      return 'Just now';
    }
    return `${diffMins} minutes ago`;
  };

  handleJoin = (group_id) => {
    const d = {};
    d.group_id = group_id;
    group.particularGroups(d).then((res) => {
      if (res) {
        if (res.purchase_type == 'free') {
          group.JoinMember(d).then((JoinResult) => {
            if (JoinResult.message == 'success') {
              alertBox(true, 'Successfully Joined Group', 'success');
              window.location.href = `/viewgroup/${group_id}`;
            } else if (JoinResult.message != '') {
              alertBox(true, JoinResult.message);
            } else {
              alertBox(true, 'Error! Joined Group');
            }
          });
        } else {
          const isExecuted = window.confirm(
            'Are you sure to auto detect balance?'
          );
          if (isExecuted == true) {
            if (res.payment_type == 'recurrence') {
              d.payment_type = 'recurrence';
              d.recurrence_type = res.recurrence_type;
            } else {
              d.payment_type = '1time';
            }
            // check balance
            this.state.balance.map((item) => {
              if (item.currencySymbol == res.currency) {
                const get_balance = item.balance;
                if (get_balance < res.amount) {
                  alertBox(true, 'Error! Insuffcient balance in your account');
                } else {
                  group.JoinMember(d).then((JoinResult) => {
                    console.log(JoinResult, 'JoinResult');
                    if (JoinResult.message == 'success') {
                      alertBox(true, 'Successfully Joined Group', 'success');
                      window.location.href = `/viewgroup/${group_id}`;
                    } else if (JoinResult.message != '') {
                      alertBox(true, JoinResult.message);
                    } else {
                      alertBox(true, 'Error! Joined Group');
                    }
                  });
                }
              }
            });
          }
        }
      }
    });
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  handlePopupOpenClose = (event) => {
    this.props.history.push('/group');
  };

  handleallgroups = (event) => {
    this.props.history.push('/mygroup/all');
  };

  handleGroups = (group_id) => {
    this.props.history.push(`/viewgroup/${group_id}`);
  };

  sharePost = (groups) => {
    this.setState({ shareModel: true, currPost: groups });
  };

  shareSuccess = () => {
    alertBox(true, 'Group Shared Successfully!', 'success');
    history.push('/home');
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  render() {
    const { currentTab } = { ...this.state };
    console.log(this.state.postcount, 'his.state.postcount');

    const Grups = this.state.usergroups.map((groups, index) => (
      <div className="groupBlog" key={index}>
        <img src={groups.banner} alt="img" style={{ width: 100 }} />
        <div className="rightArea">
          <p onClick={() => this.handleGroups(groups._id)}>{groups.name}</p>
          <div className="dp-flex">
            <div>
              <ul>
                {this.state.followerss[groups._id] ? (
                  <li>{this.state.followerss[groups._id]} followers</li>
                ) : (
                  <li>0 followers</li>
                )}
                <li>
                  {this.state.postcounts[0] != undefined
                    ? this.state.postcounts[0][groups._id]
                    : 0}{' '}
                  post /day
                </li>
              </ul>
            </div>
          </div>
          <div className="dp-flex">
            <div onClick={(e) => this.sharePost(groups)}>
              <img src={Images.shareIcon} alt="shareIcon" />
              <span className="shareText"> SHARE</span>
            </div>
            <span className="al-r freeText">
              {groups.purchase_type.toUpperCase()}{' '}
            </span>
          </div>
        </div>
      </div>
    ));

    const Grupsall = this.state.usergroups.map((groups, index) => (
      <div className="groupBlog" key={index}>
        <img src={groups.banner} alt="img" style={{ width: 100 }} />
        <div className="rightArea">
          <p onClick={() => this.handleGroups(groups._id)}>{groups.name}</p>
          <div className="dp-flex">
            <div>
              <ul>
                {this.state.followerss[groups._id] ? (
                  <li>{this.state.followerss[groups._id]} followers</li>
                ) : (
                  <li>0 followers</li>
                )}
                <li>
                  {this.state.postcounts[0] != undefined
                    ? this.state.postcounts[0][groups._id]
                    : 0}{' '}
                  post /day
                </li>
              </ul>
            </div>
          </div>
          <div className="dp-flex">
            <div onClick={(e) => this.sharePost(groups)}>
              <img src={Images.shareIcon} alt="shareIcon" />
              <span className="shareText"> SHARE</span>
            </div>
            <span className="al-r freeText">
              {groups.purchase_type.toUpperCase()}{' '}
            </span>
          </div>
        </div>
      </div>
    ));

    const Savepost = this.state.saveposts.map((groups, index) => (
      <div className="post" key={index}>
        <div className="header">
          <div className="leftArea">
            <img
              className="profile-icon"
              src={profilePic(
                groups.GPusersdata.avatar,
                groups.GPusersdata.name
              )}
              alt="profile-icon"
            />
            <div className="profileDetails">
              <span className="name">
                {groups.groupsdata.name} - {groups.GPusersdata.name}
              </span>
              {/* <span className="time">Just now</span> */}
              <span className="time">
                {this.datediffer(groups.postdata.createdAt)}
              </span>
            </div>
          </div>
          {/* <div className="rightArea">
            <li className="list-group-item p-1 pr-2 pointer  dropdown">
              <i className="fa fa-ellipsis-h"></i>
              <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                {
                  this.props.currentUser._id == groups.usersdata._id ?
                    <>
                      <a className="dropdown-item">
                        <img
                          className="mr-1"
                          src={require("../../assets/images/edit-icon.png")}
                        />
                        <span className="m-1">Edit</span>
                      </a>
                      <a className="dropdown-item">
                        <img
                          className="mr-1"
                          src={require("../../assets/images/save-icon.png")}
                        />
                        <span className="m-1">Hide</span>
                      </a></> : ""
                }
                {
                  (this.props.currentUser._id != groups.usersdata._id) ? <>
                   <a className="dropdown-item" onClick={() => this.handlewishlist(postdatas._id,postdatas.groupspost.group_id)}>
                  <img
                    className="mr-1"
                    src={require("../../assets/images/save-icon.png")}
                  />
                  <span className="m-1">Save</span>
                </a>
                  </> : ""
                }
               
              </div>
            </li>
          </div> */}
        </div>
        <div className="post-description">
          <p>{groups.postdata.message}</p>
        </div>
        {groups.postdata.attachment != '' &&
        groups.postdata.types == 'Video' ? (
          <div className="postContent">
            <video width="700" controls>
              <source src={groups.postdata.attachment} type="video/mp4" />
            </video>
          </div>
        ) : (
          ''
        )}
        {groups.postdata.attachment != '' &&
        groups.postdata.types == 'Image' ? (
          <div className="postContent">
            <img src={groups.postdata.attachment} alt="post" height="500" />
          </div>
        ) : (
          ''
        )}

        <div className="shareDetails">
          {this.state.particularpost[groups.postdata._id] ? (
            <span>{this.state.particularpost[groups.postdata._id]} Likes</span>
          ) : (
            <span>0 Likes</span>
          )}

          <span>10 Shares</span>
          <span>5 Comments</span>
        </div>
        <div className="line" />
        <div className="actionButtons">
          <div className="action">
            <img src={Images.likeIcon} alt="like" />
            {this.state.particularuserpost[groups.postdata._id] ==
            this.props.currentUser._id ? (
              <span>You</span>
            ) : (
              <span onClick={(e) => this.handleLike(groups.postdata._id)}>
                Like
              </span>
            )}
            {/* <span>Like</span> */}
          </div>
          <div className="action">
            <img src={Images.shareIcon} alt="like" />
            <span>SHARE</span>
          </div>
          <div className="action">
            <img src={Images.commentIcon} alt="like" />
            <span>COMMENT</span>
          </div>
        </div>
      </div>
    ));

    // wishlist_save

    const SavewishGroups = this.state.saveGroups.map((groups, index) => (
      <div className="groupBlog" key={index}>
        <img src={groups.groupdata.banner} alt="img" style={{ width: 100 }} />
        <div className="rightArea">
          <p onClick={() => this.handleGroups(groups.groupdata._id)}>
            {groups.groupdata.name}
          </p>
          <div className="dp-flex">
            <div>
              <ul>
                <li>0 followers</li>
                <li>10 post /day</li>
              </ul>
            </div>
            <span className="al-r freeText">
              {groups.groupdata.purchase_type.toUpperCase()}{' '}
            </span>
          </div>
          <div className="dp-flex">
            <div onClick={(e) => this.sharePost(groups)}>
              <img src={Images.shareIcon} alt="shareIcon" />
              <span className="shareText"> SHARE</span>
            </div>
            {this.state.this_session_mem_grp[groups.groupdata._id] ==
            'Joined' ? (
              <button className="al-r">Joined</button>
            ) : (
              ''
            )}

            {this.props.currentUser._id != groups.groupdata.userid &&
            this.state.this_session_mem_grp[groups.groupdata._id] !=
              'Joined' ? (
              <button
                className="al-r"
                onClick={(e) => this.handleJoin(groups.groupdata._id)}
              >
                Join
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    ));

    // Draft groups

    const DraftGroups = this.state.usergroups.map((groups, index) => (
      <>
        {groups.hidegroup == 'hidden' ? (
          <div className="groupBlog" key={index}>
            <img src={groups.banner} alt="img" style={{ width: 100 }} />
            <div className="rightArea">
              <p onClick={() => this.handleGroups(groups._id)}>{groups.name}</p>
              <div className="dp-flex">
                <div>
                  <ul>
                    <li>0 followers</li>
                    <li>10 post /day</li>
                  </ul>
                </div>
                <span className="al-r freeText">
                  {groups.purchase_type.toUpperCase()}{' '}
                </span>
              </div>
              <div className="dp-flex">
                <div onClick={(e) => this.sharePost(groups)}>
                  <img src={Images.shareIcon} alt="shareIcon" />
                  <span className="shareText"> SHARE</span>
                </div>

                <button
                  className="al-r"
                  onClick={(e) =>
                    (window.location.href = `group/edit/${groups._id}`)
                  }
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    ));
    return (
      <div className="registerUser">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GroupFilter
                dataChange={this.dataChange}
                groupscategory={this.state.groupscategory}
              />
              <ManageGroup userGroups={this.state.managegrop} />
              <MemberGroup usermanagegrp={this.state.manageusergrp} />
              {/* <AllSuggested /> */}
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.shareModel && (
                <Share
                  sharedtype="group"
                  post={this.state.currPost}
                  shareSuccess={this.shareSuccess}
                  closeShareModal={this.closeShareModal}
                />
              )}

              {this.state.filter == 1 ? (
                <Filteredgroup
                  filter={this.state.filter}
                  filtersearch={this.state.data}
                  groupsall={this.state.groupsall}
                />
              ) : (
                <>
                  {this.state.currentdata == 'all' && (
                    <div className="profileWrapper">
                      <div className="groupsContainer">
                        <div className="heading">
                          <div>
                            <p>My Groups</p>
                            <span>My Groups you might be interested in</span>
                          </div>
                        </div>
                        <div className="groupBlogArea">{Grupsall}</div>
                      </div>
                    </div>
                  )}

                  {this.state.currentdata !== 'all' && (
                    <>
                      <div className="profileWrapper">
                        <div className="profileSummary">
                          <span className="heading">My Profiles</span>
                          <div className="summary">
                            <div>
                              <span className="sum">
                                {this.state.usergroups.length}{' '}
                              </span>
                              <span>No of Groups</span>
                            </div>
                            <div>
                              {this.state.allmemberCnt > 1000 ? (
                                <span className="sum">
                                  {this.state.allmemberCnt} K
                                </span>
                              ) : (
                                <span className="sum">
                                  {this.state.allmemberCnt}
                                </span>
                              )}

                              <span> Members</span>
                            </div>
                          </div>
                        </div>
                        <div className="hLine" />

                        <div className="header">
                          <div className="leftArea">
                            <div
                              className={this.getSelectedTabClassName(0)}
                              onClick={() => this.changeTab(0)}
                            >
                              <span className="tabName">All</span>
                            </div>
                            <div
                              onClick={() => this.changeTab(1)}
                              className={this.getSelectedTabClassName(1)}
                            >
                              <span className="tabName">Wishlist</span>
                            </div>
                            <div
                              onClick={() => this.changeTab(3)}
                              className={this.getSelectedTabClassName(3)}
                            >
                              <span className="tabName">Draft</span>
                            </div>
                          </div>
                          <div className="rightArea">
                            <button
                              className="primaryBtn"
                              onClick={() => this.handlePopupOpenClose()}
                            >
                              Add Groups
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="hLine" />
                    </>
                  )}
                  <div className="groupsContainer">
                    <div className="heading">
                      <div>
                        {currentTab === 0 &&
                        this.state.currentdata !== 'all' ? (
                          <>
                            <p>My Groups</p>
                            <span>My Groups you might be interested in</span>
                          </>
                        ) : currentTab === 1 &&
                          this.state.currentdata !== 'all' ? (
                          <>
                            <p>Saved Groups</p>
                            <span>
                              Your wishlist and favourite Groups are here
                            </span>
                          </>
                        ) : (
                          <>
                            <p>Hide Groups</p>
                            <span>
                              You can edit and publish your hidden groups here
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        href="javascript:void(0)"
                        onClick={() => this.handleallgroups()}
                      >
                        See more
                      </Link>
                    </div>
                    <div className="groupBlogArea">
                      {currentTab === 0 &&
                      this.state.currentdata !== 'all' &&
                      this.state.usergroups.length > 0 ? (
                        Grups
                      ) : currentTab === 0 ? (
                        <p>No Groups Found</p>
                      ) : null}
                      {currentTab === 1 &&
                      this.state.currentdata !== 'all' &&
                      this.state.saveGroups.length > 0 ? (
                        SavewishGroups
                      ) : currentTab === 1 ? (
                        <p>No Groups Found</p>
                      ) : null}
                      {currentTab === 3 && this.state.currentdata !== 'all' ? (
                        DraftGroups
                      ) : currentTab === 3 ? (
                        <p>No Groups Found</p>
                      ) : null}
                    </div>
                  </div>
                  {/* {this.state.filter == 0 ? <AllGroups page="mygroup" currentUser={this.state.currentUser} postcount={this.state.postcounts} /> : <Filteredgroup filter={this.state.filter} filtersearch={this.state.data} groupsall={this.state.groupsall} />} */}

                  {/* {this.state.filter == 0 ? <CategoryGroups groupscategory={this.state.groupscategory} /> : ""} */}
                  {/* {this.state.filter == 0 ? <FriendsGroups currentUser={this.state.currentUser} /> : ""} */}
                  {/* {this.state.filter == 0 ? <PopularGroups currentUser={this.state.currentUser} postcount={this.state.postcounts} /> : ""} */}

                  {/* Pages section End */}
                </>
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
    );
  }
}

export default Mygroups;
