import React from 'react';
import { withRouter } from 'react-router';
import { twitterSync } from '../../http/twitter-calls';
import {
  approveInviteTribesGroup,
  rejectInviteTribesGroup,
} from '../../http/group-calls';
import { GetAssetImage, profilePic } from '../../globalFunctions';
import Button from '../Button';
import { alertBox } from '../../commonRedux/';
import { history } from '../../store';
import { queryParse } from '../../hooks/querystring';
import A from '../A';
import {
  getNotifications,
  setNotificationsViewed,
} from '../../http/post-calls';
import { getMessageNotifications } from '../../http/message-calls';
import {
  notificationReceived,
  connectSocket,
  messageNotificationReceived,
  notificationUpdate,
  groupConnected,
  grpMessageReceived,
  GroupCreateNotification,
} from '../../hooks/socket';
import TimeAgo from 'react-timeago';
import GlobalMenu from '../Menu/GlobalMenu';
import CreatePost from '../Post/CreatePost';
import { signOut, Csession } from '../../auth/cognitoAuth';
import Modal from '../Popup';
import { updateKycState } from '../../hooks/walletCheck';
import {
  getCurrentProductChat,
  getProductChatNotification,
} from '../../http/product-chat-call';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import main_logo from '../../assets/images/logo-main.svg';

// if (getToken() !== null) {

require('./styles.scss');
//}

/* if (getToken() !== null) {
  commonStyle()
} */

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      n: 1,
      open1: false,
      global: false,
      modal: false,
      intervalId: null,
      seemore: false,
      newNotification: 'nil',
      searchQuery: '',
      new: 0,
      msgNew: 0,
      current: null,
      notifications: [],
      messages: [],
      currUrl: '',
      unReadMessages: 0,
    };

    Csession();
    const interval = setInterval(() => {
      Csession();
    }, 1000 * 60); //1 min (1000 milisecound = 1 sec)
  }
  handleIconClick = (n) => {
    if (n == 1) {
      this.setState((state) => {
        return {
          n: n,
          ['open' + n]: !this.state['open' + n],
          open2: false,
          open3: false,
          open4: false,
        };
      });
    } else if (n == 2) {
      this.setState((state) => {
        return {
          n: n,
          ['open' + n]: !this.state['open' + n],
          open3: false,
          open4: false,
          open1: false,
        };
      });
    } else if (n == 3) {
      this.setState((state) => {
        return {
          n: n,
          ['open' + n]: !this.state['open' + n],
          open2: false,
          open4: false,
          open1: false,
        };
      });
    } else {
      this.setState((state) => {
        return {
          n: n,
          ['open' + n]: !this.state['open' + n],
          open1: false,
          open2: false,
          open3: false,
        };
      });
    }
    // this.setState((state) => {
    //   return {
    //     n:n,
    //     ["open"+n]: !this.state["open"+n],

    //   };
    // });
  };
  componentDidMount = () => {
    updateKycState(this.props.currentUser);
    document.addEventListener('mousedown', this.handleClickOutside);
    // var intervalId = setInterval(this.getData, 3000);
    // this.setState({intervalId: intervalId});
    // console.log(this.props);
    this.setState({
      current: this.props.location.pathname,
      searchQuery: '',
    });
    var p = this.props.location.pathname;
    if (
      (p.indexOf('/blog/') != -1 ||
        p.indexOf('/blogs/') != -1 ||
        p.indexOf('/passionomy') != -1 ||
        p.indexOf('/market-default-view') ||
        p.indexOf('/market-product-detail-view/')) &&
      (this.props.currentUser == undefined || this.props.currentUser == null)
    ) {
      this.setState({
        global: true,
      });
    } else {
      this.setState({
        global: false,
      });

      if (this.props.currentUser != undefined) {
        connectSocket(this.props.currentUser._id);
      }

      this.getData();
      notificationReceived((newNotification) => {
        console.log('newNotification', newNotification);
        if (newNotification.type == 'product_chat') {
          getCurrentProductChat({
            chatId: newNotification.data.chatId,
          }).then(
            async (resp) => {
              console.log('newNotification', 'getCurrentProductChat', resp);
              getProductChatNotification({
                notificationId: newNotification._id,
              }).then(
                async (notify_resp) => {
                  console.log(
                    'newNotification',
                    'getProductChatNotification',
                    notify_resp
                  );
                  if (resp.unread !== 0) {
                    var temp = this.state.notifications;
                    temp.unshift(newNotification);
                    var neww = this.state.new + 1;
                    this.setState({
                      notifications: temp,
                      new: neww,
                    });
                  }
                },
                (error) => {}
              );
            },
            (error) => {}
          );
        } else {
          var temp = this.state.notifications;
          temp.unshift(newNotification);
          var neww = this.state.new + 1;
          this.setState({
            notifications: temp,
            new: neww,
          });
        }
        if (newNotification.type == 'friend_request') {
          this.setState({ friendrequest: newNotification });
        }
      });

      messageNotificationReceived((newMessage) => {
        this.getData();

        var temp = this.state.messages;
        var foundIndex = temp.findIndex((x) => x._id == newMessage._id);
        if (foundIndex == -1) {
          temp.push(newMessage);
        } else {
          if (temp[foundIndex].unread) {
            temp[foundIndex].unread += 1;
          } else {
            temp[foundIndex].unread = 1;
          }
        }
        // temp.push(newMessage);
        //
        var neww = this.state.msgNew + 1;
        this.setState({
          messages: temp,
          msgNew: neww,
        });
      });

      grpMessageReceived((newMessage) => {
        this.getData();

        var temp = this.state.messages;
        var foundIndex = temp.findIndex((x) => x._id == newMessage.chatId);
        if (foundIndex == -1) {
          temp.push(newMessage);
        } else {
          if (temp[foundIndex].unread) {
            temp[foundIndex].unread += 1;
          } else {
            temp[foundIndex].unread = 1;
          }
        }
        // temp.push(newMessage);
        //
        var neww = this.state.msgNew + 1;
        this.setState({
          messages: temp,
          msgNew: neww,
        });
      });

      GroupCreateNotification((newMessage) => {
        this.getData();

        // groupConnected(this.props.currentUser.name, newMessage.chatId);

        var temp = this.state.messages;
        var foundIndex = temp.findIndex((x) => x._id == newMessage.chatId);
        if (foundIndex == -1) {
          temp.push(newMessage);
        } else {
          if (newMessage.senderId != this.props.currentUser._id) {
            if (temp[foundIndex].unread) {
              temp[foundIndex].unread += 1;
            } else {
              temp[foundIndex].unread = 1;
            }
          }
        }
        // temp.push(newMessage);
        //
        var neww = this.state.msgNew + 1;
        this.setState({
          messages: temp,
          msgNew: neww,
        });
      });

      notificationUpdate((Notification) => {
        var temp = this.state.notifications;
        temp.map((item, index) => {
          if (
            item.type == 'friend_request' &&
            Notification.user2id == item.forId
          ) {
            var indexs = temp.indexOf(index);
            temp.splice(index, 1);
            var neww = this.state.new - 1;
            this.setState({ notifications: temp, new: neww });
          }
        });
      });
    }
  };

  handleSearchss = (currentTab) => {};
  componentDidUpdate = (prevProps) => {
    history.listen((location) => {
      this.setState({
        current: location.pathname,
      });
    });
    if (
      this.state.current !== this.props.location.pathname &&
      this.state.searchQuery !== ''
    ) {
      this.setState({
        searchQuery: '',
        filter: 'all',
      });
    }
    if (this.props.location.search != prevProps.location.search) {
      var query = queryParse(this.props.location.search);
      this.setState({
        searchQuery: query.q,
        filter: query.filter ? query.filter : 'all',
      });
    }
    //   if(this.props.location.pathname != prevProps.location.pathname){
    //   this.setState({
    //     current: this.props.location.pathname
    //   });
    // }
  };

  msg = () => {
    //  send(this.props.currentUser._id, "test");
  };

  //   componentWillUnmount = () => {
  //     clearInterval(this.state.intervalId);
  //  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    var p = this.props.location.pathname;
    var el = document.querySelector('.ni' + this.state.n);
    var data = event.target.closest('.ni3') || null;

    if (el != null) {
      if (!el.contains(event.target) && data == null) {
        this.setState({
          ['open' + this.state.n]: false,
        });
      }
    }
  };
  getData = () => {
    getNotifications({ page: 1, limit: 10 }).then(
      async (resp) => {
        this.setState(
          {
            notifications: resp.notifications,
            new: resp.total,
          },
          () => {
            this.checkMore();
          }
        );
      },
      (error) => {
        try {
          if (error.status == 401 || error.status == 403) {
            // var p = this.props.location.pathname;
            // if(p.indexOf("/blog/") != -1){
            //   this.setState({
            //     global:true
            //   });
            // }else{
            this.logout();
            //}
            //            this.logout();
          }
        } catch {
          /* empty */
        }
      }
    );

    getMessageNotifications({ page: 1, limit: 10 }).then(
      async (resp) => {
        let unreadData;
        unreadData =
          resp.messages.filter(
            (x) => x.unread > 0 && x.lastSentId != this.props.currentUser._id
          ).length || 0;

        var gr = resp.messages.filter((x) => x.isGroup);

        var groupData = gr.filter((item) =>
          item.groupConversation.some(
            (employee) =>
              !employee.viewedBy.includes(this.props.currentUser._id)
          )
        );

        for (let index = 0; index < groupData.length; index++) {
          for (let i = 0; i < groupData[index].groupConversation.length; i++) {
            const element = groupData[index].groupConversation[i];
            if (
              element.senderId != this.props.currentUser._id &&
              !element.viewedBy.includes(this.props.currentUser._id)
            ) {
              element.unread = 1;
            }
          }
        }

        unreadData =
          resp.messages.filter(
            (x) => x.unread > 0 && x.lastSentId != this.props.currentUser._id
          ).length || 0;
        var finalUnreadCount = unreadData + (groupData.length || 0);
        var p = this.props.location.pathname;
        if (p.indexOf('/chat') != -1) {
          finalUnreadCount = 0;
        }
        this.setState({
          messages: resp.messages,
          msgNew: resp.total,
          unReadMessages: finalUnreadCount,
        });

        for (let index = 0; index < resp.messages.length; index++) {
          const element = resp.messages[index];
          if (element.subject && element.subject != '') {
            groupConnected(this.props.currentUser.name, element._id);
          }
        }
      },
      (error) => {}
    );
  };

  checkMore = () => {
    getNotifications({ page: 2, limit: 10 }).then(
      async (resp) => {
        if (resp.notifications.length > 0) {
          this.setState({
            seemore: true,
          });
        }
      },
      (error) => {
        try {
          if (error.status == 401 || error.status == 403) {
            this.logout();
          }
        } catch {
          /* empty */
        }
      }
    );
  };

  logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('oauthUsrToken');
    localStorage.removeItem('oauthUsrSecret');
    signOut()
      .then((data) => {
        localStorage.clear();
        // localStorage.removeItem('jwt');
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem("oauthUsrToken");
        // localStorage.removeItem("oauthUsrSecret");
        window.location.href = '/login';
      })
      .catch((error) => {
        alertBox(true, error);
      });
  };

  sync = () => {
    twitterSync().then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
      },
      (error) => {}
    );
  };

  handleInput = (value) => {
    console.log('value', value);
    this.setState({
      searchQuery: value,
      //.replace(/[^\w\s]/gi, "")
    });
    var filter = localStorage.getItem('filter');
    history.push(
      '/search?q=' +
        value +
        //.replace(/[^\w\s]/gi, ""))
        (filter != null && typeof filter != 'undefined' && filter != ''
          ? '&filter=' + filter
          : '')
    );
    if (value.length > 30 || value.length < 4) {
      alertBox(true, 'Search is required with in 4 to 30 charecters');
    }
  };

  iconClick = (n) => {
    if (n != 4) {
      setNotificationsViewed();
    }
    this.setState(
      {
        new: 0,
      },
      () => {
        this.handleIconClick(n);
      }
    );
  };
  goToNotification = (item) => {
    setNotificationsViewed();
    this.setState(
      {
        new: 0,
      },
      () => {
        if (item.type == 'tribes_group_invited') {
          return;
        }
        if (item.type == 'friend_request' || item.type == 'request_accepted') {
          // history.push("/u/"+item.userId);
          window.location.href = '/u/' + item.userId;
        } else if (item.type == 'wallets_created') {
          // history.push("/wallet/deposit");
          window.location.href = '/wallet/deposit';
        } else if (
          item.type == 'gig_request_update_price' ||
          item.type == 'gig_request' ||
          item.type == 'gig_accept' ||
          item.type == 'gig_request_reject' ||
          item.type == 'gig_canceled'
        ) {
          // history.push("/passionomy/request/"+item.data.gig_name);
          window.location.href = '/passionomy/request/' + item.data.gig_name;
        } else if (
          item.type === 'gig_update_price' ||
          item.type == 'gig_accept_hand' ||
          item.type == 'gig_rejected' ||
          item.type == 'gig_accept_purchase' ||
          item.type == 'gig_released'
        ) {
          // history.push("/passionomy/dashboard/gig/"+item.data.gig_id);
          window.location.href =
            '/passionomy/dashboard/gig/' + item.data.gig_id;
        } else if (item.type == 'gigs_like' || item.type === 'gigs_rating') {
          window.location.href = '/passionomy/gig/' + item.data.slug;
        } else if (item.type == 'gigs_messages') {
          // history.push("/passionomy/dashboard/gig/"+item.data.postid);
          window.location.href =
            '/passionomy/dashboard/gig/' + item.data.postid;
        } else if (item.type == 'gigs_submit') {
          window.location.href =
            '/passionomy/dashboard/gig/' +
            item.data.postid +
            '#' +
            item.data.chatId;
          var current_path = window.location.href;
          var new_path =
            process.env.REACT_APP_FRONTEND +
            'passionomy/dashboard/gig/' +
            item.data.postid +
            '#' +
            item.data.chatId;
          if (document.getElementById(item.data.chatId)) {
            var objDiv = document.getElementById(item.data.chatId)[0];
            if (objDiv != undefined) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          } else {
            if (current_path == new_path) {
              window.location.reload();
            }
          }
        } else if (item.type == 'Blog-purchase') {
          // history.push("/wallet/transactions");

          window.location.href = '/wallet/transactions';
        } else if (
          (item.type == 'post_liked' && item.postType == 'blog') ||
          (item.type == 'post_commented' && item.postType == 'blog')
        ) {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = '/' + item.postType + '/' + item.data.postid;
        } else if (
          item.type == 'post_tag' ||
          item.type == 'post_liked' ||
          item.type == 'post_sharing' ||
          item.type == 'product_sharing' ||
          item.type == 'post_commented'
        ) {
          // history.push("/post/"+item.data.postid);
          window.location.href = '/post/' + item.data.postid;
        } else if (item.type == 'group_sharing' && item.postType == 'group') {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = '/viewgroup/' + item.data.postid;
        } else if (
          (item.type == 'Tribes-subscribe-payment' &&
            item.postType == 'tribes') ||
          (item.type == 'Tribes-subscribe-rem-payment' &&
            item.postType == 'tribes')
        ) {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = '/viewgroup/' + item.data.group_id;
        } else if (item.type == 'request-join-group') {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = '/settings/' + item.data.group_id;
        } else if (
          item.postType == undefined &&
          item.type == 'comment_replied'
        ) {
          // history.push("/post/"+item.data.postid);
          window.location.href = '/post/' + item.data.postid;
        } else if (item.postType === 'product_chat') {
          history.push({
            pathname: '/market-chat-with-seller-2',
            state: {
              products: item.data.products,
              chatId: item.data.chatId,
              receiverId: item.forId,
              isLoadedFrom: 'notification',
            },
          });
        } else if (item.postType === 'product_like') {
          history.push({
            pathname: '/market-product-detail',
            state: { ...item.data.products },
          });
        } else if (item.postType === 'product_checkout') {
          history.push('/wallet/transactions');
        } else if (
          item.type === 'group_chat_delete' ||
          item.type === 'group_chat_create' ||
          item.type === 'group_chat_exit'
        ) {
          window.location.href = '/chat';
        } else {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = '/' + item.postType + '/' + item.data.posti;
        }
      }
    );
  };
  openMobNav = () => {
    this.props.openMobNav();
  };
  goToMessage = (r) => {
    window.location.href = '/chat?u=' + r._id;

    // setMessageNotificationsViewed({ _id: this.props.currentUser._id, chatid: r._id });
    // // setNotificationsViewed();
    // // if(item.type == 'friend_request' ||  item.type == 'request_accepted'){
    // //   history.push("/u/"+item.userId);
    // // }
    // // else {
    // var uid = r.user1 !== undefined ? r.user1._id : '';
    // if (uid == this.props.currentUser._id) {
    //   uid = r.user2._id;
    // }
    // getCurrentChat({ id: uid }).then(resp => {
    //   var temp = this.state.messages;
    //   var foundIndex = temp.findIndex(x => x._id == r._id);

    //   temp[foundIndex]['unread'] = 0;

    //   this.setState({
    //     messages: temp,
    //     msgNew: 0
    //   }, () => {
    //     //history.push("/messenger/"+(r.user1._id == this.props.currentUser._id ? r.user2._id : r.user1._id));
    //     this.props.openChat(r);
    //   })
    // }, error => {
    //   alertBox(true, error.data.message);
    // });

    // //}
  };

  handlemodal = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleSearch = (e) => {
    console.log('handleSearch', e.target);
    e.preventDefault();
    if (this.state.searchQuery && this.state.searchQuery.trim()) {
      var query = queryParse(this.props.location.search);
      var filter = localStorage.getItem('filter');
      history.push(
        '/search?q=' +
          this.state.searchQuery +
          (filter != null && typeof filter != 'undefined' && filter != ''
            ? '&filter=' + filter
            : '')
      );
      if (
        this.state.searchQuery.length > 30 ||
        this.state.searchQuery.length < 4
      ) {
        alertBox(true, 'Search is required with in 4 to 30 charecters');
      }
    }
  };

  redirectHome = () => {
    this.setState({ searchQuery: '' });
    window.location.href = '/home';
  };

  openNav = (url) => {
    // let params = queryStrings.parse(this.props.location)
    // let paramString = window.location.href
    // var splitUrl = paramString.split('/')[1];
    // var p = splitUrl;
    // // this.setState({
    // //   currUrl: splitUrl
    // // });
    // this.currUrl = splitUrl;
    // // if((p.indexOf("/blog/") != -1 || p.indexOf("/blogs/") != -1 || p.indexOf("/passionomy") != -1  )&& (this.props.currentUser == undefined || this.props.currentUser == null)){
    // //   this.setState({
    // //     global:true
    // //   });
    // // }else{
    // //     this.setState({
    // //         global:false
    // //       });
    // //  }
    this.setState({ searchQuery: '' });
    window.location.href = url;
  };

  approveTribesGroupInvite(data) {
    var request = {};
    request.group_id = data.data.groupid;
    request.memberid = data.data.memberid;
    request.notificationid = data._id;
    request.forid = data.userId;
    approveInviteTribesGroup(request).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        var temp = this.state.notifications;
        var filtered = temp.filter(function (el) {
          return el._id != data._id;
        });
        this.setState({
          notifications: filtered,
        });
      },
      (error) => {}
    );
  }

  rejectTribesGroupInvite(data) {
    var request = {};
    request.group_id = data.data.groupid;
    request.memberid = data.data.memberid;
    request.notificationid = data._id;
    request.forid = data.userId;
    rejectInviteTribesGroup(request).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        var temp = this.state.notifications;
        var filtered = temp.filter(function (el) {
          return el._id != data._id;
        });
        this.setState({
          notifications: filtered,
        });
      },
      (error) => {}
    );
  }

  render() {
    const current = this.state.current;
    return (
      <React.Fragment>
        <header className="mywallheader fixed-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-12 p-0">
                {
                  <nav className="navbar navbar-expand-lg navbar-light navbar--header-top">
                    <div className="container-fluid">
                      {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button> */}

                      <div className="header-nav" id="navbarSupportedContent">
                        <span
                          className="navbar-toggler-icon"
                          onClick={this.openMobNav}
                        ></span>
                        <a
                          href="javascript:void(0)"
                          className="main-logo"
                          onClick={this.redirectHome}
                        >
                          <span className="navbar-brand">
                            <img src={main_logo} />
                          </span>
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="icon-logo"
                          onClick={this.redirectHome}
                        >
                          <span className="">
                            <img
                              src={require('../../assets/images/logo-icon.png')}
                            />
                          </span>
                        </a>
                        <div className="header-search sm-hide">
                          {this.props.currentUser &&
                          typeof this.props.currentUser._id != 'undefined' &&
                          this.props.currentUser._id != null ? (
                            <div className="header-search-form ">
                              <form
                                className="form-inline my-2 my-lg-0"
                                onSubmit={this.handleSearch}
                              >
                                <div className="input-group navbar--search">
                                  <div className="input-group-append">
                                    <button
                                      className="btn btn-secondary search-btn"
                                      type="button"
                                      onClick={this.handleSearch}
                                    >
                                      <i className="fa fa-search"></i>
                                    </button>
                                  </div>
                                  <DebouncedInput
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={this.state.searchQuery}
                                    onChange={this.handleInput}
                                  />
                                </div>
                              </form>
                            </div>
                          ) : null}
                        </div>
                        {/* <button onClick={this.msg}>Send</button>
                {this.state.newNotification} */}

                        {this.props.currentUser &&
                        typeof this.props.currentUser._id != 'undefined' &&
                        this.props.currentUser._id != null ? (
                          <ul className="navbar-nav navbar-right">
                            <ul className="row-e mb-1" style={{ zIndex: '99' }}>
                              {}
                              <li className="global-menu sm-hide mr-3 header-menu-text">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() => this.openNav('/passionomy')}
                                  className={
                                    ' ' +
                                    (window.location.pathname.indexOf(
                                      '/passionomy'
                                    ) === 0 && 'active')
                                  }
                                >
                                  Passionomy
                                </a>
                              </li>
                              <li className="global-menu sm-hide   mr-3 header-menu-text">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() => this.openNav('/blogs/all')}
                                  className={
                                    ' ' +
                                    (window.location.pathname.indexOf(
                                      '/blogs'
                                    ) === 0 && 'active')
                                  }
                                >
                                  Blogs
                                </a>
                              </li>
                              <li className="global-menu sm-hide   mr-3 header-menu-text">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    this.openNav('/market-default-view')
                                  }
                                  className={
                                    ' ' +
                                    (window.location.pathname.indexOf(
                                      '/market-default-view'
                                    ) === 0 && 'active')
                                  }
                                >
                                  Marketplace
                                </a>
                              </li>
                              <li className="global-menu sm-hide   mr-3 header-menu-text">
                                <A
                                  href="/groups"
                                  onClick={() => this.openNav()}
                                  className={
                                    ' ' +
                                    (window.location.pathname.indexOf(
                                      '/groups'
                                    ) === 0 && 'active')
                                  }
                                >
                                  Tribes
                                </A>
                              </li>
                            </ul>
                            <li className="nav-item active ">
                              <a
                                href="javascript:void(0)"
                                onClick={(e) => this.openNav('/wallet/deposit')}
                              >
                                <Button
                                  type="button"
                                  className="primaryBtn walletAlign-style"
                                  variant="primary"
                                >
                                  Wallet
                                </Button>
                              </a>
                            </li>
                            <span className="rightDivider"></span>
                            <li
                              className={
                                'nav-item active ni4 ' +
                                (this.state.open4 ? 'show' : '')
                              }
                              onClick={() => {
                                this.iconClick(4);
                              }}
                            >
                              <Button
                                type="button"
                                className="mb-1 menuDropicon menutopRight"
                                variant="primary"
                              >
                                <i className="fa fa-th-large"></i>
                              </Button>
                              <div className="menu-hover-container menu-plus">
                                <div className="container">
                                  <div className="row">
                                    <ul className="list-group w-100">
                                      <li className="list-group-item ">
                                        <a
                                          href="javascript:void(0)"
                                          onClick={(e) => this.openNav('/feed')}
                                        >
                                          <p className="media-heading">Feed</p>
                                        </a>
                                      </li>
                                      <li className="list-group-item ">
                                        <a
                                          href="javascript:void(0)"
                                          onClick={(e) =>
                                            this.openNav('/add-blog')
                                          }
                                        >
                                          <p className="media-heading">Blog</p>
                                        </a>
                                      </li>
                                      <li className="list-group-item ">
                                        <a
                                          href="javascript:void(0)"
                                          onClick={(e) =>
                                            this.openNav('/passionomy/gigs/add')
                                          }
                                        >
                                          <p className="media-heading">Gig</p>
                                        </a>
                                      </li>
                                      <li className="list-group-item ">
                                        <a
                                          href="javascript:void(0)"
                                          onClick={(e) =>
                                            this.openNav('/market-default-view')
                                          }
                                        >
                                          <p className="media-heading">
                                            Marketplace
                                          </p>
                                        </a>
                                      </li>
                                      {/* <li className="list-group-item ">
                          <A href="/passionomy/request"><p className="media-heading">Gig Request</p></A>
                          </li> */}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="nav-item active sm-show">
                              <A className="nav-link" href={'search'}>
                                <i className="fa fa-search mob-s"></i>
                              </A>
                            </li>
                            {/* <li>
              <div className="global-menu sm-hide">
              <A href="/passionomy" className={""+current == '/passionomy' ? 'active' : ''}>Passionomy</A>
              <A href="/blogs/all" className={""+current == '/blogs/all' ? 'active' : ''}>Blogs</A>
            </div>
              </li> */}
                            {/* <li className="global-menu sm-hide mr-3 header-menu-text">
              <a href="/passionomy" className={""+current == '/passionomy' ? 'active' : ''}>Passionomy</a>
              </li>
              <li  className="global-menu sm-hide  mr-4 header-menu-text">
              <a href="/blogs/all" className={""+current == '/blogs/all' ? 'active' : ''}>Blogs</a>
              </li> */}

                            <li
                              className={
                                'nav-item active ni2 ' +
                                (this.state.open2 ? 'show' : '')
                              }
                              onClick={() => {
                                this.iconClick(2);
                              }}
                            >
                              <a className="nav-link countCircle" href="/chat">
                                <img
                                  className="icon"
                                  src={GetAssetImage(
                                    'icons/chat_bubble_outline-24px.svg'
                                  )}
                                />
                                {/* {this.state.msgNew > 0 && <span className="countCircle_Txt">{this.state.msgNew}</span>} */}
                                {this.state.unReadMessages > 0 && (
                                  <span className="countCircle_Txt">
                                    {this.state.unReadMessages}
                                  </span>
                                )}
                              </a>
                              {/* {this.state.msgNew > 0 && <span className=" countCircle_Txt">{this.state.msgNew}</span> } */}
                              {/* {this.state.messages.filter(x => x.unread > 0 && x.lastSentId != this.props.currentUser._id).length > 0 && <span className=" counter counter-lg">{this.state.messages.filter(x => x.unread > 0 && x.lastSentId != this.props.currentUser._id).length}</span>} */}

                              {/* 
                              <div className="menu-hover-container menu-notification dropdown-menu-right">
                                <div className="container">
                                  <div className="row">

                                    <ul className="list-group w-100">

                                      {
                                        this.state.messages && this.state.messages.map((r, i) => {
                                          return <li className="list-group-item " >
                                            {
                                              (r.isGroup) ?
                                                <div>
                                                  <div onClick={() => this.goToMessage(r)} className={"media w-100 d-flex align-items-center "}>
                                                    <div className="media-left">
                                                      {
                                                        <span >
                                                          <img className="media-object pic circle"
                                                            src={profilePic(r.pic)} alt="..." />
                                                        </span>
                                                      }
                                                    </div>
                                                    <div className="media-body">
                                                                   
                     <p className="media-heading"><b>{r.name}</b></p>
                                                      <p className={"media-subheading " + (r.groupConversation[r.groupConversation.length - 1].unread > 0 ? 'unread-boldmsg' : '')}>{r.groupConversation[r.groupConversation.length - 1].message + " - "} <TimeAgo date={r.groupConversation[r.groupConversation.length - 1].createdAt} /></p>
                                                    </div>
                                                    <div className="media-right">
                                                      {r.groupConversation[r.groupConversation.length - 1].unread > 0 && <span className="badge badge-dark">{r.groupConversation[r.groupConversation.length - 1].unread}</span>}
                                                    </div>
                                                  </div>
                                                </div>
                                                :
                                                <div>
                                                  <div onClick={() => this.goToMessage(r)} className={"media w-100 d-flex align-items-center " + (!r.read ? 'active' : '')}>
                                                    <div className="media-left">
                                                      {
                                                        r.user1 !== undefined ?
                                                          <span >
                                                            <img className="media-object pic circle"
                                                              src={profilePic((r.user1._id == this.props.currentUser._id ? r.user2.avatar : r.user1.avatar))} alt="..." />
                                                          </span>
                                                          :
                                                          <span >
                                                            <img className="media-object pic circle" alt="..." />
                                                          </span>
                                                      }
                                                    </div>
                                                    <div className="media-body">
                                                      <p className="media-heading"><b>{(r.user1 !== undefined && r.user1._id == this.props.currentUser._id ? r.user2.name : r.user1 !== undefined ? r.user1.name : '')}</b></p>
                                                      <p className={"media-subheading " + (r.unread > 0 ? 'unread-boldmsg' : '')}>{r.lastMessage != null && r.lastMessage + " - "} <TimeAgo date={r.updatedAt} /></p>
                                                    </div>
                                                    <div className="media-right">
                                                      {r.unread > 0 && <span className="badge badge-dark">{r.unread}</span>}
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </li>
                                        })
                                      }


                                    </ul>
                                  </div>

                                  
                                </div>

                              </div> */}
                            </li>
                            {/* <li className="nav-item active">
                  <button type="button" className="btn btn-light btn-sm theme-btn" onClick={this.sync}>Sync</button>
                  </li> */}
                            <li
                              className={
                                'nav-item active ni1 ' +
                                (this.state.open1 ? 'show' : '')
                              }
                              onClick={() => {
                                this.iconClick(1);
                              }}
                            >
                              <a className="nav-link" href="javascript:;">
                                <img
                                  className="icon"
                                  src={GetAssetImage(
                                    'icons/Icon ionic-ios-notifications-outline.svg'
                                  )}
                                />
                                {this.state.new > 0 && (
                                  <span className="badge badge-light">
                                    {this.state.new}
                                  </span>
                                )}
                              </a>

                              <div className="menu-hover-container menu-notification dropdown-menu-right">
                                <div className="container">
                                  <div className="row">
                                    <ul className="list-group w-100">
                                      {this.state.notifications &&
                                        this.state.notifications.map(
                                          (not, i) => {
                                            return (
                                              not.forId ==
                                                this.props.currentUser._id &&
                                              i <= 10 && (
                                                <li
                                                  className="list-group-item "
                                                  key={i}
                                                >
                                                  <div
                                                    onClick={() =>
                                                      this.goToNotification(not)
                                                    }
                                                    className={
                                                      'media w-100 d-flex align-items-center ' +
                                                      (!not.viewed
                                                        ? 'active'
                                                        : '')
                                                    }
                                                  >
                                                    <div className="media-left">
                                                      <span>
                                                        <img
                                                          className="media-object pic circle"
                                                          src={profilePic(
                                                            not.user.avatar,
                                                            not.user.name
                                                          )}
                                                          alt="..."
                                                        />
                                                      </span>
                                                    </div>
                                                    <div className="media-body">
                                                      <p className="media-heading">
                                                        {not.type ==
                                                          'friend_request' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            sent you a friend
                                                            request
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'request_accepted' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has accepted your
                                                            request
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'post_liked' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            liked your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'post_sharing' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            shared your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_sharing' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            shared your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'post_commented' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            commented on your{' '}
                                                            {not.postType}{' '}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'comment_liked' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            liked your comment
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'request-join-group' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            sent you a member
                                                            request for join
                                                            group
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'comment_replied' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            replied to your
                                                            comment
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'tip_send' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            tip received to your
                                                            post
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'post_tagged' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            tagged you in a post
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'wallets_created' && (
                                                          <span>
                                                            Your wallets have
                                                            been created, you
                                                            can deposit now.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_request' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            sent you a gig
                                                            request.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_request_reject' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            reject your a gig
                                                            request.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_request_update_price' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            update the price
                                                            detail in gig
                                                            request.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_update_price' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            update the price
                                                            details in gig.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_accept' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has accept your gig
                                                            request.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_accept_purchase' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has purchased your
                                                            gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_accept_hand' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has accept your
                                                            handshake your gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gigs_messages' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            sent a message from
                                                            gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gigs_submit' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            submitted and closed
                                                            the gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_released' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            released the
                                                            payments for closed
                                                            gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_rejected' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            rejected your
                                                            submitted gigs.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gig_canceled' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            canceled your gig
                                                            request.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'post_tag' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            tagged to you on
                                                            post.
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'Blog-purchase' && (
                                                          <span>
                                                            You have received{' '}
                                                            {not.data.currency +
                                                              ' ' +
                                                              not.data
                                                                .amount}{' '}
                                                            for Blog Purchase
                                                            from{' '}
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'blog_sharing' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            shared your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'group_sharing' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            shared your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gigs_like' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            likes your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'gigs_rating' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            added rating to your{' '}
                                                            {not.postType}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'group_chat_delete' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            deleted the group{' '}
                                                            {
                                                              not.data
                                                                .group_name
                                                            }
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_chat' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            sent you a product
                                                            chat message{' '}
                                                            {not.data.message}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_checkout' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            checkout this
                                                            product{' '}
                                                            <b>
                                                              {not.data.title}
                                                            </b>{' '}
                                                            and transfered
                                                            amount is{' '}
                                                            <b>
                                                              {not.data.price}
                                                            </b>{' '}
                                                            to this currency{' '}
                                                            <b>
                                                              {
                                                                not.data
                                                                  .currency
                                                              }
                                                            </b>
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_checkout_cancel' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            canceled the
                                                            checkout of this
                                                            product{' '}
                                                            <b>
                                                              {not.data.title}
                                                            </b>{' '}
                                                            and refund amount is{' '}
                                                            <b>
                                                              {not.data.price}
                                                            </b>{' '}
                                                            and the currency is{' '}
                                                            <b>
                                                              {
                                                                not.data
                                                                  .currency
                                                              }
                                                            </b>
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_checkout_refund' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            refund the product{' '}
                                                            <b>
                                                              {not.data.title}
                                                            </b>{' '}
                                                            amount is{' '}
                                                            <b>
                                                              {not.data.price}
                                                            </b>{' '}
                                                            to this currency{' '}
                                                            <b>
                                                              {
                                                                not.data
                                                                  .currency
                                                              }
                                                            </b>
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'product_like' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            like your product{' '}
                                                            {
                                                              not.data.products
                                                                .title
                                                            }
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'group_chat_create' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            create the group{' '}
                                                            {
                                                              not.data
                                                                .group_name
                                                            }
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'group_chat_exit' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            exit the group{' '}
                                                            {
                                                              not.data
                                                                .group_name
                                                            }
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'Tribes-subscribe-payment' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            {
                                                              not.data
                                                                .group_name
                                                            }{' '}
                                                            - this group payment
                                                            was overdue,we
                                                            extend the payment
                                                            date
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'Tribes-subscribe-rem-payment' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            {
                                                              not.data
                                                                .group_name
                                                            }{' '}
                                                            - this group payment
                                                            was reached due date
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'tribes_group_invited' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has invited to join
                                                            the tribes group{' '}
                                                            {not.data
                                                              .groupname + ' '}
                                                            <span>
                                                              <button
                                                                onClick={() =>
                                                                  this.approveTribesGroupInvite(
                                                                    not
                                                                  )
                                                                }
                                                              >
                                                                Approve
                                                              </button>
                                                              <button
                                                                onClick={() =>
                                                                  this.rejectTribesGroupInvite(
                                                                    not
                                                                  )
                                                                }
                                                              >
                                                                Reject
                                                              </button>
                                                            </span>
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'tribes_group_rejected' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has reject
                                                            invitation for
                                                            tribes group{' '}
                                                            {not.data
                                                              .groupname + ' '}
                                                          </span>
                                                        )}
                                                        {not.type ==
                                                          'tribes_group_approved' && (
                                                          <span>
                                                            <b>
                                                              {not.user.name}
                                                            </b>{' '}
                                                            has approved
                                                            invitation for
                                                            tribes group{' '}
                                                            {not.data
                                                              .groupname + ' '}
                                                          </span>
                                                        )}
                                                        -{' '}
                                                        <TimeAgo
                                                          date={not.createdAt}
                                                        />
                                                      </p>
                                                    </div>
                                                  </div>
                                                </li>
                                              )
                                            );
                                          }
                                        )}
                                    </ul>
                                  </div>
                                  {this.state.seemore && (
                                    <A
                                      href="/all/notifications"
                                      className="seemore-text"
                                    >
                                      See More
                                    </A>
                                  )}
                                </div>
                              </div>
                            </li>
                            <li
                              className={
                                'nav-item active ni3 ' +
                                (this.state.open3 ? 'show' : '')
                              }
                              onClick={() => {
                                this.iconClick(3);
                              }}
                            >
                              <A className="nav-link status ">
                                <img
                                  className="borderRadius50 headerPic"
                                  src={profilePic(
                                    this.props.currentUser.avatar,
                                    this.props.currentUser.name
                                  )}
                                />
                              </A>
                              <div className="menu-hover-container menu-profile">
                                <div className="container">
                                  <div className="row">
                                    <ul className="list-group w-100">
                                      <li
                                        className="list-group-item pointer"
                                        onClick={(e) =>
                                          this.openNav('/profile')
                                        }
                                      >
                                        <div className="media w-100 d-flex align-items-center">
                                          <div className="media-left">
                                            <i className="fa fa-user"></i>
                                          </div>
                                          <div className="media-body">
                                            <a
                                              href="javascript:void(0)"
                                              className="noPad"
                                            >
                                              <p className="media-heading">
                                                Profile
                                              </p>
                                            </a>
                                          </div>
                                          <div className="media-right  d-flex  align-items-center"></div>
                                        </div>
                                      </li>

                                      <li
                                        className="list-group-item pointer"
                                        onClick={(e) =>
                                          this.openNav('/settings')
                                        }
                                      >
                                        <div className="media w-100 d-flex align-items-center">
                                          <div className="media-left">
                                            <i className="fa fa-gear"></i>
                                          </div>
                                          <div className="media-body">
                                            <a
                                              href="javascript:void(0)"
                                              className="noPad"
                                            >
                                              <p className="media-heading">
                                                Settings
                                              </p>
                                            </a>
                                          </div>
                                          <div className="media-right  d-flex  align-items-center"></div>
                                        </div>
                                      </li>

                                      <li
                                        className="list-group-item menu--profile-logout"
                                        onClick={this.logout}
                                      >
                                        <div className="media w-100 d-flex align-items-center">
                                          <div className="media-left">
                                            <i className="fa fa-power-off"></i>
                                          </div>
                                          <div className="media-body pointer">
                                            <p className="media-heading">
                                              Log out
                                            </p>
                                          </div>
                                          <div className="media-right  d-flex  align-items-center"></div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </li>
                            {/*  <li className="br-dot"></li> */}
                          </ul>
                        ) : (
                          <ul className="navbar-nav ml-auto">
                            <li className="nav-item active ">
                              <A href="/login" className="nav-link">
                                <img
                                  className="borderRadius50 headerPic"
                                  src={profilePic()}
                                />
                                <span className="badge online"></span>
                              </A>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </nav>
                }
                <GlobalMenu {...this.props} openMobNav={this.openMobNav} />
              </div>
            </div>
          </div>
          {!this.state.global && this.props.currentUser != undefined && (
            <Modal
              displayModal={this.state.modal}
              closeModal={this.handleModal}
            >
              <CreatePost {...this.props} />
            </Modal>
          )}
        </header>
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
