import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { Dialog } from '@material-ui/core';
import { history } from '../../store';

import {
  getSinglePost,
  sendTips,
  postSave,
  postUnSave,
  postRemove,
  likePost,
  postComment,
  likeComment,
  replyComment,
  clap,
  purchaseBlog,
  checkPurchasedBlog,
} from '../../http/blog-calls';
import {
  postReport,
  postUnReport,
  getComments,
  getReplyComments,
  removeComment,
} from '../../http/http-calls';
import {
  postHide,
  postUnHide,
  postHighlight,
  postUnHighlight,
} from '../../http/post-calls';
import Share from './Share';
import { switchLoader, alertBox } from '../../commonRedux';
import Modal from '../Popup';
import A from '../A';
import { profilePic } from '../../globalFunctions';
import Button from '../Button';
import BlogWidget from '../Blog/BlogWidget';
import {
  getAllPairs,
  externalTransfer,
  removeReport,
} from '../../http/wallet-calls';
import walletCheck from '../../hooks/walletCheck';
import BlogReportModal from '../Report/blog';
import Dropdown from '../Dropdown';

require('./styles.scss');
const reactStringReplace = require('react-string-replace');
const coins = require('../../pages/Gionomy/add/coins.json');

class BlogPostSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.post.url,
      coins: [],
      tip_coins: coins,
      tips: 0,
      reportModal: false,
      global: props.global,
      post: props.post,
      price_extra:
        props.post.price_extra != undefined &&
        typeof props.post.price_extra === 'string'
          ? JSON.parse(props.post.price_extra)
          : props.post.price_extra,
      key: props.post._id,
      shareModel: false,
      currPost: {},
      playing: false,
      showComments: false,
      purchased: false,
      commentText: '',
      postText: '',
      currency: 'USD',
      amount: 1,
      description: '',
      modal: false,
      modal2: false,
      replyCmt: [],
      pay_currency: props.post.preferedCurrency,
      pay_price: props.post.price,
      isBlogReport: false,
      count: 0,
    };
    // this.likePostFn = this.likePostFn.bind(this);
    this.sharePost = this.sharePost.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    console.log('test console', typeof props.post.price_extra);
  }

  selectModal = (info) => {
    this.setState({ modal: !this.state.modal }); // true/false toggle
  };

  selectModal2 = (info) => {
    this.setState({
      modal2: !this.state.modal2,
      currency: 'USD',
      amount: 1,
    }); // true/false toggle
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
    this.setState({ isBlogReport: !this.state.isBlogReport });
    //  this.setState({reportModal: !this.state.reportModal}) // true/false toggle
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
          let temp = {};
          alertBox(true, resp.message, 'success');
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

  unReport = (type, id, key = null, key2 = null) => {
    const con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id }).then(
        async (resp) => {
          let temp = {};
          alertBox(true, resp.message, 'success');
          if (type == 'comment') {
            temp = this.state.post;
            temp.comment[key].reported = 0;
            this.setState({ post: temp });
          } else if (type == 'reply') {
            temp = this.state.post;
            temp.comment[key2].replies[key].reported = 0;
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

  deleteComment = (type, postid, id) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    removeComment({ id }, true).then(
      async (resp) => {
        if (type == 'comment') {
          this.showComments(postid);
          this.postActivityCount('cmtsCount', 'sub');
        } else {
          this.showCommentReplies(postid);
        }
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  processPay = (id, price, currency, email, receiver) => {
    const data = {
      currency,
      email,
      amt: price,
      note: 'Blog Purchase',
    };
    switchLoader('Payment in progress...');
    externalTransfer(data).then(
      async (resp) => {
        // return false;
        try {
          if (resp.status == true) {
            alertBox(true, resp.message, 'success');
            data.postid = id;
            data.receiver = receiver;
            purchaseBlog(data).then(
              (resp) => {},
              (err) => {
                console.log(err);
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            alertBox(true, resp.message);

            if (resp.message == 'Insufficient balance') {
              setTimeout(() => history.push('/wallet/deposit'), 1000);
            }
          }
        } catch (error) {
          alertBox(true, error == undefined ? 'Error' : error.toString());
        }
        switchLoader();
      },
      (error) => {
        console.log(error);
        if (error.data == 'unauthorized') {
          this.walletLogin();
        } else {
          alertBox(true, error == undefined ? 'Error' : error.toString());
          switchLoader();
        }
      }
    );
  };

  extractUrl = (text) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    return text.match(regex);
  };

  getData = () => {
    if (this.state.count < 5) {
      this.setState({ count: this.state.count + 1 });
      getSinglePost({
        postid: this.state.post._id,
        slug: this.state.post.slug,
        userid:
          this.props.currentUser && this.props.currentUser._id
            ? this.props.currentUser._id
            : 0,
      }).then(
        async (resp) => {
          this.setState({
            post: resp.post.length > 0 ? resp.post[0] : '',
            showComments: false,
            commentText: '',
          });
          this.props.setProp('posts', resp.post);
        },
        (error) => {}
      );
    }
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.getData();
    }
  }

  componentDidMount() {
    if (this.props.single && !this.state.global) {
      this.showComments(this.state.post._id);
    }

    try {
      const text = JSON.parse(this.props.post.editorContent);
      this.setState({
        description: text.blocks[0].data.text,
        postText: this.props.post.text,
      });
    } catch (error) {
      this.setState({
        postText: this.props.post.text,
      });
    }

    walletCheck().then(
      (resp) => {
        this.getCoins();
      },
      (err) => {
        console.log(err);
      }
    );

    this.checkPurchased();
  }

  getCoins = () => {
    getAllPairs().then(
      (resp) => {
        this.setState(
          {
            coins: resp.data,
          },
          () => {
            const len = this.props.post.tips.length;
            if (len > 0) {
              let tips = 0;

              this.props.post.tips.map((e, i) => {
                const index = this.state.coins.findIndex(
                  (item, i) => item.currencySymbol === e.currency
                );
                try {
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
            // this.setState({
            //     tips: 10
            // })
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  };

  checkPurchased = () => {
    checkPurchasedBlog({ postid: this.state.post._id }).then(
      (resp) => {
        try {
          if (resp.status == 1) {
            this.setState({ purchased: true });
          }
        } catch (error) {
          /* empty */
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  payModal = (amount, currency) => {
    this.setState({ modal: true });
  };

  sendTip = () => {
    if (this.state.amount == '' || this.state.currency == '') {
      alertBox(true, 'Amount & Currency are required');
    } else if (this.state.amount <= 0) {
      alertBox(true, 'Amount is required');
    } else {
      const data = {
        currency: this.state.currency,
        email: this.state.post.userinfo.email,
        amt: this.state.amount,
        note: 'Tips',
      };

      const { currency } = this.state;

      externalTransfer(data).then(
        async (resp) => {
          switchLoader(true, 'Payment in progress...');
          try {
            if (resp.status == true) {
              switchLoader();
              alertBox(true, resp.message, 'success');

              const index = this.state.coins.findIndex(
                (item, i) => item.currencySymbol === currency
              );
              try {
                const tips =
                  this.state.tips +
                  this.state.coins[index].EstimatedUSD * this.state.amount;
                this.setState({
                  tips,
                });
              } catch (error) {
                console.log(error);
              }
              data.postid = this.state.post._id;
              data.receiver = this.state.post.userid;
              sendTips(data).then(
                (resp) => {
                  this.selectModal2();
                },
                (err) => {
                  this.selectModal2();
                }
              );
            } else {
              switchLoader();
              alertBox(true, resp.message);
              if (resp.message == 'Insufficient balance') {
                setTimeout(() => history.push('/wallet/deposit'), 1000);
              }
            }
          } catch (error) {
            alertBox(true, error == undefined ? 'Error' : error.toString());
          }
          // switchLoader();
        },
        (error) => {
          console.log(error);
          if (error.data == 'unauthorized') {
            alertBox(true, 'Unauthorized');
          } else {
            alertBox(true, error == undefined ? 'Error' : error.toString());
            switchLoader();
          }
        }
      );
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
        postObj.liked_users = postObj.liked_users.filter(
          (obj) => obj._id !== this.props.currentUser._id
        );
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
  };

  commentLike = (key, postid, commentId) => {
    if (this.state.global) {
      this.loginRedirect();
    } else {
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
    }
  };

  loginRedirect = () => {
    window.location.href = `/login?next=${this.props.path}`;
  };

  commentReply = (postid, commentId, comment, commentIndex, callBack) => {
    if (comment != '' && comment.trim() != '' && comment != null) {
      replyComment({ postid, commentId, comment }, true).then(
        async (resp) => {
          callBack(resp.comment, commentIndex);
        },
        (error) => {}
      );
    }
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

  editPost = (id) => {};

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

  handleClose = () => this.setState({ open: !this.state.open });

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
        history.push('/blogs');
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
        this.setState({ post: { ...this.state.post, highlighted: 1 } }, () => {
          this.props.refreshHighlights();
        });
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
        this.setState({ post: { ...this.state.post, highlighted: 0 } }, () => {
          this.props.refreshHighlights();
        });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  likePostFn = (postId, liked) => {
    if (this.state.global) {
      this.loginRedirect();
    } else {
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
    }
  };

  sharePost = (post) => {
    if (this.state.global) {
      this.loginRedirect();
    } else {
      this.setState({ shareModel: true, currPost: post });
    }
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  handleOnReady = () => setTimeout(() => this.setState({ playing: true }), 100);

  clap = () => {
    if (this.state.global) {
      this.loginRedirect();
    } else {
      const obj = { postid: this.state.post._id };
      clap(obj).then(
        (resp) => {
          const temp = { ...this.state.post };
          temp.clapsCount = Number(this.state.post.clapsCount) + 1;
          temp.clapActive = 1;
          this.setState({ clapped: true, post: temp });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
  };

  postCmt = (postid) => {
    if (
      this.state.commentText != '' &&
      this.state.commentText.trim() != '' &&
      this.state.commentText != null
    ) {
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
    if (this.state.global) {
      this.loginRedirect();
    } else {
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
    }
  };

  handleChange = (evt, index) => {
    const { name, value } = evt.target;
    if (evt.target.name == 'pay_currency') {
      if (evt.target.value == this.state.post.preferedCurrency) {
        this.setState({
          pay_currency: evt.target.value,
          pay_price: this.state.post.price,
        });
      } else {
        const filter_price = this.state.price_extra.filter(
          (item) => item != null && item.prefered_currency == evt.target.value
        );
        this.setState({
          pay_currency: evt.target.value,
          pay_price: filter_price[0].prefered_price,
        });
      }
    } else if (name === 'currency') {
      this.setState({ currency: value });
    } else if (evt.target.name != 'replyCmt') {
      // if(evt.target.name=='amount'){
      //     value = evt.target.value.replace(/\D/g, '');
      // }
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

  // showCommentReplies = (commentId) => {

  //     switchLoader(true, 'Please wait. Getting Comments...');
  //     getReplyComments({ commentId }, true)
  //         .then(async resp => {
  //             switchLoader();
  //             let index = this.state.post.comment.findIndex(el => el._id === commentId);
  //             const tempPostData = this.state.post;
  //             tempPostData.comment[index].replies = resp;
  //             this.setState({ post: tempPostData });
  //         }, error => {
  //             alertBox(true, error.data.message);
  //             switchLoader();
  //         });
  // }

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

  onAmountChange = (e) => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,8})?$/)) {
      this.setState(() => ({ amount }));
    }
  };

  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isBlogReport: data.isBlogReport,
        post: { ...this.state.post, reported: 1 },
      });
    } else {
      this.setState({
        isBlogReport: data.isBlogReport,
      });
    }
  };

  // wrapHash = (val) => {

  //     return val.replace(/#(\w+)/g, "<A href='/search/filter=posts&q=$&'>$&</A>").replace("q=#", "q=%23");
  // }

  render() {
    const { post, showComments, commentText, replyCmt, key, pref_name } =
      this.state;
    if (post !== '') {
      return (
        <div className="row empty-inner-container-with-out-border post ">
          {!post.sharedBy
            ? this.getPostContent(post, showComments, commentText, replyCmt)
            : null}
          {this.state.shareModel && (
            <Share
              type="blog"
              post={this.state.currPost}
              shareSuccess={this.shareSuccess}
              closeShareModal={this.closeShareModal}
            />
          )}
        </div>
      );
    }
  }

  handleChangeComment = (e, postid) => {
    const { name, value } = e.target;
    if (e.key === 'Enter') {
      this.setState({ [name]: value }, () => {});
      if (value.trim() != '' && value != '' && value != null) {
        switchLoader(true, 'Please wait. Commenting...');
        const obj = { postid, comment: value };
        postComment(obj).then(
          async (resp) => {
            this.postActivityCount('cmtsCount');
            const postObj = this.state.post;
            if (!postObj.comment) {
              postObj.comment = [];
            }
            postObj.comment.unshift(resp.comment);
            this.setState({
              post: postObj,
              showComments: true,
              commentText: '',
            });
            switchLoader();
          },
          (error) => {
            alertBox(true, error.data.message);
            switchLoader();
          }
        );
      }
    }
  };

  handleChangeReply = (
    e,
    postid,
    commentId,
    comment,
    commentIndex,
    callBack
  ) => {
    const { name, value } = e.target;
    if (e.key === 'Enter') {
      this.setState(
        { [`${name}`]: { ...this.state.replyCmt, [commentIndex]: value } },
        () => {}
      );
      if (comment != '' && comment.trim() != '' && comment != null) {
        replyComment({ postid, commentId, comment }, true).then(
          async (resp) => {
            callBack(resp.comment, commentIndex);
            switchLoader();
          },
          (error) => {
            switchLoader();
          }
        );
      }
    }
  };

  getPostContent = (post, showComments, commentText, replyCmt) =>
    // const currency = post.preferedCurrency;
    // if(Array.isArray(currency)){
    //     if(currency.length > 0){
    //         var curr = currency[0].split(',')
    //     }
    // }else{
    //     var curr = [];
    //     curr.push(post.preferedCurrency);
    // }

    post.removed > 0 ||
    (post.hidden > 0 && this.props.filter != 'hidden') ? null : (
      <>
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
        <div className="modal-1 active checkDesign-modal">
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
                variant="primaryBtn"
                size="compact m-2"
                onClick={() => this.report()}
              >
                Report
              </Button>
              <Button
                variant="secondaryBtn"
                size="compact m-2"
                onClick={this.reportModal}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
        <div className="modal-1 active checkDesign-modal">
          <Modal
            displayModal={this.state.modal2}
            closeModal={this.selectModal2}
          >
            <div className="form-group mb-3">
              <label>Currency</label>
              <select
                name="currency"
                id="currency"
                value={this.state.currency}
                className="form-control"
                onChange={this.handleChange}
              >
                {this.state.tip_coins.map((coin, key) =>
                  coin.currencySymbol != 'BLCK' ? (
                    <option
                      value={coin.currencySymbol}
                      selected={coin.currencySymbol === this.state.currency}
                      key={key}
                    >
                      {coin.currencySymbol}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                name="amount"
                value={this.state.amount}
                onChange={this.onAmountChange}
              />
              {/* <input type="number" name="amount" onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }} onChange={this.handleChange} value={this.state.amount} /> */}
            </div>
            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="pnowBtn"
                size="compact me-2"
                onClick={this.sendTip}
              >
                Pay Now
              </Button>
              <Button
                variant="secondary"
                className="cannowBtn"
                size="compact"
                onClick={this.selectModal2}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
        <div className="modal-1 active checkDesign-modal">
          <Modal displayModal={this.state.modal} closeModal={this.selectModal}>
            <div className="align-items-center justify-content-center articlePopup">
              <h4>Purchase your favorite Blog</h4>

              <p>
                Pay{' '}
                <span className="text-danger articlePopup_span">
                  {this.state.pay_currency == ''
                    ? post.preferedCurrency
                    : this.state.pay_currency}{' '}
                  {this.state.pay_price == ''
                    ? post.price
                    : this.state.pay_price}
                </span>{' '}
                to read the whole article
              </p>
              <div className="col-md-12">
                <Button
                  variant="primary"
                  className="pnowBtn"
                  size="compact m-2"
                  onClick={() =>
                    this.processPay(
                      post._id,
                      this.state.pay_price,
                      this.state.pay_currency,
                      post.userinfo.email,
                      post.userid
                    )
                  }
                >
                  Pay Now
                </Button>
                <Button
                  variant="secondary"
                  className="cannowBtn"
                  size="compact m-2"
                  onClick={this.selectModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
        <div className="container blog-header">
          <div className="row-b">
            <div className="tagbtn">
              {post.category == null ? 'General' : post.category}
            </div>
            <span
              className="list-group-item  p-1 pr-2 pointer  dropdown pull-right"
              style={{ background: 'none' }}
            >
              <i className="fa fa-ellipsis-h" />
              <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                {this.props.currentUser._id == post.userid ? (
                  <Link
                    to={`/edit-blog/${post.slug}`}
                    className="dropdown-item"
                  >
                    <img
                      className="mr-1"
                      src={require('../../assets/images/edit-icon.png')}
                    />{' '}
                    Edit
                  </Link>
                ) : null}

                {(this.props.currentUser != undefined &&
                  post.sharedBy == this.props.currentUser._id) ||
                  (post.userid == this.props.currentUser._id && (
                    <a
                      className="dropdown-item"
                      onClick={(e) => this.removePost(post._id)}
                    >
                      <img
                        className="mr-1"
                        src={require('../../assets/images/remove-icon.png')}
                      />
                      <span
                        style={{ marginLeft: '3px' }}
                        className="remove-span"
                      >
                        Remove
                      </span>{' '}
                    </a>
                  ))}
                {post.userid !== this.props.currentUser._id && post.reported ? (
                  <a
                    onClick={() => this.unReport('post', post._id)}
                    className="dropdown-item"
                  >
                    <i className="fa fa-undo mr-1" />
                    Undo Report
                  </a>
                ) : (
                  post.userid !== this.props.currentUser._id && (
                    <a
                      onClick={() => this.reportModal()}
                      className="dropdown-item"
                    >
                      <i className="fa fa-exclamation-circle mr-1" /> Report
                    </a>
                  )
                )}
                {post.saved ? (
                  <a
                    className="dropdown-item"
                    onClick={() => this.unsavePost(post._id)}
                  >
                    <i className="fa fa-undo mr-1" /> Remove Wishlist
                  </a>
                ) : (
                  this.props.currentUser._id != post.userid && (
                    <a
                      className="dropdown-item"
                      onClick={() => this.savePost(post._id)}
                    >
                      <i className="fa fa-plus mr-1" /> Add to Wishlist
                    </a>
                  )
                )}
              </div>
            </span>
          </div>
          <h1>{post.subject}</h1>
          <p className="p-0 m-0">
            By{' '}
            <Link className="authorName" to={`/u/${post.userid}`}>
              {post.userinfo.name}
            </Link>{' '}
            |{' '}
            <span className="text-secondary text-strong time">
              {moment(post.createdAt).format('DD MMM YYYY')}
            </span>
          </p>
        </div>
        <BlogWidget
          sendTips={this.selectModal2}
          currentUser={this.props.currentUser}
          authorid={post.userid}
          authorname={post.userinfo.name}
          comments={post.cmtsCount}
          likes={post.likesCount}
          shares={post.shareCount}
          share={() => this.sharePost(post)}
          claps={post.clapsCount}
          clap={this.clap}
          postid={post._id}
          clapped={post.clapActive}
          tips={this.state.tips}
          email={post.userinfo.email}
        />
        <div className="container single " key={`${post._id}1`}>
          <div className="row">
            <div
              className="blog-cover"
              style={{
                backgroundImage: `url(${
                  post.contents != undefined && post.contents[0] != undefined
                    ? post.contents[0].content_url
                    : require('../../assets/images/post-image@2x.png')
                })`,
              }}
            >
              <A href="goBack">
                <span className="go-back fa fa-arrow-left" />
              </A>
              {post.hashtags != null &&
                post.hashtags.length > 0 &&
                post.hashtags[0] != '' && (
                  <div className="tags">
                    {post.hashtags != null &&
                      post.hashtags.map((e, i) => (
                        <div className="tag" key={i}>
                          {e}
                        </div>
                      ))}
                  </div>
                )}
            </div>
            <div className="blog-content p-4 w-100">
              {/* <Breadcrumb items={[{"name": "Blogs", "link": "/blogs"}, {"name": (post.category == null) ? 'General' : post.category, "link": (post.category == null) ? '/blogs/general' : "/blogs/"+post.category}, {"name": post.subject, "link": ""}]} />
                        <div className="d-flex align-items-center justify-content-between">
                            
                            <div className="blog-actions">
                                <A href="/add-blog"><span className="fa fa-pencil"></span></A>
                                <A href=""><span className="fa fa-star-o"></span></A>
                                <A href=""><span className="fa fa-share"></span></A>
                            </div>
                        </div> */}

              <div className="blog-text w-100">
                {post.paidPost &&
                (this.state.global ||
                  post.userid != this.props.currentUser._id) &&
                !this.state.purchased ? (
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: this.state.description,
                      }}
                    />

                    <div className="paymentDiv articlePay pb-5">
                      <div className="form-group col-md-12">
                        <h4>Purchase your favorite Blog</h4>
                        <div className="payOption">
                          <p>Pay with</p>
                          <select
                            className="form-control"
                            name="pay_currency"
                            onChange={this.handleChange}
                            value={this.state.pay_currency}
                          >
                            <option>Select currency</option>

                            <option value={post.preferedCurrency}>
                              {' '}
                              {post.preferedCurrency} -{' '}
                              {this.state.pay_price == '' &&
                              this.state.pay_price != null
                                ? post.price?.toFixed(8)
                                : Number(this.state.pay_price)?.toFixed(8)}{' '}
                            </option>
                            {this.state.price_extra != '' &&
                              this.state.price_extra.length > 0 &&
                              this.state.price_extra.map((e, r) =>
                                e != null && e != 'BLCK' ? (
                                  <option key={r} value={e.prefered_currency}>
                                    {' '}
                                    {e.prefered_currency} -{' '}
                                    {e.prefered_price != null
                                      ? Number(e.prefered_price)?.toFixed(8)
                                      : e.prefered_price}
                                  </option>
                                ) : null
                              )}
                          </select>
                          <Button
                            variant="primary"
                            size="big"
                            type="button"
                            className="paynowBtn"
                            onClick={() => {
                              this.state.global
                                ? this.loginRedirect()
                                : this.payModal();
                            }}
                          >
                            Pay now
                          </Button>
                        </div>
                        {/* <label>Available Pay Currency</label> */}
                      </div>

                      {/* <h3>Pay <strong className="text-danger">{(this.state.pay_currency == "") ? post.preferedCurrency : this.state.pay_currency} {(this.state.pay_price == "") ? post.price : this.state.pay_price}</strong> to read the whole article</h3> */}
                      {/* <Button variant="primary" size="big" type="button" onClick={() => { this.state.global ? this.loginRedirect() : this.payModal() }}>Pay</Button> */}
                    </div>
                  </div>
                ) : (
                  <div className="w-100 dynamicContent">
                    {this.state.postText != '' && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.postText,
                        }}
                      />
                    )}
                  </div>
                )}

                {/*  */}
              </div>
            </div>
            {/* new */}
            <ul className="list-group w-100 m-0">
              {!post.sharedBy && (
                <div>
                  <li className="list-group-item d-flex justify-content-between align-items-center post-meta p-1 horizontal-line-fit-top mt-4">
                    <div className="col pl-1">
                      <ul
                        className="list-group list-group-horizontal remove-border m-0 mt-1 mb-1"
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
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
                        </li>
                        <li
                          className="list-group-item mt-1  pointer  dropdown"
                          style={{ padding: '0', margin: '0' }}
                        >
                          <span className="m-1" style={{ cursor: 'pointer' }}>
                            {' '}
                            {post.likesCount > 0 && (
                              <Dropdown items={post.liked_users}>
                                <span className="m-1 font-weight-bold drop-trigger">
                                  {' '}
                                  {post.likesCount}{' '}
                                </span>
                              </Dropdown>
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
                            {' '}
                            {post.shareCount > 1 ? 'Shares' : 'Share'}{' '}
                          </span>
                        </li>
                        <li
                          className="list-group-item  p-0 pointer  dropdown"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0',
                          }}
                        >
                          <span className="m-1" style={{ cursor: 'pointer' }}>
                            {' '}
                            {post.shareCount > 0 && (
                              <Dropdown items={post.sharedUserInfo}>
                                <span className="m-1 font-weight-bold drop-trigger">
                                  {' '}
                                  {post.shareCount}{' '}
                                </span>
                              </Dropdown>
                            )}
                          </span>
                        </li>
                        {/* <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/favicon.png" /><span className="m-1"></span></li>
                                        {post.twitterPost && <li className="list-group-item pl-0"><img className=" extraSmallIcon" src="/static/media/twitter-filled.c9f12008.svg" /><span className="m-1"></span></li>}
                                        <li className="list-group-item pl-0"><img className=" extraSmallIcon" src={require("../../assets/images/" + (post.privacy == 'public' ? "create-visibility-icon" : "hide-visibility-icon@2x") + ".png")} /></li> */}
                      </ul>
                    </div>
                  </li>
                  {!post.sharedBy && showComments && (
                    <div className="col p-2 d-flex align-items-center inputComment">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Add your comment"
                        name="commentText"
                        value={commentText}
                        onKeyPress={(e) =>
                          this.handleChangeComment(e, post._id)
                        }
                        onChange={(e) => this.handleChange(e)}
                      />
                      <Button
                        className="primaryBtn"
                        onClick={() => this.postCmt(post._id)}
                      >
                        Comment
                      </Button>
                    </div>
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
                    <div className="col ps-1">
                      <div className="media w-100 align-items-center p-1 comment-row">
                        <div className="media-left me-2">
                          <A href={`/u/${comment.userinfo._id}`}>
                            <img
                              className="media-object pic commentPic"
                              src={profilePic(
                                comment.userinfo.avatar,
                                comment.userinfo.name
                              )}
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
                              className="me-2 pointer"
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
                              className="me-2 pointer"
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
                          <div className="list-group-item  p-1 ps-2 pointer  dropdown">
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
                                    <i className="me-1 fa fa-undo" />
                                    <span className="m-1">Undo-Report</span>
                                  </a>
                                ) : (
                                  <a
                                    className="dropdown-item"
                                    onClick={() =>
                                      this.reportModal('comment', comment, i)
                                    }
                                  >
                                    <i className="me-1 fa fa-exclamation-circle" />
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
                                <div className="media-left me-2">
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
                                <div className="media-right h-auto">
                                  <div className="list-group-item  p-0 ps-2 pointer  dropdown">
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
                                            className="me-1"
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
                                            <i className="me-1 fa fa-undo" />
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
                                            <i className="me-1 fa fa-exclamation-circle" />
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
                        <div className="commentAndReplyInput">
                          <input
                            className="form-control tempcommentInput"
                            type="text"
                            placeholder="Add your comment"
                            name="replyCmt"
                            value={replyCmt[i]}
                            onKeyPress={(e) =>
                              this.handleChangeReply(
                                e,
                                post._id,
                                comment._id,
                                replyCmt[i],
                                i,
                                this.callBackCommentReply
                              )
                            }
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
            {this.state.isBlogReport && (
              <BlogReportModal
                parentCallback={this.handleCallbackReport}
                isBlogReport={this.state.isBlogReport}
                blogId={post._id}
              />
            )}
          </div>
        </div>
      </>
    );
}

export default withRouter(BlogPostSingle);
