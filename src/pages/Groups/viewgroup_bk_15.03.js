import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { formatDate } from '../../globalFunctions';
import SocialActivities from '../../components/Menu/SocialActivities';
import SavedGroups from '../../components/SavedGroups/index';
import GroupWidget from '../../components/GroupWidget/index';
import FriendsFollowerSummary from '../../components/FriendsFollower/index';
import { alertBox } from '../../commonRedux';
import * as group from '../../http/group-calls';
import { LikeReceived, connectSocket, getComments } from '../../hooks/socket';
import Images from '../../assets/images/images';
import Postgroup from '../../components/Post/PostGroup';
import Share from '../../components/Post/Share';
import { history } from '../../store';

import './style/viewgroup.scss';
import './style/viewgrp.scss';
import './style/event.scss';

class ViewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsall: [],
      message: '',
      image: '',
      video: '',
      visible: true,
      posts: [],
      events_data: [],
      particularpost: [],
      particularuserpost: [],
      group_access: true,
      last_payment_date: '',
      groupdetails: [],
      groupmembers: [],
      this_session_mem_grp: [],
      saveGroups: [],
      follower: [],
      groupStatus: 'active',
      memberpos: '',
      userjoinids: [],
      currentTab: 0,
      currentpostid: '',
      comments: '',
      groupcomments: [],
      replyid: 0,
      currentreplypost: '',
      currentreplycomment: '',
      socketcomment: [],
    };
  }

  componentDidMount() {
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    this.likes();
    this.chckSub(this.props.match.params.id);
    this.getAllmember();
    this.getallgroups();
    this.getSocketComment();

    group.followercount().then((res) => {
      const ress = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(ress)) {
        // console.log(`${key}: ${value.count}`);
        followresult[key] = value;
      }
      this.setState({
        follower: followresult,
      });
    });

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

    // check payment success and subscruption end date for paid groups
    const d = {};
    d.group_id = this.props.match.params.id;

    group.getPosts(d).then(
      (res) => {
        console.log(res.data, 'res.data');
        if (res.message == 'success') {
          this.setState({
            posts: res.data,
          });
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );

    d.records = 2;
    group.getEvents(d).then(
      (res) => {
        this.setState({
          events_data: res,
        });
      },
      (err) => {
        alertBox(true, 'something went error', 'Error');
      }
    );

    // like count api
    this.allPostLike();

    group.particularGroups(d).then((res) => {
      // connectSocket({userid:this.props.currentUser._id,roomname:res.name});
      if (res.message == 'sucess' || res.message == undefined) {
        this.setState({
          groupdetails: res,
        });
      } else {
        alertBox(true, res.message, 'Error');
      }
    });
  }

  getallgroups(data = {}) {
    const d = data;
    d.perpage = 2;
    d.limit = 2;
    d.page = 1;
    d.show = 'visible';
    d.userid = this.props.currentUser._id;
    d.shownType = 'left';

    group.getallgroup(d).then(
      (resp) => {
        this.setState({
          groupsall: resp.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

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
            member_status: item.groupsMembers.memberstatus,
          };
          Grp[item.groupsMembers.group_id] = 'Joined';
          members[ii] = item.groupsMembers.group_id;
          ii++;
        }
        if (this.props.match.params.id == item._id) {
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
        }

        if (
          this.props.match.params.id == item._id ||
          this.props.currentUser._id == item.groupsMembers.userid
        ) {
          if (
            this.props.currentUser._id == item.userid ||
            item.groupsMembers.position == 'moderator'
          ) {
            this.setState({
              memberpos: 'active',
            });
          }
        }
      });
      allmemGrp.push(dataupdate);

      this.setState({
        groupmembers: allmemGrp[0],
        this_session_mem_grp: Grp,
        userjoinids: members,
      });
      // this.Dynamic();
    });
  }

  getSocketComment() {
    getComments((request) => {
      console.log(request, 'socketss data');
      this.setState({ socketcomment: request });
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

  chckSub = (groupid) => {
    // alert(groupid);
    const d = {};
    d.group_id = this.props.match.params.id;
    group.findGroups(d).then((res) => {
      const { payment_date } = res;
      if (payment_date != undefined) {
        const current_date = new Date().toISOString().split('T')[0];
        const payment_dates = new Date(payment_date)
          .toISOString()
          .split('T')[0];
        const state_payment = new Date(payment_date)
          .toISOString()
          .split('T')[0];
        if (
          (payment_dates < current_date && res.payment_status == 'fail') ||
          res.auto_payment_status == 'fail'
        ) {
          this.setState({
            group_access: false,
            last_payment_date: Date.parse(state_payment),
          });
          // alertBox(true, "Error access to group");
        }
      }
    });
  };

  allPostLike = (d = {}) => {
    d.group_id = this.props.match.params.id;
    const particularpost = [];
    const particularuserpost = [];
    group.allPostLikes(d).then((result) => {
      const countdetail = result.likecount;
      const userdetail = result.usercount;
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

  allComments = (post_id) => {
    const d = {};
    d.post_id = post_id;
    d.group_id = this.props.match.params.id;
    group.groupComments(d).then((result) => {
      // console.log(result,"allComments");
      this.setState({ groupcomments: result });
    });
  };

  handleGroup = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  handleImage = (event) => {
    this.setState({
      image: event.target.files[0],
    });
  };

  handleVideo = (event) => {
    this.setState({
      video: event.target.files[0],
    });
  };

  changeTab = (newValue, post_id) => {
    this.setState({ currentTab: newValue, currentpostid: post_id });
    if (newValue == 1) {
      this.allComments(post_id);
    }
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  handleVisiblity = (event) => {
    const visibility = this.state.visible != true;
    this.setState({
      visible: visibility,
    });
  };

  datediffer = (date1) => {
    const dates = new Date(date1);
    const date2 = new Date();
    const diffMs = date2 - dates;
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    // console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes)");
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

  handlewishlist = (post_id, group_id) => {
    // alert(post_id);
    const d = {};
    d.post_id = post_id;
    d.userid = this.props.currentUser._id;
    d.group_id = group_id;
    group.saveposts(d).then((result) => {
      // console.log(result, "post_save")
      if (result.message == 'success') {
        alertBox(true, 'Successfully saved post', 'success');
      } else if (result.message == 'Already this post was saved') {
        alertBox(true, result.message, 'Error');
      } else {
        alertBox(true, 'Error saved post', 'Error');
      }
    });
  };

  handleLike = (post_id) => {
    const d = {};
    d.post_id = post_id;
    d.group_id = this.props.match.params.id;
    group.likeAdd(d).then((result) => {
      // console.log(result, "result");
      if (result._id != undefined) {
        this.setState({
          particularpost: this.state.particularpost[post_id] + 1,
        });
        this.likes();
        alertBox(true, 'Successfully liked post', 'success');

        // window.location.href="/viewgroup/"+this.props.match.params.id;
      } else if (result.message != '') {
        alertBox(true, result.message);
      } else {
        alertBox(true, 'Error liked post');
      }
    });
  };

  handlehide = (post_id, hide_status) => {
    const d = {};
    d.post_id = post_id;
    d.hide = hide_status;
    d.userid = this.props.currentUser._id;
    group.hideposts(d).then((result) => {
      if (result.message == 'success') {
        alertBox(true, 'Successfully hide post', 'success');
      } else if (result.message == 'error' && result.errors != undefined) {
        alertBox(true, result.errors, 'Error');
      } else {
        alertBox(true, 'Error hide post', 'Error');
      }
      window.location.href = `/viewgroup/${this.props.match.params.id}`;
    });
  };

  handlepublish = (grop_id) => {
    const d = {};
    d.group_id = grop_id;
    group.publishGroup(d).then((result) => {
      console.log(result);
      window.location.href = '/mygroup';
      if (result.message == 'success') {
        alertBox(true, 'Successfully publish the group', 'success');
      } else {
        alertBox(true, 'Error publish the group', 'Error');
      }
    });
  };

  handleLeaveGroup = (grop_id) => {
    const gropid = this.props.match.params.id;
    const memberid = this.props.currentUser._id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    d.leaveGroup = 1;
    group.ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(true, 'Successfully left from group', 'Success');
          setTimeout(() => {
            window.location.href = '/membergroups';
          }, 3000);
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  };

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];

    if (
      this.state.message == '' &&
      this.state.image == '' &&
      this.state.video == ''
    ) {
      err.push('Post content is required');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('message', this.state.message);
      if (this.state.image != '') {
        formData.append('image', this.state.image);
      }
      if (this.state.video != '') {
        formData.append('video', this.state.video);
      }
      formData.append('group_id', this.props.match.params.id);
      formData.append('visibility', this.state.visible);
      group.createPost(formData).then(
        async (resp) => {
          alertBox(true, 'Successfully posted', 'success');
          this.setState({
            message: '',
            image: '',
            video: '',
          });
          window.location.href = `/viewgroup/${this.props.match.params.id}`;
          // this.props.history.push("/viewgroup/"+this.props.match.params.id)
        },
        (error) => {
          alertBox(true, 'Error created post');
        }
      );
    }
  };

  handleComment = async (e, t, post_id, group_id) => {
    e.preventDefault();
    console.log(this.state.comments, 'comments');
    console.log(post_id, group_id, 'test');
    const d = {};
    d.message = this.state.comments;
    d.post_id = post_id;
    d.group_id = group_id;
    if (
      this.state.currentreplypost != '' &&
      this.state.currentreplycomment != ''
    ) {
      d.comment_id = this.state.currentreplycomment;
    }
    group.SendComments(d).then(
      async (resp) => {
        this.setState({ comments: '' });
      },
      (error) => {
        alertBox(true, 'Error send Comment');
      }
    );
  };

  handleMessage = (e) => {
    this.setState({ comments: e.target.value });
  };

  handlelike_cmt = (post_id, comment_id, likecount) => {
    const d = {};
    d.post_id = post_id;
    d.comment_id = comment_id;
    d.group_id = this.props.match.params.id;
    group.UpdatelikeComments(d).then(
      async (resp) => {},
      (error) => {
        alertBox(true, 'Error send Comment');
      }
    );
  };

  handleReply = (e, post_id, comment_id) => {
    console.log(post_id, comment_id, 'lll');
    this.setState({
      currentreplypost: post_id,
      currentreplycomment: comment_id,
    });
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
    let commentsget;
    if (this.state.socketcomment != '') {
      commentsget = this.state.socketcomment.commentdet;
    } else {
      commentsget = this.state.groupcomments;
    }

    const events = this.state.events_data.map((events, index) => (
      <div className="event" key={index}>
        <div className="image">
          <img src={events.banner} alt="eventImg" />
        </div>
        <div className="details">
          <div>
            <span className="eventName">{events.name}</span>
            <span className="time">{formatDate(events.startDate)}</span>
          </div>
          <span className="interested">845 interested</span>
        </div>
        <div className="btn-Interested">
          <button
            onClick={(e) =>
              (window.location.href = `/events/${events.group_id}`)
            }
          >
            Interested
          </button>
        </div>
      </div>
    ));

    return (
      <div className="viewUserGroupActivity viewEditGroupModerator onlinePersonalEvents">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <WalletBalanceWidget  {...props} current="/" /> */}
              <SocialActivities group_id={this.props.match.params.id} />
              {this.state.groupdetails.userid == this.props.currentUser._id ? (
                <div className="groupAreaWrapper">
                  <div className="group">
                    <span className="groupName">
                      {this.state.groupdetails.name}
                    </span>
                    <div className="groupAccessType">
                      <img src={Images.locked} alt="locked" />
                      <span>{this.state.groupdetails.privacy} Group</span>
                    </div>
                    <span className="groupDescription">
                      {this.state.groupdetails.description}
                    </span>
                    <div className="float-right">
                      <Link className="float-right">
                        See More <i className="fa fa-caret-down" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.groupStatus == 'blocked' ? (
                <div className="profileArea personaliseAreaWrapper danger">
                  <p style={{ 'text-align': 'center', color: 'red' }}>
                    You are Blocked from this group contact group admin
                  </p>
                </div>
              ) : (
                ''
              )}

              {this.state.groupStatus == 'active' ? (
                <>
                  <div className="profileArea personaliseAreaWrapper">
                    <div className="cover">
                      <img
                        className="coverImg"
                        src={this.state.groupdetails.banner}
                        alt="img-cover"
                        style={{ height: '200px', width: '765px' }}
                      />
                    </div>

                    {this.state.shareModel && (
                      <Share
                        sharedtype="group"
                        post={this.state.currPost}
                        shareSuccess={this.shareSuccess}
                        closeShareModal={this.closeShareModal}
                      />
                    )}

                    <div className="actionArea">
                      <div
                        onClick={(e) => this.sharePost(this.state.groupdetails)}
                      >
                        <img src={Images.shareIcon} alt="shareIcon" />
                        <span> SHARE</span>
                      </div>

                      <div>
                        <img src={Images.invite} alt="shareIcon" />
                        <span> INVITE FRIENDS</span>
                      </div>
                      <div>
                        <img src={Images.dollar} alt="shareIcon" />
                        <span> Paid</span>
                      </div>
                      <div className="rightArea">
                        <div className="dropdown">
                          {this.state.groupdetails.userid !=
                            this.props.currentUser._id &&
                          this.state.this_session_mem_grp[
                            this.state.groupdetails._id
                          ] == 'Joined' ? (
                            <>
                              <button
                                className="dropdown-toggle mt-2"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Joined
                              </button>
                              <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <a
                                  className="dropdown-item"
                                  href="javascript:void(0)"
                                  onClick={(e) =>
                                    this.handleLeaveGroup(
                                      this.state.groupdetails._id
                                    )
                                  }
                                >
                                  Leave Group
                                </a>
                              </div>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                        {this.state.groupdetails.userid ==
                        this.props.currentUser._id ? (
                          <li className="list-group-item p-1 pr-2 pointer  dropdown">
                            <img
                              className="mt-1"
                              src={Images.moreDetailsRounded}
                              alt="more"
                            />
                            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                              <a
                                className="dropdown-item"
                                onClick={(e) =>
                                  (window.location.href = `${process.env.REACT_APP_FRONTEND}groupsettings/${this.state.groupdetails._id}`)
                                }
                              >
                                <span className="m-1">Edit Group Settings</span>
                              </a>
                            </div>
                          </li>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    {this.state.groupdetails.hidegroup == 'hidden' &&
                    this.state.groupdetails.userid ==
                      this.props.currentUser._id ? (
                      <>
                        <br />
                        <br />{' '}
                        <p style={{ color: 'red' }}>
                          Groups are saved in Draft mode{' '}
                          <a
                            href="javascript:void(0)"
                            onClick={(e) =>
                              this.handlepublish(this.state.groupdetails._id)
                            }
                          >
                            click here
                          </a>{' '}
                          to publish
                        </p>{' '}
                        <br />
                        <br />{' '}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  <br />

                  {this.state.groupdetails.post_permission == 'any' ||
                  this.state.memberpos == 'active' ||
                  this.state.groupdetails.userid ==
                    this.props.currentUser._id ? (
                    <form onSubmit={(e) => this.submit(e, 1)} method="post">
                      <div className="CreateNewPostArea">
                        <div className="textArea">
                          <textarea
                            placeholder="Text here"
                            cols="100"
                            onChange={this.handleGroup}
                          >
                            {this.state.message}
                          </textarea>
                        </div>
                        <div className="line" />
                        <div className="toolsArea">
                          <div className="left-section">
                            <input
                              type="file"
                              id="camera"
                              name="image"
                              onChange={this.handleImage}
                              className="d-none"
                            />
                            <input
                              type="file"
                              id="video"
                              name="video"
                              onChange={this.handleVideo}
                              className="d-none"
                            />

                            <label htmlFor="camera">
                              <img src={Images.camera} alt="camera" />
                            </label>
                            <label htmlFor="video">
                              <img src={Images.video} alt="video" />
                            </label>

                            <div className="connection">Tag Connection</div>
                          </div>
                          <div className="right-section">
                            {this.state.visible == true ? (
                              <img
                                src={Images.eye}
                                alt="eye"
                                onClick={(e) => this.handleVisiblity()}
                              />
                            ) : (
                              <img
                                src={Images.hideeye}
                                alt="eye"
                                onClick={(e) => this.handleVisiblity()}
                              />
                            )}

                            <span onClick={(e) => this.handleVisiblity()}>
                              {this.state.visible == true
                                ? 'Visiblity'
                                : 'Hidden'}
                            </span>
                            <button onClick={(e) => this.submit(e, 0)}>
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    ''
                  )}
                  <br />
                  {this.state.events_data.length > 0 ? (
                    <div className="eventsOverallAreaWrapper">
                      <a
                        onClick={(e) =>
                          (window.location.href = `/events/${this.props.match.params.id}`)
                        }
                        className="rightArea moresec"
                        style={{
                          position: 'relative',
                          right: '17px',
                          top: '5px',
                        }}
                      >
                        More
                      </a>

                      <div className="eventsAreaWrapper eventdisplay">
                        {events}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {this.state.posts.length > 0 ? (
                    <InfiniteScroll pageStart={0}>
                      {this.state.posts.map((post, i) => (
                        <Postgroup
                          post={post}
                          group_id={this.props.match.params.id}
                          groupcomments={this.state.groupcomments}
                          commentsget={commentsget}
                          currentUser={this.props.currentUser}
                          last_payment_date={this.state.last_payment_date}
                          particularpost={this.state.particularpost}
                          particularuserpost={this.state.particularuserpost}
                          changeTab={this.changeTab}
                          key={i}
                        />
                      ))}
                    </InfiniteScroll>
                  ) : (
                    <div className="post">
                      <div className="header">
                        <p>No posts Found</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                ''
              )}
            </div>

            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}

            <div className="col-sm empty-container-with-out-border right-column">
              <FriendsFollowerSummary />
              <SavedGroups
                saveGroups={this.state.saveGroups}
                group_id={this.props.match.params.id}
                follower={this.state.follower}
              />
              <GroupWidget
                follower={this.state.follower}
                groupsall={this.state.groupsall}
                joinedusers={this.state.this_session_mem_grp}
              />
              {/* <PopularArticles /> */}
              {/* <button onClick={testJob}> test</button> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewGroup;
