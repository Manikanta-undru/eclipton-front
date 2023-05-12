import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../globalFunctions';
import SocialActivities from '../../components/Menu/SocialActivities';
import SavedGroups from '../../components/SavedGroups/index';
import FriendsFollowerSummary from '../../components/FriendsFollower/index';

import InfiniteScroll from 'react-infinite-scroller';
import { alertBox } from '../../commonRedux';
import * as group from '../../http/group-calls';
import { connectSocket, getComments } from '../../hooks/socket';
import Images from '../../assets/images/images';
import Share from '../../components/Post/Share';
import { history } from '../../store';
import Alert from 'react-bootstrap/Alert';

//update post
import CreatePostgroup from '../../components/Post/CreatePostgroup';

import './style/viewgroup.scss';
import './style/viewgrp.scss';
import './style/event.scss';
import GroupSinglePost from '../../components/Post/GroupSinglePost';
import { Modal } from 'react-bootstrap';
import InviteFriends from './InviteFriends';

class TribesFeeds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsall: [],
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
      paymentDet: {},
      isload: false,
      limit: 10,
      page: 1,
      hasMore: false,
      postSubRes: false,
      showModal: false,
    };
    this.postSubmit = this.postSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    this.getMemStatus(this.props.match.params.id);
    this.getSocketComment();

    group.followercount().then((res) => {
      var result_follow = res[0];
      var followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
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

    group
      .particularGroups({ group_id: this.props.match.params.id })
      .then((res) => {
        if (res.message == 'sucess' || res.message == undefined) {
          this.setState({
            groupdetails: res,
          });
        } else {
          alertBox(true, res.message, 'Error');
        }
      });

    // check payment success and subscruption end date for paid groups
    this.getPosts();

    group.getEvents({ records: 2 }).then(
      (res) => {
        this.setState({
          events_data: res,
        });
      },
      (err) => {
        alertBox(true, 'something went error', 'Error');
      }
    );

    //like count api
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.posts !== this.state.posts ||
      prevState.postSubRes !== this.state.postSubRes
    ) {
      this.setState({ posts: this.state.posts });
    }
  }

  getSocketComment() {
    getComments((request) => {
      console.log(request, 'socketss data');
      this.setState({ socketcomment: request });
    });
  }
  handleInviteClick = () => {
    this.setState({ showModal: true });
  };

  getMemStatus = (groupid) => {
    // alert(groupid);
    var d = {};
    d['group_id'] = this.props.match.params.id;
    // check the group payment status and member status
    group.findGroups(d).then((res) => {
      this.setState({ paymentDet: res, isload: true });
      // var payment_date = res.payment_date
      // console.log(payment_date,"payment_dadte")
      // if (payment_date != undefined) {
      //   var current_date = new Date().toISOString().split('T')[0];
      //   var payment_dates = new Date(payment_date).toISOString().split('T')[0];
      //   var state_payment = new Date(payment_date).toISOString().split('T')[0];
      //   if (payment_dates < current_date && res.payment_status == "fail" || res.auto_payment_status == "fail") {
      //     this.setState({
      //       group_access: false,
      //       last_payment_date: Date.parse(state_payment)
      //     })
      //     // alertBox(true, "Error access to group");
      //   }
      // }else{
      //   var current_date = new Date().toISOString().split('T')[0];
      //   var payment_dates = new Date(res.createdAt).toISOString().split('T')[0];
      //   var state_payment = new Date(res.createdAt).toISOString().split('T')[0];
      //   if (payment_dates < current_date) {
      //     this.setState({
      //       group_access: false,
      //       last_payment_date: Date.parse(state_payment)
      //     })
      //     // alertBox(true, "Error access to group");
      //   }
      // }
    });
  };

  changeTab = (newValue, post_id) => {
    this.setState({ currentTab: newValue, currentpostid: post_id });
    if (newValue == 1) {
      this.allComments(post_id);
    }
  };

  handlewishlist = (post_id, group_id) => {
    // alert(post_id);
    var d = {};
    d['post_id'] = post_id;
    d['userid'] = this.props.currentUser._id;
    d['group_id'] = group_id;
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

  handlehide = (post_id, hide_status) => {
    var d = {};
    d['post_id'] = post_id;
    d['hide'] = hide_status;
    d['userid'] = this.props.currentUser._id;
    group.hideposts(d).then((result) => {
      if (result.message == 'success') {
        alertBox(true, 'Successfully hide post', 'success');
      } else if (result.message == 'error' && result.errors != undefined) {
        alertBox(true, result.errors, 'Error');
      } else {
        alertBox(true, 'Error hide post', 'Error');
      }
      window.location.href = '/viewgroup/' + this.props.match.params.id;
    });
  };

  handlepublish = (grop_id) => {
    var d = {};
    d['group_id'] = grop_id;
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
    var gropid = this.props.match.params.id;
    var memberid = this.props.currentUser._id;
    var d = {};
    d['user_id'] = memberid;
    d['group_id'] = gropid;
    d['leaveGroup'] = 1;
    group.ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else {
          if (res.message == 'success') {
            alertBox(true, 'Successfully left from group', 'Success');
            setTimeout(() => {
              window.location.href = '/membergroups';
            }, 3000);
          } else {
            alertBox(true, res.message, 'Error');
          }
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
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

  getPosts = () => {
    var d = {};
    d['group_id'] = this.props.match.params.id;
    d['page'] = this.state.page;
    d['limit'] = this.state.limit;
    group.getPostsTribes(d).then(
      (res) => {
        if (res.posts.length > 0) {
          let uniqueItems = [];
          console.log(res.posts, 'afrer');
          const hasMore = res.posts.length > 0 ? true : false;
          if (this.state.postSubRes == true) {
            this.setState({ postSubRes: false });
            uniqueItems = res.posts;
          } else {
            var mergedArray = [...this.state.posts, ...res.posts];
            console.log(mergedArray, 'testss');
            uniqueItems = Object.values(
              mergedArray.reduce((acc, item) => {
                acc[item._id] = item;
                return acc;
              }, {})
            );
          }
          this.setState({
            posts: uniqueItems,
            hasMore, // update hasMore based on API response
          });
        } else {
          this.setState({
            hasMore: false,
          });
        }
      },
      (err) => {
        this.setState({
          hasMore: false,
        });
      }
    );
  };

  fetchMoreData = () => {
    console.log('testss');
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          page: prevState.page + 1,
        };
      },
      () => this.getPosts()
    );
  };

  postSubmit = (msg) => {
    if (msg == true) {
      this.setState({ postSubRes: true, page: 1 });
      this.getPosts();
    }
  };

  render() {
    let commentsget = [];
    if (this.state.socketcomment != '') {
      commentsget = this.state.socketcomment.commentdet;
    } else {
      commentsget = this.state.groupcomments;
    }

    const extend_payment_status = this.state.paymentDet.extend_payment_status;
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
              (window.location.href = '/events/' + events.group_id)
            }
          >
            Interested
          </button>
        </div>
      </div>
    ));

    return (
      <>
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          backdropClassName="custom-backdrop"
          style={{ zIndex: 9999 }}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <InviteFriends groupid={this.props.match.params.id} />
          </Modal.Body>
        </Modal>
        <div className="viewUserGroupActivity viewEditGroupModerator onlinePersonalEvents">
          {extend_payment_status == 'Overdue' ? (
            <div className="container my-wall-container">
              <div className="col-sm empty-container-with-out-border center-column">
                <Alert variant="danger">
                  <Alert.Heading>Payment Overdue!</Alert.Heading>
                  <p>
                    Payment was Overdue, Please
                    <Alert.Link
                      href={'/settings/' + this.props.match.params.id}
                    >
                      {' '}
                      Clik here to pay{' '}
                    </Alert.Link>{' '}
                    and renewal the group
                  </p>
                </Alert>
              </div>
            </div>
          ) : null}

          {extend_payment_status === undefined && this.state.isload == true ? (
            <div className="container my-wall-container">
              <div className="row mt-2">
                <div className="col-sm empty-container-with-out-border left-column">
                  {/* <WalletBalanceWidget  {...props} current="/" /> */}
                  <SocialActivities group_id={this.props.match.params.id} />
                  {this.state.groupdetails.userid ==
                  this.props.currentUser._id ? (
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
                            See More <i className="fa fa-caret-down"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <div className="col-sm empty-container-with-out-border center-column">
                  {/* due date extend give the alert */}

                  {this.state.groupStatus == 'blocked' ? (
                    <div className="profileArea personaliseAreaWrapper danger">
                      <p style={{ 'text-align': 'center', color: 'red' }}>
                        You are Blocked from this group contact group admin
                      </p>
                    </div>
                  ) : (
                    ''
                  )}

                  {this.state.groupStatus == 'active' && (
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
                            onClick={(e) =>
                              this.sharePost(this.state.groupdetails)
                            }
                          >
                            <img src={Images.shareIcon} alt="shareIcon" />
                            <span> SHARE</span>
                          </div>

                          <div onClick={this.handleInviteClick}>
                            <img src={Images.invite} alt="shareIcon" />
                            <span> INVITE FRIENDS</span>
                          </div>

                          {/* <div>
                    <img src={Images.dollar} alt="shareIcon" />
                    <span> Paid</span>
                  </div> */}
                          <div className="rightArea">
                            <div className="dropdown">
                              {this.state.groupdetails.userid !=
                                this.props.currentUser._id &&
                              this.state.this_session_mem_grp[
                                this.state.groupdetails._id
                              ] == 'Joined' ? (
                                <>
                                  <button
                                    className="primaryBtn dropdown-toggle mt-2"
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
                                      (window.location.href =
                                        `${process.env.REACT_APP_FRONTEND}groupsettings/` +
                                        this.state.groupdetails._id)
                                    }
                                  >
                                    <span className="m-1">
                                      Edit Group Settings
                                    </span>
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
                                  this.handlepublish(
                                    this.state.groupdetails._id
                                  )
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
                        <CreatePostgroup
                          setState={this.setStateFunc}
                          {...this.props}
                          group_id={this.props.match.params.id}
                          OnPostCrdStatus={this.postSubmit}
                        />
                      ) : (
                        ''
                      )}
                      <br />
                      {this.state.events_data.length > 0 ? (
                        <div className="eventsOverallAreaWrapper">
                          <a
                            onClick={(e) =>
                              (window.location.href =
                                '/events/' + this.props.match.params.id)
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

                      {this.state.paymentDet.due_payment_status == 'Overdue' ? (
                        <Alert variant="warning" dismissible>
                          <Alert.Heading>Payment Overdue!</Alert.Heading>
                          <p>
                            Payment was Overdue Your payment is{' '}
                            {formatDate(this.state.paymentDet.due_payment_date)}
                            , Please
                            <Alert.Link
                              href={'/settings/' + this.props.match.params.id}
                            >
                              {' '}
                              Clik here to pay{' '}
                            </Alert.Link>{' '}
                            and renewal the group,
                          </p>
                          <hr />
                          <p className="mb-0">
                            Now we are extended your payment date{' '}
                            <b>
                              {formatDate(
                                this.state.paymentDet.extend_date_to_pay
                              )}
                            </b>
                            , if you lost to pay the amount, this group
                            activites are goes to disable
                          </p>
                        </Alert>
                      ) : null}

                      {/* Group post display  */}
                      <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        // dataLength={this.state.posts.length}
                        loadMore={this.fetchMoreData}
                        hasMore={this.state.hasMore}
                      >
                        {this.state.posts.map((post, i) => (
                          <GroupSinglePost
                            post={post}
                            posts={this.state.posts}
                            page="groupfeed"
                            currentUser={this.props.currentUser}
                            OnPostCrdStatus={this.postSubmit}
                            key={i}
                          />
                        ))}
                      </InfiniteScroll>
                    </>
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
                  {/* <GroupWidget follower={this.state.follower} joinedusers={this.state.this_session_mem_grp} /> */}
                  {/* <PopularArticles /> */}
                  {/* <button onClick={testJob}> test</button> */}
                </div>
                {/* <!-- end right column --> */}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default TribesFeeds;
