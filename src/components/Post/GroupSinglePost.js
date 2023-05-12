import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Modal from '../../components/Popup';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';
import * as group from '../../http/group-calls';
import Share from './Share';
import { switchLoader, alertBox } from '../../commonRedux/';
import A from '../A';
import { profilePic } from '../../globalFunctions';
import Spinner from '../Spinner';
import SharedGroupPostCard from '../Cards/SharedGroupPostCard';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import he from 'he';
import Dropdown from '../Dropdown';
import PostReportModal from '../Report/post';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import UrlPreview from './UrlPreview';
require('./styles.scss');
const reactStringReplace = require('react-string-replace');
import * as ConstantTribes from '../../constants/TribesConstant'; // tribesConstant

class GroupSinglePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      photoIndex: 0,
      isOpen: false,
      open: false,
      last: null,
      content: '',
      reason: '',
      category: '',
      sharedContent: '',
      url: props.post != undefined ? props.post.url : '',
      post: null,
      key: props.post != undefined ? props.post._id : '',
      shareModel: false,
      currPost: {},
      playing: false,
      reportModal: false,
      modal: false,
      showComments: false,
      commentText: '',
      replyCmt: [],
      filter: props.filter,
      posts: [],
      savednull: [],
      post_modal: false,
      selectedItem: 0,
      moreTags: false,
    };
  }

  extractUrl = (text) => {
    var expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    var regex = new RegExp(expression);
    return text.match(regex);
  };

  componentDidMount = () => {
    this.setState(
      {
        post: this.props.post,
        posts: this.props.posts,
      },
      () => {
        this.showComments(this.state.post._id);
        this.processText();
      }
    );
    try {
      var i = this.props.post.contents[0].content_url;
      this.setState({
        images: [i],
      });
    } catch (error) {
      /* empty */
    }
  };

  processText = () => {
    let text = '';

    if (
      this.state.post.text != undefined &&
      this.state.post.text != null &&
      this.state.post.text.trim() != '' &&
      this.state.post.text != ''
    ) {
      text = this.state.post.text;
      // text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      text = text.replace(
        /#[a-z]+/g,
        '<a target="_blank" href="/search?filter=posts&q=$&">$&</a>'
      );
      const sss = he.decode(text);
      const matches = sss
        .replace(/<br\s*\/?>/gi, ' ')
        .match(/\b(https?|http?):\/\/\S+/gi);
      this.setState({
        url: matches !== null && matches.length > 0 ? matches : null,
        content: sss,
      });
    }
    if (
      this.state.post.sharedText != undefined &&
      this.state.post.sharedText != null &&
      this.state.post.sharedText.trim() != '' &&
      this.state.post.sharedText != ''
    ) {
      text = this.state.post.sharedText;
      // text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      text = text.replace(
        /#[a-z]+/g,
        '<a target="_blank" href="/search?filter=posts&q=$&">$&</a>'
      );

      const sss = he.decode(text);
      const matches = sss.match(/\b(https?|http?):\/\/\S+/gi);
      this.setState({
        url: matches !== null && matches.length > 0 ? matches[0] : null,
        sharedContent: sss,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    let i;
    if (
      prevProps.post._id != this.props.post._id ||
      prevProps.post.comment != this.props.post.comment
    ) {
      this.setState(
        {
          post: this.props.post,
          posts: this.props.posts,
          currPost: this.props.post,
        },
        () => {
          var post = this.state.post;

          this.showComments(this.state.post._id);
          this.processText();
        }
      );
      try {
        i = this.props.post.contents[0].content_url;
        this.setState({
          images: [i],
        });
      } catch (error) {
        /* empty */
      }
    }
    if (prevState.posts != this.state.posts) {
      this.setState(
        {
          post: this.props.post,
          posts: this.props.posts,
          currPost: this.props.post,
        },
        () => {
          var post = this.state.post;
          this.showComments(this.state.post._id);
          this.processText();
        }
      );
      try {
        i = this.props.post.contents[0].content_url;
        this.setState({
          images: [i],
        });
      } catch (error) {
        /* empty */
      }
    }
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

  postActivityCount = (
    activityType,
    action = ConstantTribes.GrpStatusEnum.ADD
  ) => {
    const postObj = this.state.post;
    if (!postObj.liked_users) {
      postObj.liked_users = [];
    }
    if (!postObj.sharedUserInfo) {
      postObj.sharedUserInfo = [];
    }
    if (!postObj[activityType]) {
      postObj[activityType] = 0;
    }
    if (action == ConstantTribes.GrpStatusEnum.SUB) {
      postObj[activityType] = postObj[activityType] - +1;
      if (activityType === ConstantTribes.GrpStatusEnum.LIKESCOUNT) {
        postObj.likeActive = postObj.likeActive - 1;
        postObj.liked_users = postObj.liked_users.filter((obj) => {
          return obj._id !== this.props.currentUser._id;
        });
      } else if (activityType === ConstantTribes.GrpStatusEnum.REPLYCOUNT) {
        postObj.repliesCount = postObj.repliesCount - 1;
      }
    } else {
      postObj[activityType] = postObj[activityType] + +1;
      postObj.likeActive = postObj.likeActive + 1;
      if (activityType === ConstantTribes.GrpStatusEnum.LIKESCOUNT) {
        postObj.liked_users.push({
          _id: this.props.currentUser._id,
          name: this.props.currentUser.name,
          avatar: this.props.currentUser.avatar,
        });
      }
      if (activityType === ConstantTribes.GrpStatusEnum.SHARECOUNT) {
        postObj.sharedUserInfo.push({
          _id: this.props.currentUser._id,
          name: this.props.currentUser.name,
          avatar: this.props.currentUser.avatar,
        });
      }
    }
    this.setState({ post: postObj });
  };

  likePostFn = (postId, group_id) => {
    var d = {};
    d['post_id'] = postId;
    d['group_id'] = group_id;
    group.likeAdd(d).then((result) => {
      if (ConstantTribes.GrpStatusEnum.LIKES == result.message) {
        this.postActivityCount(ConstantTribes.GrpStatusEnum.LIKESCOUNT);
      } else if (ConstantTribes.GrpStatusEnum.DISLIKES == result.message) {
        this.postActivityCount(
          ConstantTribes.GrpStatusEnum.LIKESCOUNT,
          ConstantTribes.GrpStatusEnum.SUB
        );
      }
    });
  };

  showComments = (postId, group_id) => {
    var d = {};
    d['post_id'] = postId;
    d['group_id'] = group_id;
    // group.groupComments(d).then((result)=>{
    // this.setState({showComments:true})
    // this.setState({ post: { ...this.state.post, comment: result } })
    // })
  };

  openComments = (postId, group_id) => {
    var d = {};
    d['post_id'] = postId;
    d['group_id'] = group_id;
    const tempPostData = this.state.post;
    tempPostData.showComments = true;
    this.setState({ showComments: true });
  };

  showCommentReplies = (i, post_id, comment_id, group_id) => {
    var d = {};
    d['comment_id'] = comment_id;
    d['post_id'] = post_id;
    d['group_id'] = group_id;
    let index = this.state.post.comment.findIndex(
      (el) => el._id === comment_id
    );
    const tempPostData = this.state.post;
    tempPostData.comment[index].showReply = true;
    this.setState({ post: tempPostData });
  };

  postCmt = (postId, group_id) => {
    if (
      this.state.commentText != '' &&
      this.state.commentText.trim() != '' &&
      this.state.commentText != null
    ) {
      switchLoader(true, 'Please wait. Commenting...');
      let obj = {
        post_id: postId,
        message: this.state.commentText,
        group_id: group_id,
      };
      group.SendComments(obj).then(
        async (resp) => {
          const tempPostData = this.state.post;
          tempPostData.showComments = true;
          this.setState({ showComments: true, commentText: '' });
          this.props.OnPostCrdStatus(true);
          switchLoader();
        },
        (error) => {
          alertBox(true, 'Error send Comment');
          switchLoader();
        }
      );
    }
  };

  commentReply = (postid, group_id, commentId, comment) => {
    if (comment != '' && comment.trim() != '' && comment != null) {
      switchLoader(true, 'Please wait. Commenting...');
      let obj = {
        post_id: postid,
        message: comment,
        group_id: group_id,
        comment_id: commentId,
        type: 'replyCmt',
      };
      group.SendComments(obj, true).then(
        async (resp) => {
          switchLoader();
          this.props.OnPostCrdStatus(true);
        },
        (error) => {
          alertBox(true, 'Error send Comment');
          switchLoader();
        }
      );
    }
  };

  callBackCommentReply = (replyData, commentIndex) => {
    let postObj = this.state.post;
    if (postObj.comment && postObj.comment[commentIndex]) {
      if (postObj.comment[commentIndex].replies) {
        postObj.comment[commentIndex].replies.push(replyData);
      } else {
        postObj.comment[commentIndex].replies = [replyData];
      }
      postObj.comment[commentIndex].repliesCount =
        postObj.comment[commentIndex].replies.length;
      let tempReplyCmt = this.state.replyCmt;
      tempReplyCmt[commentIndex] = '';
      this.setState({ post: postObj, replyCmt: tempReplyCmt });
    }
  };
  commentActivityCount = (
    commentId,
    activityType,
    action = ConstantTribes.GrpStatusEnum.ADD
  ) => {
    const post = this.state.post;
    const postObj = post.comment[commentId];
    if (!postObj[activityType]) {
      postObj[activityType] = 0;
    }
    if (action == ConstantTribes.GrpStatusEnum.SUB) {
      postObj[activityType] = postObj[activityType] - +1;
    } else {
      postObj[activityType] = postObj[activityType] + +1;
    }
    post.comment[commentId] = postObj;
    this.setState({ post: post });
  };

  commentLike = (key, postid, commentId, group_id) => {
    var obj = { comment_id: commentId, group_id: group_id, post_id: postid };
    group.UpdatelikeComments(obj, true).then(async (resp) => {
      if (ConstantTribes.GrpStatusEnum.LIKES == resp.message) {
        this.commentActivityCount(key, ConstantTribes.GrpStatusEnum.LIKESCOUNT);
      } else if (ConstantTribes.GrpStatusEnum.DISLIKES == resp.message) {
        this.commentActivityCount(
          key,
          ConstantTribes.GrpStatusEnum.LIKESCOUNT,
          ConstantTribes.GrpStatusEnum.SUB
        );
      }
    });
  };

  deleteComment = (type, postid, group_id, id, postdetail, replyid) => {
    var obj = {};
    if (type == 'comment') {
      obj = {
        comment_id: id,
        type: 'comment',
        post_id: postid,
        group_id: group_id,
      };
    } else {
      obj = {
        comment_id: id,
        reply_id: replyid,
        type: 'reply',
        post_id: postid,
        group_id: group_id,
      };
    }
    group.RemoveComments(obj, true).then(
      async (resp) => {
        if (type == 'comment') {
          if (resp.message == 'success') {
            this.props.OnPostCrdStatus(true);
            alertBox(true, 'Successfully delete the comment', 'success');
          } else {
            alertBox(true, 'Error delete the comment', 'success');
          }
          this.showComments(postid, group_id);
          this.postActivityCount(
            ConstantTribes.GrpStatusEnum.CMTSCOUNT,
            ConstantTribes.GrpStatusEnum.SUB
          );
        } else {
          if (resp.message == 'success') {
            this.props.OnPostCrdStatus(true);
            alertBox(true, 'Successfully delete the reply comment', 'success');
          } else {
            alertBox(true, 'Error delete the reply comment', 'success');
          }
          this.showCommentReplies(id);
          this.postActivityCount(
            ConstantTribes.GrpStatusEnum.REPLYCOUNT,
            ConstantTribes.GrpStatusEnum.SUB
          );
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

  shareSuccess = () => {
    // this.props.parentCallback({
    //     type: 'post_share'
    // })
    // this.props.OnPostCrdStatus(true);
    this.postActivityCount(ConstantTribes.GrpStatusEnum.SHARECOUNT);
  };

  removePost = (postid, groupid) => {
    var d = {};
    d['post_id'] = postid;
    d['userid'] = this.props.currentUser._id;
    d['groupid'] = groupid;
    d['typecrd'] = 'delete_post';
    group.UpdateDeletePost(d).then((result) => {
      if (result.message == 'success') {
        this.props.OnPostCrdStatus(true);
        alertBox(true, 'Successfully delete the post', 'success');
      } else {
        this.props.OnPostCrdStatus('delete_post_error');
        alertBox(true, 'Error delete the post', 'success');
      }
    });
  };

  UpdatesavePost = (postid, group_id) => {
    group.UpdatesavePost({ post_id: postid, group_id: group_id }).then(
      (result) => {
        if (result.status) {
          let postobj = this.state.post;
          if (result.message == ConstantTribes.GrpStatusEnum.SAVED) {
            postobj.saved = 1;
          } else {
            postobj.saved = 0;
          }
          this.setState({ post: postobj });
          this.props.OnPostCrdStatus(true);
          alertBox(true, 'Successfully saved the post', 'success');
        }
      },
      (error) => {
        alertBox(true, 'Error saved the post');
      }
    );
  };

  getPostContent = (
    post,
    showComments,
    commentText,
    replyCmt,
    shared = false
  ) => {
    const arrowStyles = {
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      width: 50,
      bottom: 0,
      height: '100%',
      cursor: 'pointer',
      color: '#fff',
      fontSize: '2rem',
    };
    return (post && post !== undefined && post !== null && post.removed > 0) ||
      (post.privacy == 'onlyme' &&
        this.props.filter != 'hidden' &&
        post.userid != this.props.currentUser._id) ? null : (
      <div className="container new-post-inner my-4" key={`${post._id}1`}>
        <div className=" row p-2 p-sm-2">
          <div className="post-wrapper py-2">
            <div className=" post-header">
              <div className="post-header-left">
                <A href={'/u/' + post.userinfo._id}>
                  <img
                    className="media-object post-header-pic"
                    src={profilePic(post.userinfo.avatar, post.userinfo.name)}
                    alt="..."
                  />
                </A>
                <div className="post-header-details">
                  {this.props.page != 'groupfeed' && (
                    <A href={'/tribesfeeds/' + post.groupsdata._id}>
                      <p className="post-user">
                        {post.groupsdata.name} - (Group Post){' '}
                      </p>
                    </A>
                  )}
                  <A href={'/u/' + post.userinfo._id}>
                    <p className="post-user">
                      {post.userinfo && post.userinfo.name
                        ? post.userinfo.name
                        : ''}
                    </p>
                  </A>
                  <p className="post-time d-flex align-items-center justify-content-start">
                    {' '}
                    <A href={'/post/' + (shared ? post.sharedPost : post._id)}>
                      <TimeAgo date={post.createdAt} />
                    </A>{' '}
                    {post.privacy == 'onlyme' && (
                      <i className="fa fa-lock ms-2"></i>
                    )}
                  </p>
                </div>
              </div>
              <div className="post-header-right">
                <div className="pointer  dropdown">
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  <div className="dropdown-menu  dropdown-menu-right">
                    {this.props.page != 'groupfeed' && (
                      <a className="dropdown-item">
                        <i className="fa fa-search"></i>
                        <span className="m-1">View Group</span>
                      </a>
                    )}
                    {this.props.currentUser._id == post.userinfo._id && (
                      <>
                        <a className="dropdown-item">
                          <i className="fa fa-edit"></i>
                          <span className="m-1">Edit</span>
                        </a>

                        <a
                          className="dropdown-item"
                          onClick={(e) =>
                            this.removePost(post._id, post.groupsdata._id)
                          }
                        >
                          <i className="fa fa-trash-o"></i>
                          <span className="m-1">Remove Post</span>
                        </a>
                      </>
                    )}

                    {this.props.currentUser._id != post.userinfo._id && (
                      <>
                        <a
                          className="dropdown-item"
                          onClick={(e) =>
                            this.UpdatesavePost(post._id, post.groupsdata._id)
                          }
                        >
                          <i className="fa fa-star-o"></i>
                          <span className="m-1">
                            {' '}
                            {post.saved > 0
                              ? ConstantTribes.TribesLabels.POST_UN_SAVE_LABEL
                              : ConstantTribes.TribesLabels.POST_SAVE_LABEL}
                          </span>
                        </a>
                        <a className="dropdown-item">
                          <i className="fa fa-flag-o"></i>
                          <span className="m-1">Report</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="post-body container p-2 pt-4 pb-3">
              {/* <ReactLinkify options={{target:'blank'}}>
                             {this.state.content} 
                         </ReactLinkify> */}
              <p
                dangerouslySetInnerHTML={{ __html: `${this.state.content}` }}
                style={{ overflowWrap: 'anywhere' }}
              ></p>

              {Array.isArray(this.state.url) &&
                this.state.url.map((url) => <UrlPreview url={url} key={url} />)}
              {post.contents != undefined && post.contents.length !== 0 && (
                <div className="w-100 pointer post-image-thumb">
                  {post.contents?.map((content, i) => {
                    return i < 5 ? (
                      content.contenttype == 'Image' ? (
                        <div key={i + 'csv'} className="image-wrapper">
                          <img
                            src={content.content_url}
                            className="post-image-content"
                            onClick={() => this.handlePostPreview(post._id, i)}
                          />{' '}
                        </div>
                      ) : (
                        <ReactPlayer
                          key={i + 'csv'}
                          className="post-video-content"
                          controls={true}
                          url={content.content_url}
                          width="auto"
                          height="auto"
                        />
                      )
                    ) : i == 5 ? (
                      <div
                        key={i + 'csv'}
                        className="post-images-more"
                        onClick={() => this.handlePostPreview(post._id)}
                      >
                        <img
                          src={content.content_url}
                          className="post-image-content"
                        />
                        <div>
                          <span>+{post.contents.length - i} more</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="new-post-tags-block">
                {post.taggedPeople && post.taggedPeople.length !== 0 && (
                  <div className="new-post-tags">
                    <span>
                      {' '}
                      <i className="fa-solid fa-user-tag"></i>
                      {post.taggedPeople.map((tagPeople, j) => {
                        if (j < 3) {
                          return (
                            <Link
                              className="tagged-name ms-1 pointer"
                              to={'/u/' + tagPeople._id}
                              key={j}
                            >
                              {tagPeople.name}
                              {j < post.taggedPeople.length - 1 ? ',' : ''}
                            </Link>
                          );
                        }
                        if (j == 3) {
                          return (
                            <>
                              <span
                                className="tagged-name pointer ms-1"
                                onClick={() =>
                                  this.setState({ moreTags: true })
                                }
                                key={j + 'more'}
                                hidden={this.state.moreTags}
                              >
                                and {post.taggedPeople.length - j} more
                              </span>{' '}
                              <Link
                                className="tagged-name ms-1 pointer  "
                                hidden={!this.state.moreTags}
                                to={'/u/' + tagPeople._id}
                                key={j}
                              >
                                {tagPeople.name}
                                {j < post.taggedPeople.length - 1 ? ',' : ''}
                              </Link>
                            </>
                          );
                        }
                        if (j > 3) {
                          return (
                            <Link
                              className="tagged-name ms-1 pointer "
                              hidden={!this.state.moreTags}
                              to={'/u/' + tagPeople._id}
                              key={j}
                            >
                              {tagPeople.name}
                              {j < post.taggedPeople.length - 1 ? ',' : ''}
                            </Link>
                          );
                        }
                      })}
                    </span>
                  </div>
                )}
              </div>

              {post.sharedType == 'group_post' || post.sharedType == 'group'
                ? this.getSharedContent(
                    post.sharedType,
                    post.sharedType == 'group_post'
                      ? post.sharedPostDetails
                      : post
                  )
                : null}
            </div>
            <div className="post-footer">
              <div className="d-flex post-meta align-items-center ">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center me-1"
                    onClick={(e) =>
                      this.likePostFn(post._id, post.groupsdata._id)
                    }
                  >
                    {post.likeActive === 1 ? (
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        className="post-meta-icon"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_1_70)">
                          <mask
                            id="mask0_1_70"
                            style={{ maskType: 'luminance' }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="25"
                            height="25"
                          >
                            <path d="M25 0H0V25H25V0Z" fill="white" />
                          </mask>
                          <g mask="url(#mask0_1_70)">
                            <path
                              d="M18.0839 20.8333H6.25014C5.09955 20.8333 4.16681 19.9006 4.16681 18.75V10.4167H8.26017C8.95675 10.4167 9.60723 10.0685 9.99361 9.48895L12.6141 5.55822C13.1937 4.68884 14.1694 4.16666 15.2143 4.16666H15.4372C16.0809 4.16666 16.5704 4.74465 16.4647 5.37957L15.6251 10.4167H19.3339C20.6486 10.4167 21.6346 11.6195 21.3768 12.9085L20.1268 19.1585C19.932 20.1324 19.077 20.8333 18.0839 20.8333Z"
                              fill="#5832E0"
                            />
                            <path
                              d="M8 10L8 21"
                              stroke="white"
                              strokeWidth="2"
                            />
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_1_70">
                            <rect width="25" height="25" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
                      <svg
                        width="25"
                        height="25"
                        className="post-meta-icon"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_10_5)">
                          <mask
                            id="mask0_10_5"
                            style={{ maskType: 'luminance' }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="25"
                            height="25"
                          >
                            <path d="M25 0H0V25H25V0Z" fill="white" />
                          </mask>
                          <g mask="url(#mask0_10_5)">
                            <path
                              d="M18.0838 20.8333H6.25008C5.09949 20.8333 4.16675 19.9006 4.16675 18.75V10.4166H8.26011C8.95669 10.4166 9.60716 10.0685 9.99355 9.48892L12.614 5.55819C13.1936 4.68881 14.1693 4.16663 15.2142 4.16663H15.4371C16.0808 4.16663 16.5704 4.74462 16.4646 5.37954L15.6251 10.4166H19.3338C20.6485 10.4166 21.6345 11.6194 21.3767 12.9085L20.1267 19.1585C19.9319 20.1324 19.0769 20.8333 18.0838 20.8333Z"
                              stroke="#868686"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.33337 10.4166V20.8333"
                              stroke="#868686"
                              strokeWidth="2"
                            />
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_10_5">
                            <rect width="25" height="25" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                  </div>
                  <span
                    style={{ display: 'inline-block', minWidth: '35px' }}
                    className="pointer"
                  >
                    {post.likesCount > 0 && (
                      <Dropdown items={post.liked_users}>
                        <span className="font-weight-bold drop-trigger ms-1">
                          {' '}
                          {post.likesCount}
                        </span>
                      </Dropdown>
                    )}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  {
                    <div
                      className="pointer d-flex align-items-center"
                      onClick={() =>
                        this.openComments(post._id, post.groupsdata._id)
                      }
                    >
                      <i className="fa-regular fa-comment me-2"></i>
                      <span className="">
                        {post.cmtsCount > 0 && post.cmtsCount}{' '}
                      </span>
                    </div>
                  }
                </div>
                <div className="ms-auto d-flex align-items-center">
                  {
                    <span className="m-1" style={{ cursor: 'pointer' }}>
                      {' '}
                      {post.shareCount > 0 && (
                        <Dropdown flag={'right'} items={post.sharedUserInfo}>
                          <span className="m-1 font-weight-bold drop-trigger">
                            {' '}
                            {post.shareCount}{' '}
                          </span>
                        </Dropdown>
                      )}
                    </span>
                  }

                  {
                    <i
                      className="fa-solid fa-retweet pointer ms-1 "
                      onClick={(e) => this.sharePost(post)}
                    ></i>
                  }
                </div>
              </div>
              {
                <div>
                  {showComments && (
                    <div className="post-add-comment">
                      <img
                        className="post-comment-profile"
                        src={profilePic(
                          this.props.currentUser?.avatar,
                          this.props.currentUser?.name
                        )}
                        alt="profile"
                      />
                      <input
                        className="post-comment-input"
                        type="text"
                        placeholder="Say something.."
                        name="commentText"
                        value={commentText}
                        onChange={(e) => this.handleChange(e)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            this.postCmt(post._id, post.groupsdata._id);
                          }
                        }}
                      />
                      <button
                        className="roundBtn"
                        onClick={() =>
                          this.postCmt(post._id, post.groupsdata._id)
                        }
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              }
              {showComments && post.comment?.length !== 0 && (
                <p className="comment-title">Comments</p>
              )}
              {showComments &&
                post.comment.length > 0 &&
                post.comment.map(
                  (comment, i) =>
                    comment.userinfo != undefined && (
                      <div className="post-comments" key={i}>
                        <div className="post-comment-row">
                          <div className="">
                            <A href={'/u/' + comment.userinfo._id}>
                              <img
                                className="post-comment-user-profile"
                                src={profilePic(
                                  comment.userinfo.avatar,
                                  comment.userinfo.name
                                )}
                                alt="..."
                              />
                            </A>
                          </div>
                          <div className=" flex-grow-1">
                            <div className=" d-flex  w-100">
                              <div className="post-comment-reply-block">
                                <div className="post-comment-details">
                                  <A href={'/u/' + comment.userinfo._id}>
                                    <p className="media-heading post-comment-user-name">
                                      {comment.userinfo.name}
                                    </p>
                                  </A>
                                  <p className="post-comment-comment">
                                    {comment.message}
                                  </p>
                                  <div className="d-flex  post-comment-meta">
                                    <span
                                      className="post-comment-icon pointer"
                                      onClick={(e) =>
                                        this.commentLike(
                                          i,
                                          post._id,
                                          comment._id,
                                          post.groupsdata._id
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-thumbs-up"></i>

                                      {comment.likesCount &&
                                      comment.likesCount > 0
                                        ? comment.likesCount
                                        : ''}
                                    </span>
                                    <span
                                      className=" post-comment-icon  pointer"
                                      onClick={(e) =>
                                        this.showCommentReplies(
                                          i,
                                          post._id,
                                          comment._id,
                                          post.groupsdata._id
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-reply"></i>{' '}
                                      {comment.repliesCount &&
                                      comment.repliesCount > 0
                                        ? comment.repliesCount
                                        : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="ms-auto post-comment-more ">
                                <div className=" pointer  dropdown">
                                  <i className="fa fa-ellipsis-v"></i>
                                  <div className="dropdown-menu  dropdown-menu-right">
                                    {(comment.userinfo._id ==
                                      this.props.currentUser._id ||
                                      post.userid ==
                                        this.props.currentUser._id) && (
                                      <a
                                        className="dropdown-item"
                                        onClick={(e) =>
                                          this.deleteComment(
                                            'comment',
                                            post._id,
                                            post.groupsdata._id,
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
                                            this.unReport(
                                              'comment',
                                              comment._id,
                                              i
                                            )
                                          }
                                        >
                                          <i className="mr-1 fa fa-undo"></i>
                                          <span className="m-1">
                                            Undo-Report
                                          </span>
                                        </a>
                                      ) : (
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            this.reportModal(
                                              'comment',
                                              comment,
                                              i
                                            )
                                          }
                                        >
                                          <i className="mr-1 fa fa-exclamation-circle"></i>
                                          <span className="m-1">Report</span>
                                        </a>
                                      )
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {comment.replies &&
                              comment.showReply == true &&
                              comment.replies.map(
                                (reply, r) =>
                                  reply.userinfo != undefined && (
                                    <div
                                      className="post-comment-inner post-comment-row w-100 d-flex "
                                      key={r}
                                    >
                                      <div className="media-left ">
                                        <A href={'/u/' + reply.userinfo._id}>
                                          <img
                                            className="post-comment-user-profile"
                                            src={profilePic(
                                              reply.userinfo.avatar != undefined
                                                ? reply.userinfo.avatar
                                                : '',
                                              reply.userinfo.name
                                            )}
                                            alt="..."
                                          />
                                        </A>
                                      </div>
                                      <div className="post-comment-reply">
                                        <A href={'/u/' + reply.userinfo._id}>
                                          <p className="post-comment-comment-name">
                                            {reply.userinfo
                                              ? reply.userinfo.name
                                              : reply.userinfo.name}
                                          </p>
                                        </A>
                                        <p className="post-comment-user-comment">
                                          {reply.message}
                                        </p>
                                      </div>
                                      <div className="ms-auto h-auto  post-comment-inner-more">
                                        <div className="pointer  dropdown">
                                          <i className=" fa fa-ellipsis-v"></i>
                                          <div className="dropdown-menu dropdown-menu-right">
                                            {(reply.userinfo._id ==
                                              this.props.currentUser._id ||
                                              post.userid ==
                                                this.props.currentUser._id) && (
                                              <a
                                                className="dropdown-item"
                                                onClick={(e) =>
                                                  this.deleteComment(
                                                    'reply',
                                                    post._id,
                                                    post.groupsdata._id,
                                                    comment._id,
                                                    post,
                                                    reply._id
                                                  )
                                                }
                                              >
                                                <img
                                                  className="mr-1"
                                                  src={require('../../assets/images/remove-icon.png')}
                                                />
                                                <span className="m-1">
                                                  Delete
                                                </span>
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
                                                  <i className="mr-1 fa fa-undo"></i>
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
                                                  <i className="mr-1 fa fa-exclamation-circle"></i>
                                                  <span className="m-1">
                                                    Report
                                                  </span>
                                                </a>
                                              )
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                              )}
                            {comment.showReply}
                            {comment.showReply == true && (
                              <div className="post-comment-reply-add">
                                <img
                                  className="post-comment-profile"
                                  src={profilePic(
                                    this.props.currentUser?.avatar,
                                    this.props.currentUser?.name
                                  )}
                                  alt="profile"
                                />

                                <input
                                  className="post-comment-input"
                                  type="text"
                                  placeholder="Say something.."
                                  name="replyCmt"
                                  value={replyCmt[i]}
                                  onChange={(e) => this.handleChange(e, i)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      this.commentReply(
                                        post._id,
                                        post.groupsdata._id,
                                        comment._id,
                                        replyCmt[i]
                                      );
                                    }
                                  }}
                                />
                                <button
                                  className="roundBtn"
                                  onClick={() =>
                                    this.commentReply(
                                      post._id,
                                      post.groupsdata._id,
                                      comment._id,
                                      replyCmt[i]
                                    )
                                  }
                                >
                                  <i className="fa-solid fa-angle-right"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
        {this.state.isOpen && (
          <Lightbox
            id={'light' + post._id}
            enableZoom={false}
            mainSrc={post.contents[0].content_url}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
        {this.state.isPostReport && (
          <PostReportModal
            parentCallback={this.handleCallbackReport}
            isPostReport={this.state.isPostReport}
            postId={this.state.postId}
          />
        )}
      </div>
    );
  };

  getSharedContent = (type, post) => {
    return post == undefined ? (
      <div className="deleted">
        <i className="fa fa-trash"></i> This content was removed
      </div>
    ) : post.removed > 0 ||
      (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
      <SharedGroupPostCard
        type={type}
        k={post._id}
        currentUser={this.props.currentUser}
        post={post}
        userinfo={
          type == 'group_post'
            ? post.sharedGrouppostUserdet
            : post.groupsdata.userinfo
        }
        contents={post.contents}
      />
    );
  };

  render() {
    const { post, showComments, commentText, replyCmt, key } = this.state;

    return post == null ? (
      <div className="text-center">
        <Spinner />
      </div>
    ) : (
      <React.Fragment>
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
        <div className={'post '}>
          {this.getPostContent(post, showComments, commentText, replyCmt)}
          {this.state.shareModel && (
            <Share
              sharedtype="group_post"
              post={this.state.currPost}
              shareSuccess={this.shareSuccess}
              closeShareModal={this.closeShareModal}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default GroupSinglePost;
