import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Modal from '../Popup';
import {
  getComments,
  getReplyComments,
  postReport,
  postUnReport,
} from '../../http/http-calls';
import {
  postHide,
  postUnHide,
  postHighlight,
  postUnHighlight,
} from '../../http/post-calls';
import {
  postRemove,
  postSave,
  postUnSave,
  likePost,
  postComment,
} from '../../http/blog-calls';
import Share from './Share';
import { switchLoader, alertBox } from '../../commonRedux';
import { pic } from '../../globalFunctions';
import LeftThumbCard from '../Cards/LeftThumbCard';
import Button from '../Button';
import BlogReportModal from '../Report/blog';
import { removeReport } from '../../http/wallet-calls';

require('./styles.scss');

const reactStringReplace = require('react-string-replace');

class BlogPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      url: props.post.url,
      post: props.post,
      last: null,
      key: props.post._id,
      shareModel: false,
      reported: props.post.reported >= 1,
      saved: props.post.saved >= 1,
      category: '',
      reason: '',
      reportModal: false,
      currPost: {},
      coins: [],
      playing: false,
      tips: 0,
      showComments: false,
      commentText: '',
      postText: '',
      replyCmt: [],
      filter: props.filter,
      isBlogReport: false,
    };
    // this.likePostFn = this.likePostFn.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
  }

  extractUrl = (text) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    return text.match(regex);
  };

  reportModal = () => {
    this.setState({
      isBlogReport: true,
    });
    // this.setState({reportModal: !this.state.reportModal}) // true/false toggle
  };

  componentDidMount() {
    if (this.props.single) {
      this.showComments(this.state.post._id);
    }

    try {
      const txt = JSON.parse(this.props.post.editorContent);
      this.setState({
        postText: txt.blocks[0].data.text,
      });
    } catch (error) {
      this.setState({
        postText: this.props.post.text,
      });
    }
    this.getCoins();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coins != this.props.coins) {
      this.getCoins();
    }
    if (prevProps.post._id != this.props.post._id) {
      this.setState({
        post: this.props.post,
      });
    }
  }

  getCoins = () => {
    this.setState(
      {
        coins: this.props.coins,
      },
      () => {
        if (
          this.state.post != undefined &&
          this.state.post.tips != undefined &&
          this.state.coins != undefined
        ) {
          const len = this.state.post.tips.length;
          if (len > 0) {
            let tips = 0;
            this.state.post.tips.map((e, i) => {
              const index = this.state.coins.findIndex(
                (item, i) => item.currencySymbol === e.currency
              );
              try {
                // tips += e.amount/this.state.coins[index].EstimatedUSD;
                tips += this.state.coins[index].EstimatedUSD * e.amount;
              } catch (error) {
                /* empty */
              }
              if (i == len - 1) {
                this.setState({
                  tips,
                });
              }
            });
          }
        }
      }
    );
  };

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

  editPost = (id) => {};

  save = (id) => {
    // modal(true, "sdf");
    postSave({ postid: id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ saved: true });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  unSave = (id) => {
    postUnSave({ postid: id, userid: this.props.currentUser._id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({
          saved: false,
          // filter:"hidden"
        });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  report = (p) => {
    if (this.state.category == '') {
      alertBox(true, 'You need to select a category');
    } else {
      const link = `blog/${p.slug}`;
      postReport({
        id: p._id,
        type: 'blog',
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          this.setState({ reportModal: false, reported: true });
        },
        (error) => {
          alertBox(true, error.data.message);
          this.setState({ reportModal: false });
        }
      );
    }
  };

  unReport = (p) => {
    const con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id: p._id }).then(
        async (resp) => {
          removeReport({ item_id: p._id }).then(
            async (resp) => {},
            (error) => {
              alertBox(true, 'Something went wrong!');
            }
          );
          alertBox(true, resp.message, 'success');
          this.setState({ reported: false });
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
    if (this.state.commentText != '' && this.state.commentText != null) {
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
    }
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
  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isBlogReport: data.isBlogReport,
        reported: true,
      });
    } else {
      this.setState({
        isBlogReport: data.isBlogReport,
      });
    }
  };

  render() {
    const { post, showComments, commentText, replyCmt, key } = this.state;

    return (
      <div className="post ">
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
              onClick={() => this.report(post)}
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
        {!post.sharedBy
          ? this.getPostContent(post, showComments, commentText, replyCmt)
          : null}
        {this.state.shareModel && (
          <Share
            post={this.state.currPost}
            shareSuccess={this.shareSuccess}
            closeShareModal={this.closeShareModal}
          />
        )}
        {this.state.isBlogReport && (
          <BlogReportModal
            parentCallback={this.handleCallbackReport}
            isBlogReport={this.state.isBlogReport}
            blogId={post._id}
          />
        )}
      </div>
    );
  }

  getPostContent = (post, showComments, commentText, replyCmt) =>
    post.removed > 0 ||
    (post.hidden > 0 && this.state.filter != 'hidden') ||
    this.state.filter == 'hidden' ? null : (
      <LeftThumbCard
        reported={this.state.reported}
        saved={this.state.saved}
        report={this.reportModal}
        unReport={() => this.unReport(post)}
        save={() => this.save(post._id)}
        unSave={() => this.unSave(post._id)}
        url={`/blog/${post.slug}`}
        thumb={pic(
          post.contents != undefined && post.contents[0] != undefined
            ? post.contents[0].content_url
            : ''
        )}
        k={post._id}
        currentUser={this.props.currentUser}
        post={post}
        title={post.subject}
        likes={post.likesCount}
        shares={post.shareCount}
        tips={this.state.tips}
        comments={post.cmtsCount}
        category={post.category}
        description={this.state.postText}
        removePost={this.removePost}
        authorid={post.userid}
      />
    );
}

export default BlogPost;
