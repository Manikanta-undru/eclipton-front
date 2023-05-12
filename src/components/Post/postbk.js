import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';
import Dialog from '@material-ui/core/Dialog';
import Button from '../Button';
import Modal from '../Popup';
import {
  postReport,
  postUnReport,
  likePost,
  postComment,
  getComments,
  likeComment,
  replyComment,
  getReplyComments,
  removeComment,
} from '../../http/http-calls';
import {
  postSave,
  postUnSave,
  postHide,
  postUnHide,
  postHighlight,
  postUnHighlight,
  postRemove,
} from '../../http/post-calls';
import Share from './Share';
import { switchLoader, alertBox } from '../../commonRedux';
import A from '../A';
import { GetAssetImage, profilePic } from '../../globalFunctions';
// import { ReactTinyLink } from 'react-tiny-link'
import EditPost from './EditPost';
import Spinner from '../Spinner';
import SharedPostCard from '../Cards/SharedPostCard';

require('./styles.scss');

const reactStringReplace = require('react-string-replace');

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      last: null,
      content: '',
      reason: '',
      category: '',
      sharedContent: '',
      url: props.post.url,
      post: null,
      key: props.post._id,
      shareModel: false,
      currPost: {},
      playing: false,
      reportModal: false,
      modal: false,
      showComments: false,
      commentText: '',
      replyCmt: [],
    };
    // this.likePostFn = this.likePostFn.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.postActivityCount = this.postActivityCount.bind(this);
  }

  extractUrl = (text) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    return text.match(regex);
  };

  componentDidMount() {
    this.setState(
      {
        post: this.props.post,
      },
      () => {
        const { post } = this.state;
        if (
          this.props.single &&
          (post.userid == this.props.currentUser._id ||
            (post.settings[0] != undefined &&
              (post.settings[0].comments == 'Everyone' ||
                (post.settings[0].comments == 'Friends' &&
                  post.followings.length > 0))))
        ) {
          this.showComments(this.state.post._id);
        }
        this.processText();
      }
    );
  }

  processText = () => {
    if (
      this.state.post.text != undefined &&
      this.state.post.text != null &&
      this.state.post.text != ''
    ) {
      var { text } = this.state.post;
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      text = text.replace(
        /#[a-z]+/g,
        '<a target="_blank" href="/search?filter=posts&q=$&">$&</a>'
      );
      this.setState({
        content: text,
      });
    }
    if (
      this.state.post.sharedText != undefined &&
      this.state.post.sharedText != null &&
      this.state.post.sharedText != ''
    ) {
      text = this.state.post.sharedText;
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      text = text.replace(
        /#[a-z]+/g,
        '<a target="_blank" href="/search?filter=posts&q=$&">$&</a>'
      );
      this.setState({
        sharedContent: text,
      });
    }
  };

  // componentDidUpdate = (prev) => {

  // }

  postActivityCount = (activityType, action = 'add') => {
    const postObj = this.state.post;
    if (!postObj[activityType]) {
      postObj[activityType] = 0;
    }
    if (action == 'sub') {
      postObj[activityType] = postObj[activityType] - +1;
    } else {
      postObj[activityType] = postObj[activityType] + +1;
    }
    this.setState({ post: postObj });
  };

  commentActivityCount = (commentId, activityType, action = 'add') => {
    const { post } = this.state;
    const postObj = post.comment[commentId];
    if (!postObj[activityType]) {
      postObj[activityType] = 0;
    }
    if (action == 'sub') {
      postObj[activityType] = postObj[activityType] - +1;
    } else {
      postObj[activityType] = postObj[activityType] + +1;
    }
    post.comment[commentId] = postObj;
    this.setState({ post });
  };

  editPost = (post) => {
    this.setState({ modal: !this.state.modal }); // true/false toggle
  };

  reportModal = (
    type = null,
    data = null,
    key = null,
    comment = null,
    key2 = null
  ) => {
    if (type != null) {
      this.setState({
        lastType: type,
        lastData: data,
        lastKey: key,
        lastComment: comment,
        lastKey2: key2,
      });
    }
    this.setState({ reportModal: !this.state.reportModal }); // true/false toggle
  };

  commentLike = (key, postid, commentId) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    likeComment({ postid, commentId }, true).then(
      async (resp) => {
        if (resp.message == 'Like') {
          this.commentActivityCount(key, 'likesCount');
        } else if (resp.message == 'Dislike') {
          this.commentActivityCount(key, 'likesCount', 'sub');
        }
      },
      (error) => {}
    );
  };

  deleteComment = (type, postid, id) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    removeComment({ id }, true).then(
      async (resp) => {
        if (type == 'comment') {
          this.showComments(postid);
        } else {
          this.showCommentReplies(postid);
        }
        this.postActivityCount('cmtsCount', 'sub');
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  commentReply = (postid, commentId, comment, commentIndex, callBack) => {
    replyComment({ postid, commentId, comment }, true).then(
      async (resp) => {
        callBack(resp.comment, commentIndex);
      },
      (error) => {}
    );
  };

  savePost = (id) => {
    // modal(true, "sdf");
    postSave({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, saved: 1 } });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  unsavePost = (id) => {
    postUnSave({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, saved: 0 } });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  report = () => {
    if (this.state.category == '') {
      alertBox(true, 'You need to select a category');
    } else {
      const p = this.state.lastData;
      const t = this.state.lastType;
      const key = this.state.lastKey;
      const c = this.state.lastComment;
      const key2 = this.state.lastKey2;
      let link = '';
      if (t == 'comment') {
        link = p.text;
      } else if (t == 'reply') {
        link = p.text;
      } else {
        link = `post/${p._id}`;
      }
      postReport({
        id: p._id,
        type: t,
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          let temp = {};
          if (t == 'comment') {
            temp = this.state.post;
            temp.comment[key].reported = 1;
            this.setState({ post: temp, reportModal: false });
          } else if (t == 'reply') {
            temp = this.state.post;
            temp.comment[key2].replies[key].reported = 1;
            this.setState({ post: temp, reportModal: false });
          } else {
            this.setState({
              reportModal: false,
              post: { ...this.state.post, reported: 1 },
            });
          }
        },
        (error) => {
          alertBox(true, error.data.message);
          this.setState({ reportModal: false });
        }
      );
    }
  };

  unReport = (t, id, key = null, key2 = null) => {
    postUnReport({ id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        let temp = {};
        if (t == 'comment') {
          temp = this.state.post;
          temp.comment[key].reported = 0;
          this.setState({ post: temp });
        } else if (t == 'reply') {
          temp = this.state.post;
          temp.comment[key2].replies[key].reported = 0;
          this.setState({ post: temp });
        } else {
          this.setState({ post: { ...this.state.post, reported: 0 } });
        }
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  hidePost = (id) => {
    postHide({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, hidden: 1 } });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  unhidePost = (id) => {
    postUnHide({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, hidden: 0 } });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  // removePost = (id) => {
  //     postRemove({ postid: id })
  //     .then(async resp => {
  //         alertBox(true, resp.message, 'success');
  //         this.setState({ post: { ...this.state.post, removed: 1 } });
  //         switchLoader();
  //     }, error => {
  //         alertBox(true, error.data.message);
  //         switchLoader();
  //     });
  // };
  removePost = (id) => {
    this.setState({ last: id, open: true });
  };

  removePostConfirm = () => {
    const id = this.state.last;
    this.setState({ open: false, last: null });
    postRemove({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, removed: 1 } });
        switchLoader();
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  highlightPost = (id) => {
    postHighlight({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState(
          { post: { ...this.state.post, highlighted: 1 } },
          () => {}
        );
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  unHighlight = (id) => {
    postUnHighlight({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState(
          { post: { ...this.state.post, highlighted: 0 } },
          () => {}
        );
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  likePostFn = (postId, liked) => {
    this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    likePost({ postid: postId }, true).then(
      async (resp) => {
        if (resp.message == 'Like') {
          this.postActivityCount('likesCount');
        } else if (resp.message == 'Dislike') {
          this.postActivityCount('likesCount', 'sub');
        }
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  sharePost = (post) => {
    this.setState({ shareModel: true, currPost: post });
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  handleOnReady = () => setTimeout(() => this.setState({ playing: true }), 100);

  handleClose = () => this.setState({ open: !this.state.open });

  postCmt = (postid) => {
    switchLoader(true, 'Please wait. Commenting...');
    const obj = { postid, comment: this.state.commentText };
    postComment(obj).then(
      async (resp) => {
        this.postActivityCount('cmtsCount');
        const postObj = this.state.post;
        if (!postObj.comment) {
          postObj.comment = [];
        }
        postObj.comment.unshift(resp.comment);
        this.setState({ post: postObj, showComments: true, commentText: '' });
        switchLoader();
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  showComments = (postid) => {
    switchLoader(true, 'Please wait. Getting Comments...');
    getComments({ postid }, true).then(
      async (resp) => {
        switchLoader();
        this.setState({ post: { ...this.state.post, comment: resp } });
        this.setState({ showComments: true });
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  handleChange = (evt, index) => {
    const { name, value } = evt.target;
    if (evt.target.name != 'replyCmt') {
      this.setState({ [name]: value }, () => {});
    } else {
      this.setState(
        { [`${name}`]: { ...this.state.replyCmt, [index]: value } },
        () => {}
      );
    }
  };

  shareSuccess = () => {
    this.postActivityCount('shareCount');
  };

  showCommentReply = (commentId) => {
    const index = this.state.post.comment.findIndex(
      (el) => el._id === commentId
    );
    const tempPostData = this.state.post;
    tempPostData.comment[index].showReply = true;
    this.setState({ post: tempPostData });

    // this.setState({
    //     post: { comment: update(this.state.post.comment, { [index]: { showReply: { $set: true } } }) }
    // }, () => {
    // });
  };

  updatePost = (k, post) => {
    const tempPostData = { ...this.state.post };
    tempPostData.text = post.text;
    tempPostData.sharedText = post.sharedText;
    tempPostData.taggedPeople = post.taggedPeople;
    tempPostData.twitterPost = post.twitterPost;
    if (post.contents.length > 0) {
      tempPostData.contents = post.contents;
    }
    this.setState({ modal: false, post: tempPostData }, () => {
      this.processText();
    });

    //    setTimeout(() => {
    //     //this.setState({post: tempPostData});
    //     this.props.updatePost(k, tempPostData);
    //    },500);
  };

  showCommentReplies = (commentId) => {
    switchLoader(true, 'Please wait. Getting Comments...');
    getReplyComments({ commentId }, true).then(
      async (resp) => {
        switchLoader();
        const index = this.state.post.comment.findIndex(
          (el) => el._id === commentId
        );
        const tempPostData = this.state.post;
        tempPostData.comment[index].replies = resp;
        this.setState({ post: tempPostData });
        this.showCommentReply(commentId);
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  callBackCommentReply = (replyData, commentIndex) => {
    const postObj = this.state.post;
    if (postObj.comment && postObj.comment[commentIndex]) {
      if (postObj.comment[commentIndex].replies) {
        postObj.comment[commentIndex].replies.push(replyData);
      } else {
        postObj.comment[commentIndex].replies = [replyData];
      }
      const tempReplyCmt = this.state.replyCmt;
      tempReplyCmt[commentIndex] = '';
      this.setState({ post: postObj, replyCmt: tempReplyCmt });
    }
  };

  // wrapHash = (val) => {

  //     return val.replace(/#(\w+)/g, "<A href='/search/filter=posts&q=$&'>$&</A>").replace("q=#", "q=%23");
  // }

  render() {
    const { post, showComments, commentText, replyCmt, key } = this.state;

    return post == null ? (
      <div className="text-center">
        <Spinner />
      </div>
    ) : post.userid == this.props.currentUser._id ||
      (post.settings[0] != undefined &&
        (post.settings[0].follow == 'Everyone' ||
          (post.settings[0].comments == 'Friends' &&
            post.followings.length > 0))) ? (
      <>
        <Modal
          displayModal={this.state.reportModal}
          closeModal={this.reportModal}
        >
          <div>
            <div className="form-group">
              <select
                className="form-control"
                value={this.state.category}
                onChange={(e) => this.setState({ category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option>Violence</option>
                <option>Racism / Hatespeech</option>
                <option>Pornographic</option>
                <option>Spam</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                type="text"
                placeholder="Reason"
                className="form-control"
                onChange={(e) => this.setState({ reason: e.target.value })}
                value={this.state.reason}
              />
            </div>
          </div>
          <div className="">
            <Button
              variant="primary"
              size="compact m-2"
              onClick={() => this.report()}
            >
              Report
            </Button>
            <Button
              variant="secondary"
              size="compact m-2"
              onClick={this.reportModal}
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <Modal displayModal={this.state.modal} closeModal={this.editPost}>
          <EditPost
            {...this.props}
            post={post}
            updatePost={(p) => this.updatePost(key, p)}
          />
        </Modal>
        <div className="post ">
          {!post.sharedBy ? (
            this.getPostContent(post, showComments, commentText, replyCmt)
          ) : post.removed > 0 ||
            (post.privacy == 'onlyme' &&
              this.props.filter != 'hidden') ? null : (
            <div className="container post-inner">
              <div className="row">
                <ul className="list-group w-100 m-0">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="media w-100">
                      <div className="media-left mr-2">
                        {post.sharedUser != undefined ? (
                          <A href={`/u/${post.sharedUser._id}`}>
                            <img
                              className="media-object pic"
                              src={profilePic(post.sharedUser.avatar)}
                              alt="..."
                            />
                          </A>
                        ) : (
                          <img
                            className="media-object pic"
                            src={profilePic('')}
                            alt="..."
                          />
                        )}
                      </div>
                      <div className="media-body">
                        {post.sharedUser != undefined ? (
                          <A href={`/u/${post.sharedUser._id}`}>
                            <p className="media-heading">
                              {post.sharedUser && post.sharedUser.name
                                ? post.sharedUser.name
                                : 'Anonymous User'}
                            </p>
                          </A>
                        ) : (
                          <p className="media-heading">Unknown</p>
                        )}
                        <A href={`/post/${post._id}`}>
                          <p className="media-subheading">
                            <TimeAgo date={post.sharedOn} />
                          </p>
                        </A>
                      </div>
                      <div className="media-right">
                        <ul className="d-flex align-items-center">
                          {post.twitterPost && (
                            <li className="list-group-item splLi">
                              <img
                                className=" extraSmallIcon"
                                src={GetAssetImage('icons/twitter.svg')}
                              />
                            </li>
                          )}
                          {post.saved > 0 && (
                            <li className="list-group-item splLi">
                              <img
                                className="mr-1"
                                src={require('../../assets/images/save-icon.png')}
                              />
                            </li>
                          )}
                          {post.highlighted > 0 && (
                            <li className="list-group-item splLi">
                              <img
                                className="mr-1"
                                src={require('../../assets/images/icons/pin.png')}
                              />
                            </li>
                          )}

                          <li className="list-group-item splLiLast mr-4">
                            <img
                              className=" extraSmallIcon"
                              src={require(`../../assets/images/${
                                post.privacy == 'public'
                                  ? 'create-visibility-icon'
                                  : 'hide-visibility-icon@2x'
                              }.png`)}
                            />
                          </li>

                          <li className="list-group-item  p-1 pr-2 pointer  dropdown">
                            <i className="fa fa-ellipsis-h" />
                            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                              {post.sharedBy == this.props.currentUser._id && (
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => this.editPost(post._id)}
                                >
                                  <img
                                    className="mr-1"
                                    src={require('../../assets/images/edit-icon.png')}
                                  />
                                  <span className="m-1">Edit</span>
                                </a>
                              )}
                              {/* {post.hidden ?
                                                <a className="dropdown-item" data-toggle="modal" data-target="#dropdownHideModal" onClick={(e) => this.unhidePost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/hide-visibility-icon.png")} />
                                                <span className="m-1">Un-Hide</span></a>
                                                :
                                                <a className="dropdown-item" data-toggle="modal" data-target="#dropdownHideModal" onClick={(e) => this.hidePost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/hide-visibility-icon.png")} />
                                                <span className="m-1">Hide</span></a> }  */}
                              {post.saved > 0 ? (
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => this.unsavePost(post._id)}
                                >
                                  <img
                                    className="mr-1"
                                    src={require('../../assets/images/save-icon.png')}
                                  />
                                  <span className="m-1">Un-Save</span>
                                </a>
                              ) : (
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => this.savePost(post._id)}
                                >
                                  <img
                                    className="mr-1"
                                    src={require('../../assets/images/save-icon.png')}
                                  />
                                  <span className="m-1">Save</span>
                                </a>
                              )}

                              {/* {post.highlighted ?
                                            <a className="dropdown-item" onClick={(e) => this.unHighlight(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/icons/pin.png")} />
                                                <span className="m-1">Un-Highlight</span></a>
                                                :
                                                <a className="dropdown-item" onClick={(e) => this.highlightPost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/icons/pin.png")} />
                                                <span className="m-1">Highlight</span></a>
                                            } */}
                              {post.sharedBy == this.props.currentUser._id && (
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => this.removePost(post._id)}
                                >
                                  <img
                                    className="mr-1"
                                    src={require('../../assets/images/remove-icon.png')}
                                  />
                                  <span className="m-1">Remove</span>
                                </a>
                              )}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center post-content-area">
                    <div className="col-12 mb-2">
                      <div className="col p-0">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: this.state.sharedContent,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                  <li className="sharedPostContent">
                    {/* {
                                        post.shareType == 'blog' ?
                                        this.getBlogContent(post, showComments, commentText, replyCmt, true)
                                        :
                                        this.getPostContent(post, showComments, commentText, replyCmt, true)
                                    } */}
                    {this.getBlogContent(
                      post,
                      showComments,
                      commentText,
                      replyCmt,
                      true
                    )}
                  </li>

                  {/* <li className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1">
                                    <div className="col pl-1">
                                        <ul className="list-group list-group-horizontal remove-border m-0">
                                            <li className="list-group-item pl-0">
                                                {post.likesCount > 0 && <span className="m-1 font-weight-bold"> {post.likesCount} </span>}
                                                <span className="">Likes</span>
                                            </li>
                                            <li className="list-group-item pl-0">
                                                {post.shareCount > 0 && <span className="m-1 font-weight-bold"> {post.shareCount} </span>}
                                                <span className="">Shares</span>
                                            </li>
                                            <li className="list-group-item pl-0">
                                                {post.cmtsCount > 0 && <span className="m-1 font-weight-bold"> {post.cmtsCount} </span>}
                                                <span className="">Comments</span>
                                            </li>
                                        </ul>
                                    </div>
                                </li> */}
                  <div>
                    <li className="list-group-item d-flex justify-content-between align-items-center post-meta p-1 horizontal-line-fit-top mt-4">
                      <div className="col pl-1">
                        <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                          <li
                            className="list-group-item pointer"
                            onClick={(e) =>
                              this.likePostFn(post._id, post.likeActive)
                            }
                          >
                            <img
                              src={
                                post.likeActive === 1
                                  ? require('../../assets/images/icons/like_active.svg')
                                  : require('../../assets/images/icons/like.svg')
                              }
                            />
                            <span className="m-1">
                              {post.likesCount > 0 && (
                                <span className="m-1 font-weight-bold">
                                  {' '}
                                  {post.likesCount}{' '}
                                </span>
                              )}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="pr-1">
                        <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                          {(post.userid == this.props.currentUser._id ||
                            (post.settings[0] != undefined &&
                              (post.settings[0].comments == 'Everyone' ||
                                (post.settings[0].comments == 'Friends' &&
                                  post.followings.length > 0)))) && (
                            <li className="list-group-item pl-0 pointer">
                              <span
                                className="m-1"
                                onClick={() => this.showComments(post._id)}
                              >
                                {post.cmtsCount > 0 && (
                                  <span className="m-1 font-weight-bold">
                                    {' '}
                                    {post.cmtsCount}{' '}
                                  </span>
                                )}{' '}
                                {post.cmtsCount > 1 ? 'Comments' : 'Comment'}{' '}
                              </span>
                            </li>
                          )}

                          {(post.userid == this.props.currentUser._id ||
                            (post.settings[0] != undefined &&
                              post.settings[0].allowSharing)) && (
                            <li
                              className="list-group-item pl-0 pointer"
                              onClick={(e) => this.sharePost(post)}
                            >
                              <span className="m-1">
                                {post.shareCount > 0 && (
                                  <span className="m-1 font-weight-bold">
                                    {' '}
                                    {post.shareCount}{' '}
                                  </span>
                                )}{' '}
                                {post.shareCount > 1 ? 'Shares' : 'Share'}{' '}
                              </span>
                            </li>
                          )}
                          {/* <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/favicon.png" /><span className="m-1"></span></li>
                                        {post.twitterPost && <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/static/media/twitter-filled.c9f12008.svg" /><span className="m-1"></span></li>}
                                        <li className="list-group-item pl-0"><img className=" extraSmallIcon" src={require("../../assets/images/" + (post.privacy == 'public' ? "create-visibility-icon" : "hide-visibility-icon@2x") + ".png")} /></li> */}
                        </ul>
                      </div>
                    </li>
                    {showComments && (
                      <li className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1 horizontal-line-fit-top">
                        <div className="col pl-1">
                          <input
                            className="form-control tempcommentInput"
                            type="text"
                            placeholder="Add your comment"
                            name="commentText"
                            value={commentText}
                            onChange={(e) => this.handleChange(e)}
                          />
                          <Button
                            className="commentBtn"
                            onClick={() => this.postCmt(post._id)}
                          >
                            COMMENT
                          </Button>
                        </div>
                      </li>
                    )}
                  </div>

                  {showComments &&
                    post.comment.map((comment, i) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1 horizontal-line-fit-top"
                        key={i}
                      >
                        <div className="col pl-1">
                          <div className="media w-100 align-items-center p-1">
                            <div className="media-left mr-2">
                              <A href={`/u/${comment.userinfo._id}`}>
                                <img
                                  className="media-object pic commentPic"
                                  src={profilePic(comment.userinfo.avatar)}
                                  alt="..."
                                />
                              </A>
                            </div>
                            <div className="media-body">
                              <A href={`/u/${comment.userinfo._id}`}>
                                <p className="media-heading">
                                  {comment.userinfo.name}
                                </p>
                              </A>
                              <p className="media-subheading">{comment.text}</p>
                              <div className="d-flex">
                                <span
                                  className="mr-2 pointer"
                                  onClick={(e) =>
                                    this.commentLike(i, post._id, comment._id)
                                  }
                                >
                                  {comment.likeActive ? 'Liked' : 'Like'}{' '}
                                  {comment.likesCount && comment.likesCount > 0
                                    ? comment.likesCount
                                    : ''}
                                </span>
                                <span
                                  className="mr-2 pointer"
                                  onClick={(e) =>
                                    this.showCommentReplies(comment._id)
                                  }
                                >
                                  {comment.repliesCount &&
                                  comment.repliesCount > 1
                                    ? 'Replies'
                                    : 'Reply'}{' '}
                                  {comment.repliesCount &&
                                  comment.repliesCount > 0
                                    ? comment.repliesCount
                                    : ''}
                                </span>
                                {/* <span className="mr-2 pointer" onClick={(e) => this.props.commentLike(comment._id)}>Like</span>
                                                        <span className="mr-2 pointer" onClick={(e) => this.showCommentReply(comment._id)}>Reply</span>
                                                        {(comment.repliesCount && comment.repliesCount > 0) ? <span className="mr-2 pointer" onClick={(e) => this.showCommentReplies(comment._id)}>{comment.repliesCount} replies</span> : ''}
                                                        {(comment.likesCount && comment.likesCount > 0) ? <span className="mr-2 pointer" >{comment.likesCount} likes</span> : ''} */}
                                {/* <span className="mr-2">Translate</span> */}
                              </div>
                            </div>
                          </div>
                          {comment.replies &&
                            comment.replies.map((reply, r) => (
                              <div
                                className="media w-100 align-items-center p-1"
                                key={r}
                              >
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                  <div className="col pl-1">
                                    <div className="media w-100 align-items-center p-1">
                                      <div className="media-left mr-2">
                                        <A href={`/u/${reply.userinfo._id}`}>
                                          <img
                                            className="media-object pic replyPic"
                                            src={profilePic(
                                              reply.userinfo.avatar
                                            )}
                                            alt="..."
                                          />
                                        </A>
                                      </div>
                                      <div className="media-body">
                                        <A href={`/u/${reply.userinfo._id}`}>
                                          <p className="media-heading">
                                            {reply.userinfo
                                              ? reply.userinfo.name
                                              : reply.userinfo.name}
                                          </p>
                                        </A>
                                        <p className="media-subheading">
                                          {reply.text}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </div>
                            ))}

                          {comment.showReply && (
                            <div className="col pl-4 mb-2">
                              <input
                                className="form-control tempcommentInput"
                                type="text"
                                placeholder="Add your comment"
                                name="replyCmt"
                                value={replyCmt[i]}
                                onChange={(e) => this.handleChange(e, i)}
                              />
                              <Button
                                className="commentBtn"
                                onClick={() =>
                                  this.commentReply(
                                    post._id,
                                    comment._id,
                                    replyCmt[i],
                                    i,
                                    this.callBackCommentReply
                                  )
                                }
                              >
                                REPLY
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
          {this.state.shareModel && (
            <Share
              post={this.state.currPost}
              shareSuccess={this.shareSuccess}
              closeShareModal={this.closeShareModal}
            />
          )}
        </div>
      </>
    ) : null;
  }

  getPostContent = (
    post,
    showComments,
    commentText,
    replyCmt,
    shared = false
  ) =>
    post.removed > 0 ||
    (post.privacy == 'onlyme' && this.props.filter != 'hidden') ? null : (
      <div className="container post-inner" key={`${post._id}1`}>
        <Dialog
          onClose={this.handleClose}
          className="confirm-modal"
          open={this.state.open}
        >
          <h2>Confirmation</h2>
          <i className="fa-solid fa-trash-can" />
          <p className="p-2">Are you sure about deleting this?</p>
          <div>
            <Button onClick={this.handleClose} variant="secondaryBtn me-2">
              Cancel
            </Button>
            <Button onClick={this.removePostConfirm} variant="primaryBtn">
              Yes
            </Button>
          </div>
        </Dialog>
        <div className="row">
          <ul className="list-group w-100 m-0">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div className="media w-100">
                <div className="media-left mr-2">
                  <A href={`/u/${post.userinfo._id}`}>
                    <img
                      className="media-object pic"
                      src={profilePic(post.userinfo.avatar)}
                      alt="..."
                    />
                  </A>
                </div>

                <div className="media-body">
                  <A href={`/u/${post.userinfo._id}`}>
                    <p className="media-heading">
                      {post.userinfo && post.userinfo.name
                        ? post.userinfo.name
                        : ''}
                    </p>
                  </A>
                  <A href={`/post/${shared ? post.sharedPost : post._id}`}>
                    <p className="media-subheading">
                      <TimeAgo date={post.createdAt} />
                    </p>
                  </A>
                </div>

                {!post.sharedBy && (
                  <div className="media-right">
                    <ul className="d-flex align-items-center">
                      {post.twitterPost && (
                        <li className="list-group-item splLi">
                          <img
                            className=" extraSmallIcon"
                            src={GetAssetImage('icons/twitter.svg')}
                          />
                        </li>
                      )}
                      {post.saved > 0 && (
                        <li className="list-group-item splLi">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/save-icon.png')}
                          />
                        </li>
                      )}
                      {post.highlighted > 0 && (
                        <li className="list-group-item splLi">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/icons/pin.png')}
                          />
                        </li>
                      )}

                      <li className="list-group-item splLiLast mr-4">
                        <img
                          className=" extraSmallIcon"
                          src={require(`../../assets/images/${
                            post.privacy == 'public'
                              ? 'create-visibility-icon'
                              : 'hide-visibility-icon@2x'
                          }.png`)}
                        />
                      </li>

                      <li className="list-group-item  p-1 pr-2 pointer  dropdown">
                        <i className="fa fa-ellipsis-h" />
                        <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                          {post.userid == this.props.currentUser._id && (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.editPost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/edit-icon.png')}
                              />
                              <span className="m-1">Edit</span>
                            </a>
                          )}
                          {/* {post.hidden ?
                                                <a className="dropdown-item" data-toggle="modal" data-target="#dropdownHideModal" onClick={(e) => this.unhidePost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/hide-visibility-icon.png")} />
                                                <span className="m-1">Un-Hide</span></a>
                                                :
                                                <a className="dropdown-item" data-toggle="modal" data-target="#dropdownHideModal" onClick={(e) => this.hidePost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/hide-visibility-icon.png")} />
                                                <span className="m-1">Hide</span></a>
                                                
                                                 }  */}
                          {post.saved > 0 ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unsavePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/save-icon.png')}
                              />
                              <span className="m-1">Un-Save</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.savePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/save-icon.png')}
                              />
                              <span className="m-1">Save</span>
                            </a>
                          )}
                          {post.reported > 0 ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unReport('post', post._id)}
                            >
                              <i className="mr-1 fa fa-undo" />
                              <span className="m-1">Undo-Report</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={() => this.reportModal('post', post)}
                            >
                              <i className="mr-1 fa fa-exclamation-circle" />
                              <span className="m-1">Report</span>
                            </a>
                          )}
                          {/*                                             
                                            {post.highlighted ?
                                            <a className="dropdown-item" onClick={(e) => this.unHighlight(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/icons/pin.png")} />
                                                <span className="m-1">Un-Highlight</span></a>
                                                :
                                                <a className="dropdown-item" onClick={(e) => this.highlightPost(post._id)}>
                                                <img className="mr-1" src={require("../../assets/images/icons/pin.png")} />
                                                <span className="m-1">Highlight</span></a>
                                            } */}
                          {post.userid == this.props.currentUser._id && (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.removePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/remove-icon.png')}
                              />
                              <span className="m-1">Remove</span>
                            </a>
                          )}

                          {/* <a className="dropdown-item" onClick={(e) => this.reportPost(post._id)}>
                                                <i className="fa fa-exclamation-circle"></i>
                                                <span className="m-1">Report</span></a> */}
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center post-content-area">
              <div className="container">
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: this.state.content }}
                >
                  {/* {(this.state.url != null && this.state.url != '' && typeof this.state.url != undefined)  &&
                                      <div className="mt-2">
                                          <ReactTinyLink
                                        cardSize="small"
                                        
                                        showGraphic={true}
                                        maxLine={2}
                                        minLine={1}
                                        url={this.state.url}
                                        />
                                        </div>
                                    } */}
                </div>
                <div className="row">
                  <span className="set-overlay">
                    {post.contents != undefined &&
                      post.contents[0] != undefined &&
                      post.contents[0].contenttype == 'Image' && (
                        <img
                          className="w-100"
                          src={
                            post.contents[0].content_url ||
                            require('../../assets/images/post-image@2x.png')
                          }
                          alt=""
                        />
                      )}
                    {post.contents != undefined &&
                      post.contents[0] != undefined &&
                      post.contents[0].contenttype == 'Video' && (
                        <ReactPlayer
                          controls
                          url={
                            post.contents[0].content_url ||
                            'https://www.youtube.com/watch?v=ysz5S6PUM-U'
                          }
                        />
                      )}
                  </span>
                </div>
                <div className="post-tags">
                  {post.taggedPeople && post.taggedPeople.length !== 0 && (
                    <div className="row">
                      <span>
                        {' '}
                        With{' '}
                        {post.taggedPeople.map((tagPeople, j) => (
                          <Link
                            className="taggedName"
                            to={`/u/${tagPeople._id}`}
                            key={j}
                          >
                            @{tagPeople.name}
                          </Link>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>

            {/* {!post.sharedBy && <li className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1">
                            <div className="col pl-1">
                                <ul className="list-group list-group-horizontal remove-border m-0">
                                    <li className="list-group-item pl-0">
                                        {post.likesCount > 0 && <span className="m-1 font-weight-bold"> {post.likesCount} </span>}
                                        <span className="">Likes</span>
                                    </li>
                                    <li className="list-group-item pl-0">
                                        
                                        <span className="">Shares</span>
                                    </li>
                                    <li className="list-group-item pl-0">
                                        {post.cmtsCount > 0 && <span className="m-1 font-weight-bold"> {post.cmtsCount} </span>}
                                        <span className="">Comments</span>
                                    </li>
                                </ul>
                            </div>
                        </li>} */}
            {!post.sharedBy && (
              <div>
                <li className="list-group-item d-flex justify-content-between align-items-center post-meta p-1 horizontal-line-fit-top mt-4">
                  <div className="col pl-1">
                    <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                      <li
                        className="list-group-item pointer"
                        onClick={(e) =>
                          this.likePostFn(post._id, post.likeActive)
                        }
                      >
                        <img
                          src={
                            post.likeActive === 1
                              ? require('../../assets/images/icons/like_active.svg')
                              : require('../../assets/images/icons/like.svg')
                          }
                        />
                        <span className="m-1">
                          {post.likesCount > 0 && (
                            <span className="m-1 font-weight-bold">
                              {' '}
                              {post.likesCount}{' '}
                            </span>
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="pr-1">
                    <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                      {(post.userid == this.props.currentUser._id ||
                        (post.settings[0] != undefined &&
                          (post.settings[0].comments == 'Everyone' ||
                            (post.settings[0].comments == 'Friends' &&
                              post.followings.length > 0)))) && (
                        <li className="list-group-item pl-0 pointer">
                          <span
                            className="m-1"
                            onClick={() => this.showComments(post._id)}
                          >
                            {post.cmtsCount > 0 && (
                              <span className="m-1 font-weight-bold">
                                {' '}
                                {post.cmtsCount}{' '}
                              </span>
                            )}{' '}
                            {post.cmtsCount > 1 ? 'Comments' : 'Comment'}{' '}
                          </span>
                        </li>
                      )}

                      {(post.userid == this.props.currentUser._id ||
                        (post.settings[0] != undefined &&
                          post.settings[0].allowSharing)) && (
                        <li
                          className="list-group-item pl-0 pointer"
                          onClick={(e) => this.sharePost(post)}
                        >
                          <span className="m-1">
                            {post.shareCount > 0 && (
                              <span className="m-1 font-weight-bold">
                                {' '}
                                {post.shareCount}{' '}
                              </span>
                            )}{' '}
                            {post.shareCount > 1 ? 'Shares' : 'Share'}{' '}
                          </span>
                        </li>
                      )}
                      {/* <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/favicon.png" /><span className="m-1"></span></li>
                                        {post.twitterPost && <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/static/media/twitter-filled.c9f12008.svg" /><span className="m-1"></span></li>}
                                        <li className="list-group-item pl-0"><img className=" extraSmallIcon" src={require("../../assets/images/" + (post.privacy == 'public' ? "create-visibility-icon" : "hide-visibility-icon@2x") + ".png")} /></li> */}
                    </ul>
                  </div>
                </li>
                {!post.sharedBy && showComments && (
                  <li className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1 horizontal-line-fit-top">
                    <div className="col pl-1">
                      <Button
                        className="commentBtn"
                        onClick={() => this.postCmt(post._id)}
                      >
                        COMMENT
                      </Button>
                      <input
                        className="form-control tempcommentInput"
                        type="text"
                        placeholder="Add your comment"
                        name="commentText"
                        value={commentText}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                  </li>
                )}
              </div>
            )}
            {!post.sharedBy &&
              showComments &&
              post.comment.map((comment, i) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1 horizontal-line-fit-top"
                  key={i}
                >
                  <div className="col pl-1">
                    <div className="media w-100 align-items-center p-1 comment-row">
                      <div className="media-left mr-2">
                        <A href={`/u/${comment.userinfo._id}`}>
                          <img
                            className="media-object pic commentPic"
                            src={profilePic(comment.userinfo.avatar)}
                            alt="..."
                          />
                        </A>
                      </div>
                      <div className="media-body">
                        <A href={`/u/${comment.userinfo._id}`}>
                          <p className="media-heading">
                            {comment.userinfo.name}
                          </p>
                        </A>
                        <p className="media-subheading">{comment.text}</p>
                        <div className="d-flex">
                          <span
                            className="mr-2 pointer"
                            onClick={(e) =>
                              this.commentLike(i, post._id, comment._id)
                            }
                          >
                            {comment.likeActive ? 'Liked' : 'Like'}{' '}
                            {comment.likesCount && comment.likesCount > 0
                              ? comment.likesCount
                              : ''}
                          </span>
                          <span
                            className="mr-2 pointer"
                            onClick={(e) =>
                              this.showCommentReplies(comment._id)
                            }
                          >
                            {comment.repliesCount && comment.repliesCount > 1
                              ? 'Replies'
                              : 'Reply'}{' '}
                            {comment.repliesCount && comment.repliesCount > 0
                              ? comment.repliesCount
                              : ''}
                          </span>

                          {/* <span className="mr-2 pointer" onClick={(e) => this.props.commentLike(comment._id)}>Like</span>
                                                    <span className="mr-2 pointer" onClick={(e) => this.showCommentReply(comment._id)}>Reply</span>
                                                    {(comment.repliesCount && comment.repliesCount > 0) ? <span className="mr-2 pointer" onClick={(e) => this.showCommentReplies(comment._id)}>{comment.repliesCount} replies</span> : ''}
                                                    {(comment.likesCount && comment.likesCount > 0) ? <span className="mr-2 pointer" >{comment.likesCount} likes</span> : ''} */}
                          {/* <span className="mr-2">Translate</span> */}
                        </div>
                      </div>
                      <div className="media-right">
                        <div className="list-group-item  p-1 pr-2 pointer  dropdown">
                          <i className="fa fa-ellipsis-h" />
                          <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                            {(comment.userinfo._id ==
                              this.props.currentUser._id ||
                              post.userid == this.props.currentUser._id) && (
                              <a
                                className="dropdown-item"
                                onClick={(e) =>
                                  this.deleteComment(
                                    'comment',
                                    post._id,
                                    comment._id
                                  )
                                }
                              >
                                <img
                                  className="mr-1"
                                  src={require('../../assets/images/remove-icon.png')}
                                />
                                <span className="m-1">Delete</span>
                              </a>
                            )}
                            {comment.userinfo._id !=
                            this.props.currentUser._id ? (
                              comment.reported > 0 ? (
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    this.unReport('comment', comment._id, i)
                                  }
                                >
                                  <i className="mr-1 fa fa-undo" />
                                  <span className="m-1">Undo-Report</span>
                                </a>
                              ) : (
                                <a
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.reportModal('comment', comment, i)
                                  }
                                >
                                  <i className="mr-1 fa fa-exclamation-circle" />
                                  <span className="m-1">Report</span>
                                </a>
                              )
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    {comment.replies &&
                      comment.replies.map((reply, r) => (
                        <ul
                          className="media w-100 align-items-center p-2"
                          key={r}
                        >
                          <li className="list-group-item d-flex justify-content-between align-items-center w-100">
                            <div className="media align-items-center comment-row w-100">
                              <div className="media-left mr-2">
                                <A href={`/u/${reply.userinfo._id}`}>
                                  <img
                                    className="media-object pic replyPic"
                                    src={profilePic(reply.userinfo.avatar)}
                                    alt="..."
                                  />
                                </A>
                              </div>
                              <div className="media-body">
                                <A href={`/u/${reply.userinfo._id}`}>
                                  <p className="media-heading">
                                    {reply.userinfo
                                      ? reply.userinfo.name
                                      : reply.userinfo.name}
                                  </p>
                                </A>
                                <p className="media-subheading">{reply.text}</p>
                              </div>
                              <div className="media-right h-auto">
                                <div className="list-group-item  p-0 pl-2 pointer  dropdown">
                                  <i className="vertical-dot fa fa-ellipsis-h" />
                                  <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                                    {(reply.userinfo._id ==
                                      this.props.currentUser._id ||
                                      post.userid ==
                                        this.props.currentUser._id) && (
                                      <a
                                        className="dropdown-item"
                                        onClick={(e) =>
                                          this.deleteComment(
                                            'reply',
                                            comment._id,
                                            reply._id
                                          )
                                        }
                                      >
                                        <img
                                          className="mr-1"
                                          src={require('../../assets/images/remove-icon.png')}
                                        />
                                        <span className="m-1">Delete</span>
                                      </a>
                                    )}
                                    {reply.userinfo._id !=
                                    this.props.currentUser._id ? (
                                      reply.reported > 0 ? (
                                        <a
                                          className="dropdown-item"
                                          onClick={(e) =>
                                            this.unReport(
                                              'reply',
                                              reply._id,
                                              r,
                                              i
                                            )
                                          }
                                        >
                                          <i className="mr-1 fa fa-undo" />
                                          <span className="m-1">
                                            Undo-Report
                                          </span>
                                        </a>
                                      ) : (
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            this.reportModal(
                                              'reply',
                                              reply,
                                              r,
                                              comment,
                                              i
                                            )
                                          }
                                        >
                                          <i className="mr-1 fa fa-exclamation-circle" />
                                          <span className="m-1">Report</span>
                                        </a>
                                      )
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      ))}

                    {comment.showReply && (
                      <div className="col pl-4 mb-2">
                        <input
                          className="form-control tempcommentInput"
                          type="text"
                          placeholder="Add your comment"
                          name="replyCmt"
                          value={replyCmt[i]}
                          onChange={(e) => this.handleChange(e, i)}
                        />
                        <Button
                          className="commentBtn"
                          onClick={() =>
                            this.commentReply(
                              post._id,
                              comment._id,
                              replyCmt[i],
                              i,
                              this.callBackCommentReply
                            )
                          }
                        >
                          REPLY
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );

  getBlogContent = (
    post,
    showComments,
    commentText,
    replyCmt,
    shared = false
  ) => {
    const { text } = post;
    // var text = post.text;
    return post.removed > 0 ||
      (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
      <SharedPostCard
        url={post.shareType == 'blog' ? `/blog/${post.sharedPost}` : ''}
        thumb={
          post.contents[0] != undefined
            ? post.contents[0].content_url
            : require('../../assets/images/post-image@2x.png')
        }
        key={post._id}
        currentUser={this.props.currentUser}
        post={post}
        title={post.sharedSubject}
        description={text}
        shared
      />
    );
  };
}

export default Post;
