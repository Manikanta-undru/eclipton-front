import React from 'react';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';
import Dialog from '@material-ui/core/Dialog';
import {
  likePost,
  postComment,
  getComments,
  likeComment,
  replyComment,
  getReplyComments,
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
import Button from '../Button';

require('./styles.scss');

const reactStringReplace = require('react-string-replace');

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      last: null,
      url: props.post.url,
      post: props.post,
      key: props.post._id,
      shareModel: false,
      currPost: {},
      playing: false,
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
    if (this.props.single) {
      this.showComments(this.state.post._id);
    }
  }

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

  editPost = (id) => {};

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
  //     }, error => {
  //         alertBox(true, error.data.message);
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
      },
      (error) => {
        alertBox(true, error.data.message);
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

    return (
      <div className="post ">
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
        {!post.sharedBy ? (
          this.getPostContent(post, showComments, commentText, replyCmt)
        ) : post.removed > 0 ||
          (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
          <div className="container post-inner">
            <div className="row">
              <ul className="list-group w-100 m-0">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="media w-100">
                    <div className="media-left mr-2">
                      <A href={`/u/${post.sharedUser._id}`}>
                        <img
                          className="media-object pic"
                          src={profilePic(
                            post.sharedUser.avatar,
                            post.sharedUser.name
                          )}
                          alt="..."
                        />
                      </A>
                    </div>
                    <div className="media-body">
                      <A href={`/u/${post.sharedUser._id}`}>
                        <p className="media-heading">
                          {post.sharedUser && post.sharedUser.name
                            ? post.sharedUser.name
                            : 'Anonymous User'}
                        </p>
                      </A>
                      <A href={`/post/${post._id}`}>
                        <p className="media-subheading">
                          <TimeAgo date={post.sharedOn} />
                        </p>
                      </A>
                    </div>
                  </div>
                  <div className="media-right">
                    <ul className="d-flex">
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
                      {post.highlighted && (
                        <li className="list-group-item splLi">
                          <img
                            className="mr-1"
                            src={require('../../assets/images/save-icon.png')}
                          />
                        </li>
                      )}

                      <li className="list-group-item  p-1 pr-2 pointer  dropdown">
                        <i className="fa fa-ellipsis-h" />
                        <div className="dropdown-menu  dropdown-menu-right">
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
                          {post.hidden ? (
                            <a
                              className="dropdown-item"
                              data-toggle="modal"
                              data-target="#dropdownHideModal"
                              onClick={(e) => this.unhidePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/hide-visibility-icon.png')}
                              />
                              <span className="m-1">Un-Hide</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              data-toggle="modal"
                              data-target="#dropdownHideModal"
                              onClick={(e) => this.hidePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/hide-visibility-icon.png')}
                              />
                              <span className="m-1">Hide</span>
                            </a>
                          )}
                          {post.saved > 0 ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unsavePost(post._id)}
                            >
                              <span className="m-1">
                                {' '}
                                <i
                                  className="fa fa-star"
                                  aria-hidden="true"
                                />{' '}
                                Un-Save
                              </span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.savePost(post._id)}
                            >
                              <span className="m-1">
                                {' '}
                                <i
                                  className="fa fa-star-o"
                                  aria-hidden="true"
                                />
                                Save
                              </span>
                            </a>
                          )}

                          {post.highlighted ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unHighlight(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/save-icon.png')}
                              />
                              <span className="m-1">Un-Highlight</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.highlightPost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/save-icon.png')}
                              />
                              <span className="m-1">Highlight</span>
                            </a>
                          )}
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
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center post-content-area">
                  <div className="col-12 mb-2">
                    <div className="col p-0">
                      <span>
                        {reactStringReplace(
                          post.text,
                          /#(\w+)/g,
                          (match, i) => (
                            <A
                              href={`/search?filter=posts&q=${encodeURIComponent(
                                match
                              )}`}
                              className="text-blue"
                            >
                              {` #${match} `}
                            </A>
                          )
                        )}

                        {/* {(this.state.url != null && this.state.url != '' && typeof this.state.url != undefined) &&
                                      <div className="mt-2">
                                          <ReactTinyLink
                                        cardSize="small"
                                        
                                        showGraphic={true}
                                        maxLine={2}
                                        minLine={1}
                                        url={this.state.url}
                                        />
                                        </div>
                                    }  */}
                      </span>
                    </div>
                  </div>
                </li>
                <li className="sharedPostContent">
                  {this.getPostContent(
                    post,
                    showComments,
                    commentText,
                    replyCmt
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

                    {/* <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                                                    <li className="list-group-item pl-0 pointer" onClick={(e) => this.likePostFn(post._id, post.likeActive)}>
                                                        <img src={require("../../assets/images/like-icon.png")} />
                                                        <span className="m-1">{post.likeActive === 1 ? 'LIKED' : 'LIKE'} {post.likesCount > 0 && <span className="m-1 font-weight-bold"> {post.likesCount} </span>}</span>
                                                    </li>
                                                    <li className="list-group-item pl-0 pointer">
                                                        <img src={require("../../assets/images/comment-icon.png")} />
                                                        <span className="m-1" onClick={() => this.showComments(post._id)}>COMMENT {post.cmtsCount > 0 && <span className="m-1 font-weight-bold"> {post.cmtsCount} </span>}</span>
                                                    </li>
                                                    <li className="list-group-item pl-0 pointer" onClick={(e) => this.sharePost(post)}>
                                                        <img src={require("../../assets/images/share-icon.png")} />
                                                        <span className="m-1">SHARE  {post.shareCount > 0 && <span className="m-1 font-weight-bold"> {post.shareCount} </span>}</span>
                                                    </li>
                                                    
                                                </ul> */}
                  </div>
                  <div className="pr-1">
                    <ul className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1">
                      <li className="list-group-item pl-0 pointer">
                        <img
                          src={require('../../assets/images/comment-icon.png')}
                        />
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
                      <li
                        className="list-group-item pl-0 pointer"
                        onClick={(e) => this.sharePost(post)}
                      >
                        <img
                          src={require('../../assets/images/share-icon.png')}
                        />
                        <span className="m-1">
                          {post.shareCount > 0 && (
                            <span className="m-1 font-weight-bold">
                              {' '}
                              {post.shareCount}{' '}
                            </span>
                          )}{' '}
                          {post.shareCount > 1 ? 'Shares' : 'Share'}
                        </span>
                      </li>
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
                      <button
                        className="tempCommentBtn"
                        onClick={() => this.postCmt(post._id)}
                      >
                        COMMENT
                      </button>
                    </div>
                  </li>
                )}
                {showComments &&
                  post.comment.map((comment, i) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1 horizontal-line-fit-top"
                      key={i}
                    >
                      <div className="col pl-1">
                        <div className="media w-100 align-items-center p-1">
                          <div className="media-left mr-2">
                            <A
                              href={`/u/${
                                comment.userinfo[0]
                                  ? comment.userinfo[0]._id
                                  : comment.userinfo._id
                              }`}
                            >
                              <img
                                className="media-object pic commentPic"
                                src={profilePic(
                                  comment.userinfo[0]
                                    ? comment.userinfo[0].avatar
                                    : comment.userinfo.avatar,
                                  comment.userinfo[0]
                                    ? comment.userinfo[0].name
                                    : comment.userinfo.name
                                )}
                                alt="..."
                              />
                            </A>
                          </div>
                          <div className="media-body">
                            <A
                              href={`/u/${
                                comment.userinfo[0]
                                  ? comment.userinfo[0]._id
                                  : comment.userinfo._id
                              }`}
                            >
                              <p className="media-heading">
                                {comment.userinfo[0]
                                  ? comment.userinfo[0].name
                                  : comment.userinfo.name}
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
                              {/* {(comment.repliesCount && comment.repliesCount > 0) ? <span className="mr-2 pointer" onClick={(e) => this.showCommentReplies(comment._id)}>{comment.repliesCount} replies</span> : ''} */}

                              {/* <span className="mr-2">Translate</span> */}
                            </div>
                          </div>
                        </div>
                        {comment.replies &&
                          comment.replies.map((reply, ii) => (
                            <div
                              className="media w-100 align-items-center p-1"
                              key={ii}
                            >
                              <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="col pl-1">
                                  <div className="media w-100 align-items-center p-1">
                                    <div className="media-left mr-2">
                                      <A href={`/u/${reply.userinfo._id}`}>
                                        <img
                                          className="media-object pic"
                                          src={profilePic(
                                            reply.userinfo.avatar,
                                            reply.userinfo.name
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
                            <button
                              className="tempCommentBtn"
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
                            </button>
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
    );
  }

  getPostContent = (post, showComments, commentText, replyCmt) =>
    post.removed > 0 ||
    (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
      <div className="container post-inner" key={`${post._id}1`}>
        <div className="row">
          <ul className="list-group w-100 m-0">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div className="media w-100">
                <div className="media-left mr-2">
                  <A href={`/u/${post.userinfo._id}`}>
                    <img
                      className="media-object pic"
                      src={profilePic(post.userinfo.avatar, post.userinfo.name)}
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
                  <A href={`/post/${post._id}`}>
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
                        <div className="dropdown-menu  dropdown-menu-right">
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
                          {post.hidden ? (
                            <a
                              className="dropdown-item"
                              data-toggle="modal"
                              data-target="#dropdownHideModal"
                              onClick={(e) => this.unhidePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/hide-visibility-icon.png')}
                              />
                              <span className="m-1">Un-Hide</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              data-toggle="modal"
                              data-target="#dropdownHideModal"
                              onClick={(e) => this.hidePost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/hide-visibility-icon.png')}
                              />
                              <span className="m-1">Hide</span>
                            </a>
                          )}
                          {post.saved > 0 ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unsavePost(post._id)}
                            >
                              <span className="m-1">
                                {' '}
                                <i
                                  className="fa fa-star"
                                  aria-hidden="true"
                                />{' '}
                                Un-Save
                              </span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.savePost(post._id)}
                            >
                              <span className="m-1">
                                {' '}
                                <i
                                  className="fa fa-star-o"
                                  aria-hidden="true"
                                />{' '}
                                Save
                              </span>
                            </a>
                          )}

                          {post.highlighted ? (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.unHighlight(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/icons/pin.png')}
                              />
                              <span className="m-1">Un-Highlight</span>
                            </a>
                          ) : (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.highlightPost(post._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/icons/pin.png')}
                              />
                              <span className="m-1">Highlight</span>
                            </a>
                          )}
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
                          <a
                            className="dropdown-item"
                            onClick={(e) => this.reportPost(post._id)}
                          >
                            <i className="fa fa-report" />
                            <span className="m-1">Report</span>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center post-content-area">
              <div className="container">
                {post.taggedPeople && post.taggedPeople.length !== 0 && (
                  <div className="row">
                    <span>
                      {' '}
                      With{' '}
                      {post.taggedPeople.map((tagPeople, j) => (
                        <span className="taggedName" key={j}>
                          @{tagPeople.name}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                <div className="post-content">
                  {reactStringReplace(post.text, /#(\w+)/g, (match, i) => (
                    <A
                      href={`/search?filter=posts&q=${encodeURIComponent(
                        match
                      )}`}
                      className="text-blue"
                    >
                      {` #${match} `}
                    </A>
                  ))}

                  {/* {(this.state.url != null && this.state.url != '' && typeof this.state.url != undefined)  &&
                                      <div className="mt-2">  <ReactTinyLink
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
                    {post.contents &&
                      post.contents[0] &&
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
                    {post.contents &&
                      post.contents[0] &&
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
                      {/* <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/favicon.png" /><span className="m-1"></span></li>
                                        {post.twitterPost && <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/static/media/twitter-filled.c9f12008.svg" /><span className="m-1"></span></li>}
                                        <li className="list-group-item pl-0"><img className=" extraSmallIcon" src={require("../../assets/images/" + (post.privacy == 'public' ? "create-visibility-icon" : "hide-visibility-icon@2x") + ".png")} /></li> */}
                    </ul>
                  </div>
                </li>
                {!post.sharedBy && showComments && (
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
                      <button
                        className="tempCommentBtn"
                        onClick={() => this.postCmt(post._id)}
                      >
                        COMMENT
                      </button>
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
                    <div className="media w-100 align-items-center p-1">
                      <div className="media-left mr-2">
                        <A
                          href={`/u/${
                            comment.userinfo[0]
                              ? comment.userinfo[0]._id
                              : comment.userinfo._id
                          }`}
                        >
                          <img
                            className="media-object pic commentPic"
                            src={profilePic(
                              comment.userinfo[0]
                                ? comment.userinfo[0].avatar
                                : comment.userinfo.avatar,
                              comment.userinfo[0]
                                ? comment.userinfo[0].name
                                : comment.userinfo.name
                            )}
                            alt="..."
                          />
                        </A>
                      </div>
                      <div className="media-body">
                        <A
                          href={`/u/${
                            comment.userinfo[0]
                              ? comment.userinfo[0]._id
                              : comment.userinfo._id
                          }`}
                        >
                          <p className="media-heading">
                            {comment.userinfo[0]
                              ? comment.userinfo[0].name
                              : comment.userinfo.name}
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
                                        reply.userinfo.avatar,
                                        reply.userinfo.name
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
                        <button
                          className="tempCommentBtn"
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
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
}

export default Post;
