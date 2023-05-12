import React from 'react';
import ContentLoader from 'react-content-loader';
import InfiniteScroll from 'react-infinite-scroller';
import TimeAgo from 'react-timeago';
import { switchLoader } from '../../commonRedux';
import { profilePic } from '../../globalFunctions';
import { connectSocket, friendRequest } from '../../hooks/socket';
import {
  acceptRequest,
  cancelRequest,
  followUser,
} from '../../http/http-calls';
import {
  getNotifications,
  setNotificationsViewed,
} from '../../http/post-calls';
import { history } from '../../store';

require('./styles.scss');

class AllNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      limit: 20,
      users: [],
      totalNotify: 0,
      seemore: false,
      showSkeleton: true,
    };
  }

  getSuggestedFriends = () => {
    getNotifications({ limit: this.state.limit, page: this.state.page }).then(
      (resp) => {
        if (resp.notifications !== undefined && resp.notifications.length > 0) {
          let old_state = [];
          if (this.state.users.length > 0) {
            this.state.users.map((val, i) => {
              if (val !== null) {
                const match = resp.notifications.filter(
                  (item) => item._id === val._id
                );
                if (match.length > 0) {
                  this.setState((prevState) => {
                    const updatedUsers = [...prevState.users];
                    updatedUsers[i] = null;
                    return { users: updatedUsers };
                  });
                }
              }
            });
            const new_user = [];
            this.state.users.map((item) => {
              if (item !== null) {
                new_user.push(item);
              }
            });
            old_state = [...new_user, ...resp.notifications];
          } else {
            old_state = resp.notifications;
          }
          this.setState({
            users: old_state,
            seemore: !!(
              resp &&
              resp.totalnoty != old_state.length &&
              resp.notifications.length > 0
            ),
            postLoaded: true,
            showSkeleton: false,
            totalNotify: resp.totalnoty,
          });
          // this.checkMore(1);
        } else {
          this.setState({
            users: resp.notifications,
            seemore: false,
            showSkeleton: true,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  checkMore = (i) => {
    getNotifications(
      { limit: this.state.limit, page: this.state.page + 1 },
      true
    ).then(
      async (resp) => {
        if (resp.notifications !== undefined && resp.notifications.length > 0) {
          this.setState({
            seemore: true,
          });
        } else {
          this.setState({
            seemore: false,
          });
        }
      },
      (error) => {}
    );
  };

  goToNotification = (item) => {
    setNotificationsViewed();
    this.setState(
      {
        new: 0,
      },
      () => {
        if (item.type == 'friend_request' || item.type == 'request_accepted') {
          history.push(`/u/${item.userId}`);
        } else if (item.type == 'wallets_created') {
          history.push('/wallet/deposit');
        } else if (
          item.type == 'gig_request' ||
          item.type == 'gig_request_update_price' ||
          item.type == 'gig_request_reject'
        ) {
          history.push(`/passionomy/request/${item.data.gig_name}`);
        } else if (item.type == 'gigs_like') {
          window.location.href = `/passionomy/gig/${item.data.slug}`;
        } else if (item.type == 'group_sharing' && item.postType == 'group') {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = `/viewgroup/${item.data.postid}`;
        } else if (
          (item.type == 'Tribes-subscribe-payment' &&
            item.postType == 'tribes') ||
          (item.type == 'Tribes-subscribe-rem-payment' &&
            item.postType == 'tribes')
        ) {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = `/viewgroup/${item.data.group_id}`;
        } else if (item.type == 'request-join-group') {
          // history.push("/"+item.postType+"/"+item.data.postid);
          window.location.href = `/settings/${item.data.group_id}`;
        } else if (
          item.type === 'gig_update_price' ||
          item.type == 'gig_accept' ||
          item.type == 'gig_accept_hand' ||
          item.type == 'gig_rejected' ||
          item.type == 'gig_released' ||
          item.type == 'gig_accept_purchase'
        ) {
          history.push(`/passionomy/dashboard/gig/${item.data.gig_id}`);
        } else if (item.type == 'gigs_messages') {
          history.push(`/passionomy/dashboard/gig/${item.data.postid}`);
        } else if (item.type == 'gigs_submit') {
          window.location.href = `/passionomy/dashboard/gig/${item.data.postid}#${item.data.chatId}`;
          const current_path = window.location.href;
          const new_path = `${process.env.REACT_APP_FRONTEND}passionomy/dashboard/gig/${item.data.postid}#${item.data.chatId}`;
          if (document.getElementById(item.data.chatId)) {
            const objDiv = document.getElementById(item.data.chatId)[0];
            if (objDiv != undefined) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          } else if (current_path == new_path) {
            window.location.reload();
          }
        } else if (item.type == 'Blog-purchase') {
          window.location.href = '/wallet/transactions';
        } else if (
          item.type === 'group_chat_delete' ||
          item.type === 'group_chat_create' ||
          item.type === 'group_chat_exit'
        ) {
          window.location.href = '/chat';
        } else {
          history.push(`/${item.postType}/${item.data.postid}`);
        }
      }
    );
  };

  componentDidMount() {
    this.getSuggestedFriends();
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    friendRequest((request) => {
      window.location.reload();
    });
  }

  addFriend = (id, userIndex) => {
    switchLoader(true, 'Sending Request... ');
    followUser({ followerid: id }, true).then(
      async (resp) => {
        switchLoader();
        const tempUser = this.state.users;
        tempUser[userIndex]._id = resp._id;
        tempUser[userIndex].request = resp.request;
        tempUser[userIndex].type = 'sent';
        if (this.props.refresh != null) {
          this.props.refresh();
        }
        this.setState({
          users: tempUser,
        });
      },
      (error) => {
        switchLoader();
      }
    );
  };

  //   callPendingRequests = () => {
  //     getPendingRequests({}, true)
  //       .then(async resp => {
  //         resp.length == 0 && setShowSkeletonPR(false) ;
  //       }, error => {
  //         switchLoader();

  //       });
  //   }

  //   callSuggestions = () => {
  //     getSuggestions({ limit: 10, page: 1 }, true)
  //       .then(async resp => {
  //         resp.message.length == 0 && setShowSkeleton(false);
  //         switchLoader();
  //       }, error => {
  //         switchLoader();

  //       });
  //   }

  accept = (user, index, item) => {
    switchLoader(true, 'Sending Request... ');
    if (item == 0) {
      acceptRequest({ id: user._id }, true).then(
        async (resp) => {
          switchLoader();
          const tempUser = this.state.users;
          delete tempUser[index];
          if (this.props.refresh != null) {
            this.props.refresh();
          }
          this.setState({
            users: tempUser,
          });
        },
        (error) => {
          switchLoader();
        }
      );
    } else {
      cancelRequest({ id: user.uid }, true).then(
        async (resp) => {
          switchLoader();
          const tempUser = this.state.users;
          // tempUser[index] = null;
          delete tempUser[index].request;
          if (this.props.refresh != null) {
            this.props.refresh();
          }
          this.setState({
            users: tempUser,
          });
        },
        (error) => {
          switchLoader();
        }
      );
    }
  };

  cancelRequest = (id, index, item) => {
    switchLoader(true, 'Cancelling...! ');
    cancelRequest({ id }, true).then(
      async (resp) => {
        switchLoader();
        const tempUser = this.state.users;
        // tempUser[index] = null;
        delete tempUser[index].request;
        if (this.props.refresh != null) {
          this.props.refresh();
        }
        this.setState({
          users: tempUser,
        });
      },
      (error) => {
        switchLoader();
      }
    );
  };

  loadFunc = () => {
    if (!this.state.showSkeleton && this.state.seemore) {
      this.setState({ showSkeleton: true });
      this.setState(
        (prevState) => ({
          ...prevState,
          page: prevState.page + 1,
          showSkeleton: true,
        }),
        () => {
          if (this.state.totalNotify > 10) {
            this.getSuggestedFriends();
          }
        }
      );
    } else {
      this.setState({ showSkeleton: true, postLoaded: true, seemore: false });
    }
  };

  render() {
    const { users } = this.state;
    return (
      <div className="seeAllPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column" />
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="empty-container-with-border w-100 popularArticles">
                <h3 className="title border-bottom pb-2">Notifications</h3>
                {users.length === 0 && this.state.toggleSkeleton && (
                  <p className="no-found">No Data Found</p>
                )}
                <InfiniteScroll
                  pageStart={0}
                  initialLoad={false}
                  loadMore={this.loadFunc}
                  hasMore={this.state.seemore}
                >
                  <ul className="list-group w-100">
                    {users &&
                      users.map((not, i) =>
                        not !== null ? (
                          <li className="list-group-item pointer" key={i}>
                            <div
                              onClick={() => this.goToNotification(not)}
                              className={`media w-100 d-flex align-items-center ${
                                !not.viewed ? 'active' : ''
                              }`}
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
                                  {not.type == 'friend_request' && (
                                    <span>
                                      <b>{not.user.name}</b> sent you a friend
                                      request
                                    </span>
                                  )}
                                  {not.type == 'request_accepted' && (
                                    <span>
                                      <b>{not.user.name}</b> has accepted your
                                      request
                                    </span>
                                  )}
                                  {not.type == 'post_liked' && (
                                    <span>
                                      <b>{not.user.name}</b> liked your{' '}
                                      {not.postType}
                                    </span>
                                  )}
                                  {not.type == 'post_sharing' && (
                                    <span>
                                      <b>{not.user.name}</b> shared your post
                                    </span>
                                  )}
                                  {not.type == 'post_commented' && (
                                    <span>
                                      <b>{not.user.name}</b> commented on your{' '}
                                      {not.postType}
                                    </span>
                                  )}
                                  {not.type == 'comment_liked' && (
                                    <span>
                                      <b>{not.user.name}</b> liked your comment
                                    </span>
                                  )}
                                  {not.type == 'comment_replied' && (
                                    <span>
                                      <b>{not.user.name}</b> replied to your
                                      comment
                                    </span>
                                  )}
                                  {not.type == 'tip_send' && (
                                    <span>
                                      <b>{not.user.name}</b> tip received to
                                      your post
                                    </span>
                                  )}
                                  {not.type == 'post_tagged' && (
                                    <span>
                                      <b>{not.user.name}</b> tagged you in a
                                      post
                                    </span>
                                  )}
                                  {not.type == 'gig_request' && (
                                    <span>
                                      <b>{not.user.name}</b> sent you a gig
                                      request.
                                    </span>
                                  )}
                                  {not.type == 'gig_request_reject' && (
                                    <span>
                                      <b>{not.user.name}</b> reject your a gig
                                      request.
                                    </span>
                                  )}
                                  {not.type == 'gig_request_update_price' && (
                                    <span>
                                      <b>{not.user.name}</b> update the price
                                      detail in gig request.
                                    </span>
                                  )}
                                  {not.type == 'gig_update_price' && (
                                    <span>
                                      <b>{not.user.name}</b> update the price
                                      details in gig.
                                    </span>
                                  )}
                                  {not.type == 'gig_accept' && (
                                    <span>
                                      <b>{not.user.name}</b> has accept your gig
                                      request.
                                    </span>
                                  )}
                                  {not.type == 'gig_accept_purchase' && (
                                    <span>
                                      <b>{not.user.name}</b> has purchased your
                                      gigs.
                                    </span>
                                  )}
                                  {not.type == 'gig_accept_hand' && (
                                    <span>
                                      <b>{not.user.name}</b> has accept your
                                      handshake your gigs.
                                    </span>
                                  )}
                                  {not.type == 'gigs_messages' && (
                                    <span>
                                      <b>{not.user.name}</b> sent a message from
                                      gigs.
                                    </span>
                                  )}
                                  {not.type == 'gigs_submit' && (
                                    <span>
                                      <b>{not.user.name}</b> submitted and
                                      closed the gigs.
                                    </span>
                                  )}
                                  {not.type == 'gig_released' && (
                                    <span>
                                      <b>{not.user.name}</b> released the
                                      payments for closed gigs.
                                    </span>
                                  )}
                                  {not.type == 'gig_rejected' && (
                                    <span>
                                      <b>{not.user.name}</b> rejected your
                                      submitted gigs.
                                    </span>
                                  )}
                                  {not.type == 'gig_canceled' && (
                                    <span>
                                      <b>{not.user.name}</b> canceled your gig
                                      request.
                                    </span>
                                  )}
                                  {not.type == 'post_tag' && (
                                    <span>
                                      <b>{not.user.name}</b> tagged to you on
                                      post.
                                    </span>
                                  )}
                                  {not.type == 'wallets_created' && (
                                    <span>
                                      <b>{not.user.name}</b> Your wallets have
                                      been created, you can deposit now.
                                    </span>
                                  )}
                                  {not.type == 'Blog-purchase' && (
                                    <span>
                                      You have received{' '}
                                      {`${not.data.currency} ${not.data.amount}`}{' '}
                                      for Blog Purchase from{' '}
                                      <b>{not.user.name}</b>{' '}
                                    </span>
                                  )}
                                  {not.type == 'blog_sharing' && (
                                    <span>
                                      <b>{not.user.name}</b> shared your{' '}
                                      {not.postType}
                                    </span>
                                  )}
                                  {not.type == 'group_sharing' && (
                                    <span>
                                      <b>{not.user.name}</b> shared your{' '}
                                      {not.postType}
                                    </span>
                                  )}
                                  {not.type == 'request-join-group' && (
                                    <span>
                                      <b>{not.user.name}</b> sent you a member
                                      request for join group
                                    </span>
                                  )}
                                  {not.type == 'gigs_like' && (
                                    <span>
                                      <b>{not.user.name}</b> likes your{' '}
                                      {not.postType}
                                    </span>
                                  )}
                                  {not.type == 'group_chat_delete' && (
                                    <span>
                                      <b>{not.user.name}</b> deleted the group{' '}
                                      {not.data.group_name}
                                    </span>
                                  )}
                                  {not.type == 'group_chat_create' && (
                                    <span>
                                      <b>{not.user.name}</b> created the group{' '}
                                      {not.data.group_name}
                                    </span>
                                  )}
                                  {not.type == 'group_chat_exit' && (
                                    <span>
                                      <b>{not.user.name}</b> created the group{' '}
                                      {not.data.group_name}
                                    </span>
                                  )}
                                  {not.type == 'Tribes-subscribe-payment' && (
                                    <span>
                                      <b>{not.user.name}</b>{' '}
                                      {not.data.group_name} - this group payment
                                      was overdue,we extend the payment date
                                    </span>
                                  )}
                                  {not.type ==
                                    'Tribes-subscribe-rem-payment' && (
                                    <span>
                                      <b>{not.user.name}</b>{' '}
                                      {not.data.group_name} - this group payment
                                      was reached due date
                                    </span>
                                  )}
                                  - <TimeAgo date={not.createdAt} />
                                </p>
                              </div>
                            </div>
                          </li>
                        ) : null
                      )}
                  </ul>
                </InfiniteScroll>

                {this.state.showSkeleton && (
                  <ul className="list-group w-100">
                    <li className="list-group-item">
                      {Array(3)
                        .fill()
                        .map((item, index) => (
                          <ContentLoader
                            speed={2}
                            height={40}
                            viewBox="0 0 200 40"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            {...this.props}
                            key={index}
                          >
                            <rect
                              x="48"
                              y="8"
                              rx="3"
                              ry="3"
                              width="88"
                              height="6"
                            />
                            <rect
                              x="48"
                              y="26"
                              rx="3"
                              ry="3"
                              width="52"
                              height="6"
                            />
                            <circle cx="20" cy="20" r="20" />
                          </ContentLoader>
                        ))}
                    </li>
                  </ul>
                )}
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column" />
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AllNotifications;
