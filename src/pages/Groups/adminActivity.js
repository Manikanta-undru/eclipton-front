import React from 'react';
import { profilePic } from '../../globalFunctions';
import { alertBox } from '../../commonRedux';
import * as group from '../../http/group-calls';
import { LikeReceived, connectSocket, getComments } from '../../hooks/socket';
import Images from '../../assets/images/images';
import './style/adminact.scss';

import './style/viewgroup.scss';
import './style/viewgrp.scss';
import './style/event.scss';

class ViewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      image: '',
      video: '',
      visible: true,
      posts: [],
      filter_post: [],
      events_data: [],
      particularpost: [],
      particularuserpost: [],
      group_access: true,
      last_payment_date: '',
      groupdetails: [],
      groupmembers: [],
      this_session_mem_grp: [],
      groupStatus: 'active',
      memberpos: '',
      userjoinids: [],
      filters: '',
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
    this.getSocketComment();
    this.chckSub(this.props.group_id);
    const d = {};
    d.group_id = this.props.group_id;
    d.page = 1;
    d.limit = 5;
    group.getPosts(d).then(
      (res) => {
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

    // like count api
    this.allPostLike();
    group.particularGroups(d).then((res) => {
      if (res.message == 'sucess' || res.message == undefined) {
        this.setState({
          groupdetails: res,
        });
      } else {
        alertBox(true, res.message, 'Error');
      }
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
          particularpost.push(item[this.props.group_id]);
        });
        userdetail.map((item, i) => {
          particularuserpost.push(item[this.props.group_id]);
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
    d.group_id = this.props.group_id;
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
        console.log(payment_date, current_date, payment_dates);
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
    d.group_id = this.props.group_id;
    const particularpost = [];
    const particularuserpost = [];
    group.allPostLikes(d).then((result) => {
      const countdetail = result.likecount;
      const userdetail = result.usercount;
      if (countdetail.length > 0 && userdetail.length > 0) {
        countdetail.map((item, i) => {
          particularpost.push(item[this.props.group_id]);
        });
        userdetail.map((item, i) => {
          particularuserpost.push(item[this.props.group_id]);
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
    d.group_id = this.props.group_id;
    group.groupComments(d).then((result) => {
      // console.log(result,"allComments");
      this.setState({ groupcomments: result });
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
    const d = {};
    d.post_id = post_id;
    d.userid = this.props.currentUser._id;
    d.group_id = group_id;
    group.saveposts(d).then((result) => {
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
    d.group_id = this.props.group_id;
    group.likeAdd(d).then((result) => {
      if (result._id != undefined) {
        this.setState({
          particularpost: this.state.particularpost[post_id] + 1,
        });
        alertBox(true, 'Successfully liked post', 'success');
      } else if (result.message != '') {
        alertBox(true, result.message);
      } else {
        alertBox(true, 'Error liked post');
      }
    });
  };

  handleDate = (e) => {
    const postData = this.state.posts;
    const searchdate = e.target.value;
    if (searchdate != '') {
      this.setState({
        filters: 'active',
        filter_post: [],
      });
      const postfilter = [];
      postData.map((items) => {
        const postdate = new Date(items.groupspost.createdAt)
          .toISOString()
          .split('T')[0];
        if (postdate == searchdate) {
          postfilter.push(items);
        }
        if (postfilter.length > 0) {
          this.setState({
            filter_post: postfilter,
            filters: '',
          });
        }
      });
    } else {
      this.setState({
        filter_post: [],
        filters: '',
      });
    }
  };

  handledelete = (post_id) => {
    const d = {};
    d.post_id = post_id;
    d.delete_status = 1;
    d.userid = this.props.currentUser._id;
    group.deletePost(d).then((result) => {
      if (result.message == 'success') {
        alertBox(true, 'Successfully delete the post', 'success');
      } else if (result.message == 'error' && result.errors != undefined) {
        alertBox(true, result.errors, 'Error');
      } else {
        alertBox(true, 'Error delete post', 'Error');
      }
      window.location.href = `/settings/${this.props.group_id}`;
    });
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

  getSocketComment() {
    getComments((request) => {
      console.log(request, 'socketss data');
      this.setState({ socketcomment: request });
    });
  }

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

  render() {
    const { filter_post, posts, filters } = { ...this.state };
    console.log(filter_post.length, filters);
    let commentsget;
    if (this.state.socketcomment != '') {
      commentsget = this.state.socketcomment.commentdet;
    } else {
      commentsget = this.state.groupcomments;
    }
    const comments = commentsget.map((comments, index) => (
      <>
        {this.state.currentpostid == comments.gropcomments.post_id ? (
          <>
            <div className="comment" key={index}>
              {comments.gropcomments.userid == this.props.currentUser._id ? (
                <>
                  <div>
                    <img
                      className="profile-img"
                      src={comments.usersdata.avatar}
                      alt="profileIcon"
                    />
                  </div>
                  <div className="comment-Text">
                    <div className="leftArea">
                      <span className="name">{comments.usersdata.name}</span>
                      {/* <span className="position">
                    Consultant at Google .Inc
                  </span> */}
                      <span className="content">
                        {comments.gropcomments.comment_user != undefined ? (
                          <b>@{comments.gropcomments.comment_user} &nbsp; </b>
                        ) : (
                          ''
                        )}
                        {comments.gropcomments.message}
                      </span>
                      <div className="actionIcons">
                        {/* <span onClick={(e) => this.handlelike_cmt(comments.gropcomments.post_id,comments.gropcomments._id,comments.gropcomments.likecount)}>
                      <img src={Images.likeIcon} alt="likeIcon" />
                      <span>{comments.gropcomments.likecount}</span>
                    </span> */}
                        <span
                          onClick={(e) =>
                            this.handleReply(
                              this.myInp.focus(),
                              comments.gropcomments.post_id,
                              comments.gropcomments._id
                            )
                          }
                        >
                          <img src={Images.commentIcon} alt="commentIcon" />
                          REPLY
                        </span>
                      </div>
                    </div>
                    <div className="rightArea">
                      <span>
                        {this.datediffer(comments.gropcomments.createdAt)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            {comments.gropcomments.userid != this.props.currentUser._id ? (
              <div className="reply">
                <div className="reply-img">
                  <img
                    className="profile-img"
                    src={comments.usersdata.avatar}
                    alt="profileIcon"
                  />
                </div>
                <div className="comment-Text">
                  <div className="leftArea">
                    <span className="name">{comments.usersdata.name}</span>
                    {/* <span className="position">
                      Consultant at Google .Inc
                    </span> */}
                    <span className="content">
                      {comments.gropcomments.comment_user != undefined ? (
                        <b>@{comments.gropcomments.comment_user} &nbsp; </b>
                      ) : (
                        ''
                      )}
                      {comments.gropcomments.message}
                    </span>
                    <div className="actionIcons">
                      {/* <span onClick={(e) => this.handlelike_cmt(comments.gropcomments.post_id,comments.gropcomments._id,comments.gropcomments.likecount)}>

                        <img src={Images.likeIcon} alt="likeIcon" />
                        <span>{comments.gropcomments.likecount}</span>
                      </span> */}
                      <span
                        onClick={(e) =>
                          this.handleReply(
                            this.myInp.focus(),
                            comments.gropcomments.post_id,
                            comments.gropcomments._id
                          )
                        }
                      >
                        {' '}
                        <img src={Images.commentIcon} alt="comment-icon" />{' '}
                        REPLY
                      </span>
                    </div>
                  </div>
                  <div className="rightArea">
                    <span>
                      {this.datediffer(comments.gropcomments.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}{' '}
          </>
        ) : (
          ''
        )}
      </>
    ));

    const commentcount = this.state.groupcomments.map((comm, index) => (
      <>
        {this.state.groupcomments.length > 2 &&
        this.state.currentpostid == comm.gropcomments.post_id &&
        index + 1 == this.state.groupcomments.length ? (
          <div className="moreComments" key={index}>
            <span>{this.state.groupcomments.length - 2} more comments</span>
          </div>
        ) : (
          ''
        )}
      </>
    ));
    let view_data;
    if (filter_post.length > 0 || filters == 'active') {
      view_data = filter_post;
    } else {
      view_data = posts;
    }
    const postdata = view_data.map((postdatas, index) => (
      <>
        {!(
          postdatas.groupspost.visiblity == 'false' ||
          Date.parse(new Date().toISOString().split('T')[0]) <
            Date.parse(
              new Date(postdatas.groupspost.createdAt)
                .toISOString()
                .split('T')[0]
            )
        ) ? (
          <div className="post" key={index}>
            <div className="header">
              <div className="leftArea">
                <img
                  className="profile-icon"
                  src={profilePic(postdatas.usersdata.avatar)}
                  alt="profile-icon"
                />
                <div className="profileDetails">
                  <span className="name">{postdatas.usersdata.name}</span>
                  {/* <span className="time">Just now</span> */}
                  <span className="time">
                    {this.datediffer(postdatas.groupspost.createdAt)}
                  </span>
                </div>
              </div>
              <div className="rightArea">
                <li className="list-group-item p-1 pr-2 pointer  dropdown">
                  <i className="fa fa-ellipsis-h" />
                  <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                    <a
                      className="dropdown-item"
                      onClick={() =>
                        this.handledelete(postdatas.groupspost._id)
                      }
                    >
                      <img
                        className="mr-1"
                        src={require('../../assets/images/remove-icon.png')}
                      />
                      <span className="m-1">Delete</span>
                    </a>
                  </div>
                </li>
              </div>
            </div>
            <div className="post-description">
              <p>{postdatas.groupspost.message}</p>
            </div>
            {postdatas.groupspost.attachment != '' &&
            postdatas.groupspost.types == 'Video' ? (
              <div className="postContent">
                <video width="700" controls>
                  <source
                    src={postdatas.groupspost.attachment}
                    type="video/mp4"
                  />
                </video>
              </div>
            ) : (
              ''
            )}
            {postdatas.groupspost.attachment != '' &&
            postdatas.groupspost.types == 'Image' ? (
              <div className="postContent">
                <img
                  src={postdatas.groupspost.attachment}
                  alt="post"
                  height="500"
                />
              </div>
            ) : (
              ''
            )}

            <div className="shareDetails">
              {this.state.particularpost[postdatas.groupspost._id] ? (
                <span>
                  {this.state.particularpost[postdatas.groupspost._id]} Likes
                </span>
              ) : (
                <span>0 Likes</span>
              )}

              {/* <span>10 Shares</span> */}
              {this.state.currentpostid == postdatas.groupspost._id ? (
                <span>{this.state.groupcomments.length}Comments</span>
              ) : (
                <span>Comments</span>
              )}
            </div>
            <div className="line" />
            <div className="actionButtons">
              <div className="action">
                <img src={Images.likeIcon} alt="like" />
                {this.state.particularuserpost[postdatas.groupspost._id] ==
                this.props.currentUser._id ? (
                  <span>You</span>
                ) : (
                  <span
                    onClick={(e) => this.handleLike(postdatas.groupspost._id)}
                  >
                    Like
                  </span>
                )}
                {/* <span>Like</span> */}
              </div>
              {/* <div className="action">
            <img src={Images.shareIcon} alt="like" />
            <span>SHARE</span>
          </div> */}
              <div className="action">
                <img src={Images.commentIcon} alt="like" />
                <span
                  onClick={(e) => this.changeTab(1, postdatas.groupspost._id)}
                >
                  COMMENT
                </span>
              </div>
            </div>
            <div className="line" />
            {this.state.currentTab == 1 &&
            this.state.currentpostid == postdatas.groupspost._id ? (
              <div className="replySection">
                {comments}

                <form
                  onSubmit={(e) =>
                    this.handleComment(
                      e,
                      1,
                      postdatas.groupspost._id,
                      this.props.match.params.id
                    )
                  }
                  method="post"
                  autoComplete="off"
                >
                  <div className="writeAComment">
                    <img
                      src={profilePic(this.props.currentUser.avatar)}
                      alt="img"
                    />
                    <input
                      type="text"
                      placeholder="Write a comment"
                      ref={(comment) => (this.myInp = comment)}
                      name="comment"
                      value={this.state.comments}
                      onChange={(e) => this.handleMessage(e)}
                    />
                  </div>
                </form>
                {commentcount}
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </>
    ));
    return (
      <div className="viewUserGroupActivity viewEditGroupModerator onlinePersonalEvents ">
        <div className="adminActivityWrapper">
          <br />
          <br />
          <div className="adminHeader">
            <div className="top header">
              <span style={{ 'font-size': '17px', 'font-weight': '600' }}>
                Admin Activity
              </span>
              <input
                type="date"
                className="form-control"
                placeholder="Search by date"
                onChange={(e) => this.handleDate(e)}
                style={{
                  float: 'right',
                  width: '200px',
                  border: '1px solid #5832e0',
                }}
              />
              <br />
              <br />

              <div
                className="hLine"
                style={{ 'border-bottom': '1px solid #e5e5e5', height: '10px' }}
              />

              {view_data.length > 0 ? (
                postdata
              ) : (
                <div className="post">
                  <div className="header">
                    <p>No posts Found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewGroup;
