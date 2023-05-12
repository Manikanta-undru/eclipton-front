import React from 'react';

import { profilePic } from '../../globalFunctions';
import SocialActivities from '../../components/Menu/SocialActivities';
import SavedGroups from '../../components/SavedGroups/index';
import GroupWidget from '../../components/GroupWidget/index';
import FriendsFollowerSummary from '../../components/FriendsFollower/index';
import { alertBox } from '../../commonRedux';
import {
  createPost,
  getPosts,
  allPostLikes,
  likeAdd,
  findGroups,
} from '../../http/group-calls';
import { LikeReceived, connectSocket } from '../../hooks/socket';
import Images from '../../assets/images/images';

import './viewgroup.scss';

class ViewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      image: '',
      video: '',
      visible: true,
      posts: [],
      particularpost: [],
      particularuserpost: [],
      group_access: true,
    };
  }

  componentDidMount() {
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    this.likes();

    const diffDays = (date, otherDate) =>
      Math.ceil(Math.abs(date - otherDate) / 86400000);
    const diffMintues = (date, otherDate) =>
      Math.floor((Math.abs(date - otherDate) % 86400000) / 3600000);

    // check payment success and subscruption end date for paid groups

    this.chckSub(this.props.match.params.id);

    // Example
    const da = diffDays(new Date('2022-01-28T11:42:15.856Z'), new Date());
    const minutes = diffMintues(
      new Date('2022-01-28T11:42:15.856Z'),
      new Date()
    );
    const d = {};
    d.group_id = this.props.match.params.id;
    getPosts(d).then(
      (res) => {
        const postdata = [];
        res.map((data) => {
          if (
            data.groupspost.userid != this.props.currentUser._id &&
            data.groupspost.visiblity == 'true'
          ) {
            postdata.push(data);
          } else if (data.groupspost.userid == this.props.currentUser._id) {
            postdata.push(data);
          }
        });
        this.setState({
          posts: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    // like count api
    this.allPostLike();
  }

  componentDidUpdate() {
    // this.allPostLike();
    this.likes();
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
    findGroups(d).then((res) => {
      const { payment_date } = res;
      const current_date = Date.now();
      const payment_dates = Date.parse(payment_date);
      if (
        (payment_dates < current_date && res.payment_status == 'fail') ||
        res.auto_payment_status == 'fail'
      ) {
        this.setState({
          group_access: false,
        });
        alertBox(true, 'Error access to group');
      }
    });
  };

  allPostLike = (d = {}) => {
    d.group_id = this.props.match.params.id;
    const particularpost = [];
    const particularuserpost = [];
    allPostLikes(d).then((result) => {
      const countdetail = result.likecount;
      const userdetail = result.usercount;

      if (countdetail.length > 0 && userdetail.length > 0) {
        countdetail.map((item, i) => {
          particularpost.push(item[this.props.match.params.id]);
        });
        userdetail.map((item, i) => {
          particularuserpost.push(item[this.props.match.params.id]);
        });
        // this.setState({
        //   particularpost:particularpost[0],
        //   particularuserpost:particularuserpost[0]
        // })
      }
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

  handleLike = (post_id) => {
    const d = {};
    d.post_id = post_id;
    d.group_id = this.props.match.params.id;
    likeAdd(d).then((result) => {
      if (result._id != undefined) {
        this.setState({
          particularpost: this.state.particularpost[post_id] + 1,
        });
        // this.likes();
        alertBox(true, 'Successfully liked post', 'success');

        // window.location.href="/viewgroup/"+this.props.match.params.id;
      } else if (result.message != '') {
        alertBox(true, result.message);
      } else {
        alertBox(true, 'Error liked post');
      }
    });
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
      createPost(formData).then(
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

  render() {
    const postdata = this.state.posts.map((postdatas, index) => (
      <>
        {this.props.currentUser._id != postdatas.groupspost.userid &&
        postdatas.groupspost.visiblity == 'false' ? (
          <div className="post" style={{ display: 'none' }} key={index}>
            <div className="header">
              <div className="leftArea">
                <img
                  className="profile-icon"
                  src={profilePic(postdatas.usersdata.avatar)}
                  alt="profile-icon"
                />
                <div className="profileDetails">
                  <span className="name">
                    {postdatas.usersdata.name} -{' '}
                    {postdatas.groupspost.visiblity}
                  </span>
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
                    {this.props.currentUser._id == postdatas.usersdata._id ? (
                      <>
                        <a className="dropdown-item">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/edit-icon.png')}
                          />
                          <span className="m-1">Edit</span>
                        </a>
                        <a className="dropdown-item">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/save-icon.png')}
                          />
                          <span className="m-1">Hide</span>
                        </a>
                      </>
                    ) : (
                      ''
                    )}
                    <a className="dropdown-item">
                      <img
                        className="mr-1"
                        src={require('../../assets/images/save-icon.png')}
                      />
                      <span className="m-1">Save</span>
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

              <span>10 Shares</span>
              <span>5 Comments</span>
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
        ) : (
          <div className="post">
            <div className="header">
              <div className="leftArea">
                <img
                  className="profile-icon"
                  src={profilePic(postdatas.usersdata.avatar)}
                  alt="profile-icon"
                />
                <div className="profileDetails">
                  <span className="name">
                    {postdatas.usersdata.name}- {postdatas.groupspost._id}
                  </span>
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
                    {this.props.currentUser._id == postdatas.usersdata._id ? (
                      <>
                        <a className="dropdown-item">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/edit-icon.png')}
                          />
                          <span className="m-1">Edit</span>
                        </a>
                        <a className="dropdown-item">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/save-icon.png')}
                          />
                          <span className="m-1">Hide</span>
                        </a>
                      </>
                    ) : (
                      ''
                    )}
                    <a className="dropdown-item">
                      <img
                        className="mr-1"
                        src={require('../../assets/images/save-icon.png')}
                      />
                      <span className="m-1">Save</span>
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
              <span>10 Shares</span>
              <span>5 Comments</span>
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
        )}
      </>
    ));

    return (
      <div className="viewUserGroupActivity">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <WalletBalanceWidget  {...props} current="/" /> */}
              <SocialActivities />
            </div>

            <div className="col-sm empty-container-with-out-border center-column">
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
                        {this.state.visible == true ? 'Visiblity' : 'Hidden'}
                      </span>
                      <button onClick={(e) => this.submit(e, 0)}>Post</button>
                    </div>
                  </div>
                </div>
              </form>

              {this.state.posts.length > 0 &&
              this.state.group_access == true ? (
                postdata
              ) : (
                <div className="post">
                  <div className="header">
                    <p>No posts Found</p>
                  </div>
                </div>
              )}
            </div>

            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}

            <div className="col-sm empty-container-with-out-border right-column">
              <FriendsFollowerSummary />
              <SavedGroups />
              <GroupWidget />
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
