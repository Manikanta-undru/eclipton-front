import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Modal from '../../components/Popup';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';
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
import { switchLoader, alertBox } from '../../commonRedux/';
import A from '../A';
import { GetAssetImage, profilePic } from '../../globalFunctions';
import Dialog from '@material-ui/core/Dialog';
import EditPost from './EditPost';
import Spinner from '../Spinner';
import SharedPostCard from '../Cards/SharedPostCard';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import he from 'he';
import Dropdown from '../Dropdown';
import PostReportModal from '../Report/post';
import { removeReport } from '../../http/wallet-calls';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import UrlPreview from './UrlPreview';
require('./styles.scss');

const reactStringReplace = require('react-string-replace');

class Post extends React.Component {
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
    // this.likePostFn = this.likePostFn.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.postActivityCount = this.postActivityCount.bind(this);
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
        var post = this.state.post;
        if (
          this.props.single &&
          (post.userid == this.props.currentUser._id ||
            (post.settings[0] != undefined &&
              (post.settings[0].comments == 'Everyone' ||
                (post.settings[0].comments == 'Friends' &&
                  //friend_result.length > 0
                  post.followings.length > 0))))
        ) {
          this.showComments(this.state.post._id);
        }
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
    if (prevProps.post._id != this.props.post._id) {
      this.setState(
        {
          post: this.props.post,
          posts: this.props.posts,
          currPost: this.props.post,
        },
        () => {
          var post = this.state.post;
          if (
            this.props.single &&
            (post.userid == this.props.currentUser._id ||
              (post.settings[0] != undefined &&
                (post.settings[0].comments == 'Everyone' ||
                  (post.settings[0].comments == 'Friends' &&
                    //friend_result.length > 0
                    post.followings.length > 0))))
          ) {
            this.showComments(this.state.post._id);
          }
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
          if (
            this.props.single &&
            (post.userid == this.props.currentUser._id ||
              (post.settings[0] != undefined &&
                (post.settings[0].comments == 'Everyone' ||
                  (post.settings[0].comments == 'Friends' &&
                    //friend_result.length > 0
                    post.followings.length > 0))))
          ) {
            this.showComments(this.state.post._id);
          }
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

  postActivityCount = (activityType, action = 'add') => {
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
    if (action == 'sub') {
      postObj[activityType] = postObj[activityType] - +1;
      if (activityType === 'likesCount') {
        postObj.liked_users = postObj.liked_users.filter((obj) => {
          return obj._id !== this.props.currentUser._id;
        });
      }
    } else {
      postObj[activityType] = postObj[activityType] + +1;
      if (activityType === 'likesCount') {
        postObj.liked_users.push({
          _id: this.props.currentUser._id,
          name: this.props.currentUser.name,
          avatar: this.props.currentUser.avatar,
        });
      }
      if (activityType === 'shareCount') {
        postObj.sharedUserInfo.push({
          _id: this.props.currentUser._id,
          name: this.props.currentUser.name,
          avatar: this.props.currentUser.avatar,
        });
      }
    }
    this.setState({ post: postObj });
    //get post
    if (this.props.setProp != undefined) {
      this.props.setProp('issharedpost', 1);
      this.props.setProp('isloader', true);
    }
  };

  commentActivityCount = (commentId, activityType, action = 'add') => {
    const post = this.state.post;
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
    this.setState({ post: post });
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

  deleteComment = (type, postid, id, postdetail) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    removeComment({ id }, true).then(
      async (resp) => {
        if (type == 'comment') {
          this.showComments(postid);
          this.postActivityCount('cmtsCount', 'sub');
        } else {
          this.showCommentReplies(postid);
          var replycounnt = postdetail.comment[0]['repliesCount'] - 1;
          postdetail.comment[0]['repliesCount'] = replycounnt;
          this.setState({ post: postdetail });
        }
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  commentReply = (postid, commentId, comment, commentIndex, callBack, post) => {
    if (comment != '' && comment.trim() != '' && comment != null) {
      replyComment({ postid: postid, commentId, comment }, true).then(
        async (resp) => {
          var postdetails = post;
          if (post.comment[0]['repliesCount'] != undefined) {
            var update_reply_count =
              post.comment != undefined
                ? post.comment[0]['repliesCount'] + 1
                : 1;
            postdetails.comment[0]['repliesCount'] = update_reply_count;
          } else {
            // postdetails.comment[0] = postdetails.comment[0];
            postdetails.comment[0]['repliesCount'] = 1;
          }
          this.setState({ post: postdetails });
          callBack(resp.comment, commentIndex);
        },
        (error) => {}
      );
    }
  };
  savePost = (id) => {
    //modal(true, "sdf");
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
        if (this.props.history != undefined) {
          if (
            this.props.history.location.pathname == '/profile' ||
            this.props.history.location.pathname == '/profile/feed/saved'
          ) {
            window.location.href = '/profile/feed/saved';
          }
        }
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
      var p = this.state.lastData;
      var t = this.state.lastType;
      var key = this.state.lastKey;
      var c = this.state.lastComment;
      var key2 = this.state.lastKey2;
      var link = '';
      if (t == 'comment') {
        link = p.text;
      } else if (t == 'reply') {
        link = p.text;
      } else {
        link = 'post/' + p._id;
      }
      postReport({
        id: p._id,
        type: t,
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          let temp = {};
          alertBox(true, resp.message, 'success');
          if (t == 'comment') {
            temp = this.state.post;
            temp.comment[key]['reported'] = 1;
            this.setState({ post: temp, reportModal: false });
          } else if (t == 'reply') {
            temp = this.state.post;
            temp.comment[key2].replies[key]['reported'] = 1;
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
  unReport = (type, id, key = null, key2 = null) => {
    var con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id: id }).then(
        async (resp) => {
          let temp;
          alertBox(true, resp.message, 'success');
          if (type == 'comment') {
            temp = this.state.post;
            temp.comment[key]['reported'] = 0;
            this.setState({ post: temp });
          } else if (type == 'reply') {
            temp = this.state.post;
            temp.comment[key2].replies[key]['reported'] = 0;
            this.setState({ post: temp });
          } else {
            removeReport({ item_id: id }).then(
              async (resp) => {},
              (error) => {
                alertBox(true, 'Something went wrong!');
              }
            );
            this.setState({ post: { ...this.state.post, reported: 0 } });
          }
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
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
    var id = this.state.last;
    this.setState({ open: false, last: null });
    postRemove({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ post: { ...this.state.post, removed: 1 } });
        // var allPost = this.state.posts;
        // if(allPost.length > 0){
        //     allPost.map((items) => {
        //         if(items._id == id){
        //             items.removed = 1;
        //         }
        //     })
        //     this.props.setProp("posts",allPost);
        if (
          this.props.history != undefined &&
          this.props.history.location.pathname != '/home'
        ) {
          window.location.href = '';
        }
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
          this.props.parentCallback({
            type: 'post_like',
          });
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
    if (
      this.state.commentText != '' &&
      this.state.commentText.trim() != '' &&
      this.state.commentText != null
    ) {
      switchLoader(true, 'Please wait. Commenting...');
      let obj = { postid, comment: this.state.commentText };
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
    }
  };

  showComments = (postid) => {
    switchLoader(true, 'Please wait, Loading comments...');
    getComments({ postid }, true).then(
      async (resp) => {
        switchLoader();
        this.setState({ showComments: true });
        this.setState({ post: { ...this.state.post, comment: resp } });
      },
      (error) => {
        switchLoader();
        alertBox(true, error.data.message);
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
    this.props.parentCallback({
      type: 'post_share',
    });
    // getNewsFeed({ userid: this.props.currentUser._id, limit: 5, page: 1 }, true)
    // .then(async resp => {
    //     var arr1 = resp.posts.post;
    //     if (arr1 !== undefined && arr1.length > 0) {
    //         this.setState({
    //             posts: arr1
    //         });
    //     }

    // });
    this.postActivityCount('shareCount');
  };

  showCommentReply = (commentId) => {
    let index = this.state.post.comment.findIndex((el) => el._id === commentId);
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
    tempPostData.contents = post.contents;
    tempPostData.privacy = post.privacy;
    let filter = '';
    if (post.privacy == 'onlyme') {
      filter = 'hidden';
    } else if (post.privacy == 'public') {
      filter = '';
    } else {
      filter = 'saved';
    }
    this.setState({ modal: false, post: tempPostData, filter: filter }, () => {
      this.processText();
    });

    this.props.updatePost(k, tempPostData);

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
        let index = this.state.post.comment.findIndex(
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
    let postObj = this.state.post;
    if (postObj.comment && postObj.comment[commentIndex]) {
      if (postObj.comment[commentIndex].replies) {
        postObj.comment[commentIndex].replies.push(replyData);
      } else {
        postObj.comment[commentIndex].replies = [replyData];
      }
      let tempReplyCmt = this.state.replyCmt;
      tempReplyCmt[commentIndex] = '';
      this.setState({ post: postObj, replyCmt: tempReplyCmt });
    }
  };

  handleReport(e, post_id) {
    e.preventDefault();
    this.setState({
      postId: post_id,
      isPostReport: true,
    });
  }

  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isPostReport: data.isPostReport,
        postId: data.postId,
        post: { ...this.state.post, reported: 1 },
      });
    } else {
      this.setState({
        isPostReport: data.isPostReport,
        postId: data.postId,
      });
    }
  };

  // wrapHash = (val) => {

  //     return val.replace(/#(\w+)/g, "<A href='/search/filter=posts&q=$&'>$&</A>").replace("q=#", "q=%23");
  // }

  render() {
    const { post, showComments, commentText, replyCmt, key } = this.state;
    //const friend_result = post && post !== undefined && post !== null && post.friends.length > 0 ? post.friends.filter(friend => friend.userid === this.props.currentUser._id) : [];
    let follow_result =
      post &&
      post !== undefined &&
      post !== null &&
      post.followings !== undefined &&
      post.followings.length > 0
        ? post.followings.filter(
            (follow) =>
              follow.followerid === post.userid || follow.userid === post.userid
          )
        : [];
    if (
      post !== null &&
      post.settings !== undefined &&
      post.settings[0] != undefined &&
      ((post.settings[0].comments !== undefined &&
        post.settings[0].comments == 'Friends Of Friends') ||
        (post.settings[0].follow !== undefined &&
          post.settings[0].follow == 'Friends Of Friends'))
    ) {
      follow_result =
        post &&
        post !== undefined &&
        post !== null &&
        post.followings.length > 0
          ? post.followings.filter(
              (follow) =>
                follow.userid === this.props.currentUser._id ||
                follow.followerid === this.props.currentUser._id
            )
          : [];
    }

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
        <Modal displayModal={this.state.modal} closeModal={this.editPost}>
          <EditPost
            {...this.props}
            post={post}
            updatePost={(p) => this.updatePost(key, p)}
          />
        </Modal>
        <div className={'post '}>
          {this.getPostContent(post, showComments, commentText, replyCmt)}

          {this.state.shareModel && (
            <Share
              post={this.state.currPost}
              shareSuccess={this.shareSuccess}
              closeShareModal={this.closeShareModal}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
  handlePostPreview = (id, i) => {
    if (this.state.post_modal === false) {
      this.setState({ post_modal: true, selectedItem: i });
      this.showComments(id);
    }
  };
  handlePostPreviewClose = () => {
    if (this.state.post_modal === true) {
      this.setState({ post_modal: false });
    }
  };
  getPostContent = (
    post,
    showComments,
    commentText,
    replyCmt,
    shared = false
  ) => {
    //const friend_result = post && post !== undefined && post !== null && post.friends.length > 0 ? post.friends.filter(friend => friend.userid === this.props.currentUser._id) : [];
    let follow_result =
      post &&
      post !== undefined &&
      post !== null &&
      post.followings !== undefined &&
      post.followings.length > 0
        ? post.followings.filter(
            (follow) => follow.userid === this.props.currentUser._id
          )
        : [];
    if (
      post !== null &&
      post.settings !== undefined &&
      post.settings[0] != undefined &&
      ((post.settings[0].comments !== undefined &&
        post.settings[0].comments == 'Friends Of Friends') ||
        post.settings[0].follow == 'Friends Of Friends')
    ) {
      follow_result =
        post &&
        post !== undefined &&
        post !== null &&
        post.followings !== undefined &&
        post.followings.length > 0
          ? post.followings.filter(
              (follow) =>
                follow.userid === this.props.currentUser._id ||
                follow.followerid === this.props.currentUser._id
            )
          : [];
    }
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
        {this.state.post_modal && (
          <div className="post-preview-modal">
            <div className="row h-100 overflow-scroll">
              <div className="col-md-8 p-0 post-preview-image-block">
                <div
                  className="post-preview-close"
                  onClick={this.handlePostPreviewClose}
                >
                  <i className="fa fa-times"></i>
                </div>

                {post.contents != undefined && (
                  <div className="w-100 pointer post-preview-image-thumb">
                    <Carousel
                      className="post-preview-carousel"
                      selectedItem={this.state.selectedItem}
                      showThumbs={false}
                      renderArrowPrev={(onClickHandler, hasPrev, label) =>
                        hasPrev && (
                          <button
                            type="button"
                            onClick={onClickHandler}
                            title={label}
                            style={{ ...arrowStyles, left: 15 }}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                        )
                      }
                      renderArrowNext={(onClickHandler, hasNext, label) =>
                        hasNext && (
                          <button
                            type="button"
                            onClick={onClickHandler}
                            title={label}
                            style={{ ...arrowStyles, right: 15 }}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        )
                      }
                    >
                      {post.contents?.map((content, i) => {
                        return content.contenttype == 'Image' ? (
                          <div key={i + 'content'}>
                            <img src={content.content_url} className="" />{' '}
                          </div>
                        ) : (
                          <div key={i + 'content'} style={{ height: '100%' }}>
                            <ReactPlayer
                              controls={true}
                              url={content.content_url}
                              className="post-preview-video"
                            />
                          </div>
                        );
                      })}
                    </Carousel>
                  </div>
                )}
              </div>
              <div className="col-md-2 flex-grow-1 p-sm-3 p-4 pb-sm-0 pe-sm-4 h-100">
                <div className="post-wrapper py-2 h-100 overflow-hidden">
                  <div className=" post-header">
                    <div className="post-header-left">
                      <A href={'/u/' + post.userinfo._id}>
                        <img
                          className="media-object post-header-pic"
                          src={profilePic(
                            post.userinfo.avatar,
                            post.userinfo.name
                          )}
                          alt="..."
                        />
                      </A>
                      <div className="post-header-details">
                        <A href={'/u/' + post.userinfo._id}>
                          <p className="post-user">
                            {post.userinfo && post.userinfo.name
                              ? post.userinfo.name
                              : ''}
                          </p>
                        </A>
                        <p className="post-time d-flex align-items-center justify-content-start">
                          {' '}
                          <A
                            href={
                              '/post/' + (shared ? post.sharedPost : post._id)
                            }
                          >
                            <TimeAgo date={post.createdAt} />
                          </A>{' '}
                          {post.privacy == 'onlyme' && (
                            <i className="fa fa-lock ms-2"></i>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="post-header-right">
                      <div>
                        {post.twitterPost && (
                          <li className="list-group-item splLi">
                            <img
                              className=" extraSmallIcon"
                              src={GetAssetImage('icons/twitter.svg')}
                            />
                          </li>
                        )}
                      </div>
                      <div className="bookmark">
                        {post.saved > 0 ? (
                          <i
                            onClick={(e) => this.unsavePost(post._id)}
                            className="fa-solid  fa-bookmark"
                          ></i>
                        ) : (
                          <i
                            onClick={(e) => this.savePost(post._id)}
                            className="fa-regular fa-bookmark"
                          ></i>
                        )}
                      </div>
                      <div className="pointer  dropdown">
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                        <div className="dropdown-menu  dropdown-menu-right">
                          {post.userid == this.props.currentUser._id && (
                            <a
                              className="dropdown-item"
                              onClick={(e) => this.editPost(post._id)}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
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

                          {post.userid != this.props.currentUser._id &&
                            post.reported > 0 && (
                              <a
                                className="dropdown-item"
                                onClick={(e) => this.unReport('post', post._id)}
                              >
                                <i className="mr-1 fa fa-undo"></i>
                                <span className="m-1">Undo-Report</span>
                              </a>
                            )}
                          {post.userid != this.props.currentUser._id &&
                            post.reported <= 0 && (
                              <a
                                className="dropdown-item"
                                onClick={(e) => this.handleReport(e, post._id)}
                                //onClick={() => this.reportModal('post', post)}
                              >
                                <i className="fa-solid fa-circle-exclamation"></i>
                                <span className="m-1">Report </span>
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
                              <i className="fa-regular fa-trash-can"></i>
                              <span className="m-1">Remove</span>
                            </a>
                          )}

                          {/* <a className="dropdown-item" onClick={(e) => this.reportPost(post._id)}>
                                                <i className="fa fa-exclamation-circle"></i>
                                                <span className="m-1">Report</span></a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="post-body p-2 pt-4">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `${this.state.content}`,
                      }}
                      style={{ overflowWrap: 'anywhere' }}
                    ></p>

                    {
                      // this.state.url && this.state.url?.map(url=><UrlPreview url ={url}/>)

                      Array.isArray(this.state.url) &&
                        this.state.url.map((url) => (
                          <UrlPreview url={url} key={url} />
                        ))
                    }

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
                                    {j < post.taggedPeople.length - 1
                                      ? ','
                                      : ''}
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
                                      key={(j = 'more')}
                                      hidden={this.state.moreTags}
                                    >
                                      and{' '}
                                      {Number(post.taggedPeople.length) -
                                        Number(1)}{' '}
                                      more
                                    </span>{' '}
                                    <Link
                                      className="tagged-name ms-1 pointer  "
                                      hidden={!this.state.moreTags}
                                      to={'/u/' + tagPeople._id}
                                      key={j}
                                    >
                                      {tagPeople.name}
                                      {j < post.taggedPeople.length - 1
                                        ? ','
                                        : ''}
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
                                    {j < post.taggedPeople.length - 1
                                      ? ','
                                      : ''}
                                  </Link>
                                );
                              }
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {post.sharedBy != undefined &&
                    post.sharedBy != null &&
                    post.sharedBy != '' &&
                    post.sharedType != undefined
                      ? post.sharedType == 'blog'
                        ? this.getSharedContent(
                            post.sharedType,
                            post.sharedDataBlog,
                            post.sharedContents,
                            post.sharedBlogUserdet
                          )
                        : post.sharedType == 'post'
                        ? this.getSharedContent(
                            post.sharedType,
                            post.sharedDataPost,
                            post.sharedContents,
                            post.sharedPostUserdet
                          )
                        : post.sharedType == 'group'
                        ? this.getSharedContent(
                            post.sharedType,
                            post.sharedDataGroup,
                            post.sharedContents,
                            post.sharedGroupUserdet
                          )
                        : post.sharedType == 'product'
                        ? this.getSharedContent(
                            post.sharedType,
                            post.sharedDataProduct,
                            post.sharedContents,
                            post.sharedProductUserdet
                          )
                        : post.sharedType == 'group_post'
                        ? this.getSharedContent(
                            post.sharedType,
                            post.sharedDataGrouppost,
                            post.sharedContents,
                            post.sharedGrouppostUserdet
                          )
                        : null
                      : null}
                  </div>
                  <div className="post-footer d-flex flex-column overflow-hidden mt-2">
                    <div className="d-flex post-meta align-items-center ">
                      <div className="d-flex align-items-center">
                        <div
                          className="d-flex align-items-center me-1"
                          onClick={(e) =>
                            this.likePostFn(post._id, post.likeActive)
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
                              <span className="font-weight-bold drop-trigger">
                                {' '}
                                {post.likesCount}
                              </span>
                            </Dropdown>
                          )}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        {(post.userid == this.props.currentUser._id ||
                          (post.settings[0] != undefined &&
                            (post.settings[0].comments == 'Everyone' ||
                              (post.settings[0].comments == 'Friends' &&
                                follow_result.length > 0) ||
                              (post.settings[0].comments ==
                                'Friends Of Friends' &&
                                follow_result.length > 0)))) && (
                          <div
                            className="pointer d-flex align-items-center"
                            onClick={() => this.showComments(post._id)}
                          >
                            <i className="fa-regular fa-comment me-2"></i>
                            <span className="">
                              {post.cmtsCount > 0 && post.cmtsCount}{' '}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ms-auto d-flex align-items-center">
                        {(post.userid == this.props.currentUser._id ||
                          (post.settings[0] != undefined &&
                            post.settings[0].allowSharing)) && (
                          <span className="m-1" style={{ cursor: 'pointer' }}>
                            {' '}
                            {post.shareCount > 0 && (
                              <Dropdown
                                flag={'right'}
                                items={post.sharedUserInfo}
                              >
                                <span className="m-1 font-weight-bold drop-trigger">
                                  {' '}
                                  {post.shareCount}{' '}
                                </span>
                              </Dropdown>
                            )}
                          </span>
                        )}
                        {(post.userid == this.props.currentUser._id ||
                          (post.settings[0] != undefined &&
                            post.settings[0].allowSharing)) && (
                          <i
                            className="fa-solid fa-retweet pointer ms-1 "
                            onClick={(e) => this.sharePost(post)}
                          ></i>
                        )}
                      </div>
                    </div>

                    {
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
                              this.postCmt(post._id);
                            }
                          }}
                        />
                        <button
                          className="roundBtn"
                          onClick={() => this.postCmt(post._id)}
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </div>
                    }

                    {<p className="comment-title">Comments</p>}
                    <div className="post-comments">
                      {post.comment?.map((comment, i) => (
                        <div className="post-comment-row " key={i}>
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
                                    {comment.text}
                                  </p>
                                  <div className="d-flex  post-comment-meta">
                                    <span
                                      className="post-comment-icon pointer"
                                      onClick={(e) =>
                                        this.commentLike(
                                          i,
                                          post._id,
                                          comment._id
                                        )
                                      }
                                    >
                                      <svg
                                        fill="#000000"
                                        width="800px"
                                        height="800px"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M3,21a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6V21ZM19.949,10H14.178V5c0-2-3.076-2-3.076-2s0,4-1.026,5C9.52,8.543,8.669,10.348,8,11V21H18.644a2.036,2.036,0,0,0,2.017-1.642l1.3-7A2.015,2.015,0,0,0,19.949,10Z" />
                                      </svg>

                                      {comment.likesCount &&
                                      comment.likesCount > 0
                                        ? comment.likesCount
                                        : ''}
                                    </span>
                                    <span
                                      className=" post-comment-icon  pointer"
                                      onClick={(e) =>
                                        this.showCommentReplies(comment._id)
                                      }
                                    >
                                      <svg
                                        fill="#000000"
                                        width="800px"
                                        height="800px"
                                        viewBox="0 0 32 32"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <title>reply</title>
                                        <path d="M4.687 11.119l9.287 8.933v-5.412c2.813 0 9.973 0.062 9.973 7.426 0 3.855-2.734 7.072-6.369 7.816 5.842-0.792 10.359-5.747 10.359-11.806 0-11.256-12.026-11.352-13.963-11.352v-4.606l-9.287 9.001z"></path>
                                      </svg>
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
                              comment.replies.map((reply, r) => (
                                <div
                                  className="post-comment-inner post-comment-row w-100 d-flex "
                                  key={r}
                                >
                                  <div className="media-left ">
                                    <A href={'/u/' + reply.userinfo._id}>
                                      <img
                                        className="post-comment-user-profile"
                                        src={profilePic(
                                          reply.userinfo.avatar,
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
                                      {reply.text}
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
                                                comment._id,
                                                reply._id,
                                                post
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
                              ))}
                            {comment.showReply && (
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
                                        comment._id,
                                        replyCmt[i],
                                        i,
                                        this.callBackCommentReply,
                                        post
                                      );
                                    }
                                  }}
                                />
                                <button
                                  className="roundBtn"
                                  onClick={() =>
                                    this.commentReply(
                                      post._id,
                                      comment._id,
                                      replyCmt[i],
                                      i,
                                      this.callBackCommentReply,
                                      post
                                    )
                                  }
                                >
                                  <i className="fa-solid fa-angle-right"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Dialog
          onClose={this.handleClose}
          className="confirm-modal"
          open={this.state.open}
        >
          <strong className="text-center p-2">
            <big>Confirmation</big>
          </strong>
          <p className="p-2">Are you sure about deleting this?</p>
          <div className="p-2 d-flex align-items-center justify-content-around">
            <Button onClick={this.handleClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={this.removePostConfirm} variant="primary">
              Yes
            </Button>
          </div>
        </Dialog>
        <div className=" row p-2 p-sm-2  ">
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
                <div>
                  {post.twitterPost && (
                    <li className="list-group-item splLi">
                      <img
                        className=" extraSmallIcon"
                        src={GetAssetImage('icons/twitter.svg')}
                      />
                    </li>
                  )}
                </div>
                <div className="bookmark">
                  {post.saved > 0 ? (
                    <i
                      onClick={(e) => this.unsavePost(post._id)}
                      className="fa-solid  fa-bookmark"
                    ></i>
                  ) : (
                    <i
                      onClick={(e) => this.savePost(post._id)}
                      className="fa-regular fa-bookmark"
                    ></i>
                  )}
                </div>
                <div className="pointer  dropdown">
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  <div className="dropdown-menu  dropdown-menu-right">
                    {post.userid == this.props.currentUser._id && (
                      <a
                        className="dropdown-item"
                        onClick={(e) => this.editPost(post._id)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
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

                    {post.userid != this.props.currentUser._id &&
                      post.reported > 0 && (
                        <a
                          className="dropdown-item"
                          onClick={(e) => this.unReport('post', post._id)}
                        >
                          <i className="mr-1 fa fa-undo"></i>
                          <span className="m-1">Undo-Report</span>
                        </a>
                      )}
                    {post.userid != this.props.currentUser._id &&
                      post.reported <= 0 && (
                        <a
                          className="dropdown-item"
                          onClick={(e) => this.handleReport(e, post._id)}
                          //onClick={() => this.reportModal('post', post)}
                        >
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <span className="m-1">Report </span>
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
                        <i className="fa-regular fa-trash-can"></i>
                        <span className="m-1">Remove</span>
                      </a>
                    )}

                    {/* <a className="dropdown-item" onClick={(e) => this.reportPost(post._id)}>
                                                <i className="fa fa-exclamation-circle"></i>
                                                <span className="m-1">Report</span></a> */}
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

              {
                // this.state.url && this.state.url?.map(url=><UrlPreview url ={url}/>)

                Array.isArray(this.state.url) &&
                  this.state.url.map((url) => (
                    <UrlPreview url={url} key={url} />
                  ))
              }
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

              {/* {
                                    post.sharedBy != undefined && post.sharedBy != null && post.sharedBy != '' && post.sharedType != undefined ?
                                    
                          
                                    (post.sharedType == 'blog')? 
                                    this.getSharedContent(post.sharedType, post.sharedType == 'blog' ? post.sharedDataBlog : (post.sharedType == 'products') ? post.sharedDataProduct : null , post.sharedContents, post.sharedBlogUserdet) :  this.getSharedContent(post.sharedType, post.sharedType == 'blog' ? (post.sharedType == 'products') ? post.sharedDataProduct : null : post.sharedDataPost, post.sharedContents,post.sharedPostUserdet)
                                    : (post.sharedType == 'products') ? post.sharedDataProduct : null
                                } */}

              {post.sharedBy != undefined &&
              post.sharedBy != null &&
              post.sharedBy != '' &&
              post.sharedType != undefined
                ? post.sharedType == 'blog'
                  ? this.getSharedContent(
                      post.sharedType,
                      post.sharedDataBlog,
                      post.sharedContents,
                      post.sharedBlogUserdet
                    )
                  : post.sharedType == 'post'
                  ? this.getSharedContent(
                      post.sharedType,
                      post.sharedDataPost,
                      post.sharedContents,
                      post.sharedPostUserdet
                    )
                  : post.sharedType == 'group'
                  ? this.getSharedContent(
                      post.sharedType,
                      post.sharedDataGroup,
                      post.sharedContents,
                      post.sharedGroupUserdet
                    )
                  : post.sharedType == 'product'
                  ? this.getSharedContent(
                      post.sharedType,
                      post.sharedDataProduct,
                      post.sharedContents,
                      post.sharedProductUserdet
                    )
                  : post.sharedType == 'group_post'
                  ? this.getSharedContent(
                      post.sharedType,
                      post.sharedDataGrouppost,
                      post.sharedContents,
                      post.sharedGrouppostUserdet
                    )
                  : null
                : null}

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
            </div>
            <div className="post-footer">
              <div className="d-flex post-meta align-items-center ">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center me-1 pointer"
                    onClick={(e) => this.likePostFn(post._id, post.likeActive)}
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
                  {(post.userid == this.props.currentUser._id ||
                    (post.settings[0] != undefined &&
                      (post.settings[0].comments == 'Everyone' ||
                        (post.settings[0].comments == 'Friends' &&
                          follow_result.length > 0) ||
                        (post.settings[0].comments == 'Friends Of Friends' &&
                          follow_result.length > 0)))) && (
                    <div
                      className="pointer d-flex align-items-center"
                      onClick={() => this.showComments(post._id)}
                    >
                      <i className="fa-regular fa-comment me-2"></i>
                      <span className="ms-1">
                        {post.cmtsCount > 0 && post.cmtsCount}{' '}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ms-auto d-flex align-items-center">
                  {(post.userid == this.props.currentUser._id ||
                    (post.settings[0] != undefined &&
                      post.settings[0].allowSharing)) && (
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
                  )}
                  {(post.userid == this.props.currentUser._id ||
                    (post.settings[0] != undefined &&
                      post.settings[0].allowSharing)) && (
                    <i
                      className="fa-solid fa-share-nodes pointer ms-1 "
                      onClick={(e) => this.sharePost(post)}
                    ></i>
                  )}
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
                            this.postCmt(post._id);
                          }
                        }}
                      />
                      <button
                        className="roundBtn"
                        onClick={() => this.postCmt(post._id)}
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
                post.comment?.map((comment, i) => (
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
                                {comment.text}
                              </p>
                              <div className="d-flex  post-comment-meta">
                                <span
                                  className="post-comment-icon pointer"
                                  onClick={(e) =>
                                    this.commentLike(i, post._id, comment._id)
                                  }
                                >
                                  <i className="fa-solid fa-thumbs-up"></i>

                                  {comment.likesCount && comment.likesCount > 0
                                    ? comment.likesCount
                                    : ''}
                                </span>
                                <span
                                  className=" post-comment-icon  pointer"
                                  onClick={(e) =>
                                    this.showCommentReplies(comment._id)
                                  }
                                >
                                  <i className="fa-solid fa-reply"></i>{' '}
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
                                      <i className="mr-1 fa fa-undo"></i>
                                      <span className="m-1">Undo-Report</span>
                                    </a>
                                  ) : (
                                    <a
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.reportModal('comment', comment, i)
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
                          comment.replies.map((reply, r) => (
                            <div
                              className="post-comment-inner post-comment-row w-100 d-flex "
                              key={r}
                            >
                              <div className="media-left ">
                                <A href={'/u/' + reply.userinfo._id}>
                                  <img
                                    className="post-comment-user-profile"
                                    src={profilePic(
                                      reply.userinfo.avatar,
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
                                  {reply.text}
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
                                            comment._id,
                                            reply._id,
                                            post
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
                                          <span className="m-1">Report</span>
                                        </a>
                                      )
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        {comment.showReply && (
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
                                    comment._id,
                                    replyCmt[i],
                                    i,
                                    this.callBackCommentReply,
                                    post
                                  );
                                }
                              }}
                            />
                            <button
                              className="roundBtn"
                              onClick={() =>
                                this.commentReply(
                                  post._id,
                                  comment._id,
                                  replyCmt[i],
                                  i,
                                  this.callBackCommentReply,
                                  post
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
                ))}
            </div>
          </div>
        </div>
        {this.state.isOpen && (
          <Lightbox
            id={'light' + post._id}
            enableZoom={false}
            mainSrc={post.contents[0].content_url}
            onCloseRequest={() => this.setState({ isOpen: false })}

            // onMovePrevRequest={() =>
            // this.setState({
            //     photoIndex: (this.state.photoIndex + this.state.images.length - 1) % this.state.images.length,
            // })
            // }
            // onMoveNextRequest={() =>
            // this.setState({
            //     photoIndex: (this.state.photoIndex + 1) % this.state.images.length,
            // })
            // }
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

  getSharedContent = (type, post, contents, userinfo) => {
    console.log(post, 'post_1');
    return post == undefined ? (
      <div className="deleted">
        <i className="fa fa-trash"></i> This content was removed
      </div>
    ) : post.removed > 0 ||
      (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
      <SharedPostCard
        type={type}
        url={
          type == 'blog'
            ? '/blog/' + post.slug
            : type == 'product'
            ? '/market-product-detail-view/' + post._id
            : '/post/' + post._id
        }
        k={post._id}
        currentUser={this.props.currentUser}
        post={post}
        userinfo={userinfo}
        contents={contents}
      />
    );
  };
}

export default Post;
