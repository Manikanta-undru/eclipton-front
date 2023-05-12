import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';
import InfiniteScroll from 'react-infinite-scroller';
import A from '../../components/A';
import Button from '../../components/Button';
import DebouncedInput from '../../components/DebouncedInput/DebouncedInput';
import SocialMenu from '../../components/Menu/SocialMenu';
import { profilePic } from '../../globalFunctions';
import { connectSocket, friendRequest } from '../../hooks/socket';
import {
  acceptRequest,
  cancelRequest,
  followUser,
  getSuggestions,
} from '../../http/http-calls';
import Spinner from '../../components/Spinner';

require('./styles.scss');

class AllSuggested extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      limit: 20,
      users: [],
      seemore: false,
      showSkeleton: true,
    };
  }

  getSuggestedFriends = (page = this.state.page, key = '') => {
    getSuggestions({ limit: this.state.limit, page, key }, true).then(
      async (resp) => {
        const combine = this.state.users.concat(resp.message);
        const unique = [];
        combine.map((x) =>
          unique.filter((a) => a._id == x._id).length > 0
            ? null
            : unique.push(x)
        );
        this.setState(
          { users: page == 1 ? resp.message : unique, showSkeleton: false },
          () => {
            this.checkMore(1);
          }
        );
      },
      (error) => {}
    );
  };

  checkMore = (i) => {
    getSuggestions(
      { limit: this.state.limit, page: this.state.page + 1 },
      true
    ).then(
      async (resp) => {
        if (resp.message !== undefined && resp.message.length > 0) {
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

  componentDidMount() {
    this.getSuggestedFriends();
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    friendRequest((request) => {
      window.location.reload();
    });
  }

  search = (val) => {
    if (val) {
      this.getSuggestedFriends(1, val);
    } else if (val === '') {
      this.getSuggestedFriends(1, val);
    }
  };

  addFriend = (id, userIndex, setLoading) => {
    setLoading(true);
    followUser({ followerid: id }, true).then(
      async (resp) => {
        setLoading(false);
        const tempUser = this.state.users;
        tempUser[userIndex]._id = resp._id;
        tempUser[userIndex].request = resp.request;
        tempUser[userIndex].type = 'sent';
        tempUser[userIndex].uid = resp.followerid;
        if (this.props.refresh != null) {
          this.props.refresh();
        }
        this.setState({
          users: tempUser,
        });
      },
      (error) => {
        setLoading(false);
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

  accept = (user, index, item, setLoading) => {
    setLoading(true);
    if (item == 0) {
      acceptRequest({ id: user._id }, true).then(
        async (resp) => {
          setLoading(false);
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
          setLoading(false);
        }
      );
    } else {
      cancelRequest({ id: user.uid }, true).then(
        async (resp) => {
          setLoading(false);
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
          setLoading(false);
        }
      );
    }
  };

  cancelRequest = (id, index, item, setLoading) => {
    setLoading(true);
    cancelRequest({ id }, true).then(
      async (resp) => {
        setLoading(false);
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
        setLoading(false);
      }
    );
  };

  loadFunc = () => {
    if (!this.state.showSkeleton) {
      this.setState(
        {
          showSkeleton: true,
          page: this.state.page + 1,
        },
        () => {
          this.getSuggestedFriends();
        }
      );
    }
  };

  render() {
    return (
      <div className="seeAllPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column">
              <SocialMenu {...this.props} />
            </div>
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="empty-container-with-border w-100 friendsWidget">
                <h3 className="title">Make New Friends</h3>
                <div className="w-100 mb-2">
                  <DebouncedInput
                    type="text"
                    className="form-control"
                    autoFocus
                    placeholder="Search"
                    id="friendSearch"
                    onChange={this.search}
                  />
                </div>
                {this.state.users.length === 0 && (
                  <p className="no-found">No People Found</p>
                )}
                <InfiniteScroll
                  pageStart={0}
                  initialLoad={false}
                  loadMore={this.loadFunc}
                  hasMore={this.state.seemore}
                >
                  {this.state.users.map((user, i) => (
                    <UserRow
                      user={user}
                      i={i}
                      addFriend={this.addFriend}
                      cancelRequest={this.cancelRequest}
                      accept={this.accept}
                      key={i}
                    />
                  ))}
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
            <div className="col-sm empty-container-with-out-border right-column">
              {/* <PopularArticles /> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}
function UserRow({ user, i, addFriend, cancelRequest, accept }) {
  const [loading, setLoading] = useState(false);

  return (
    <ul className="list-group w-100">
      <li className="list-group-item">
        <div className="media">
          <div className="media-left proImg_left">
            {user && (
              <A
                href={`/u/${
                  user.request !== undefined && user.request == 'pending'
                    ? user.uid
                    : user._id
                }`}
              >
                <img
                  className="media-object circle widgetAvatar"
                  src={profilePic(user.avatar, user.name)}
                  alt="..."
                />
              </A>
            )}
          </div>
          <div className="media-body">
            {user && (
              <A
                href={`/u/${
                  user.request !== undefined && user.request == 'pending'
                    ? user.uid
                    : user._id
                }`}
              >
                <p className="media-heading">{user.name}</p>
              </A>
            )}
            {/* <p className="media-subheading">{user.job == null ? "Eclipton User" : user.job}</p> */}
          </div>
          <div className="col media-right homePen">
            {!loading && user && user.request == undefined && (
              <Button
                variant="removeBtn_border"
                className=""
                onClick={() => addFriend(user._id, i, setLoading)}
              >
                <i className="fa fa-plus" /> Add
              </Button>
            )}
            {!loading &&
              user &&
              user.request !== undefined &&
              user.request == 'pending' &&
              user.type == 'sent' && (
                <Button
                  variant="dropdownBtn"
                  layout="dropdown"
                  dropdownOptions={['Cancel']}
                  onClick={(n) => {
                    cancelRequest(user.uid, i, n, setLoading);
                  }}
                >
                  Pending
                </Button>
              )}
            {!loading &&
              user &&
              user.request !== undefined &&
              user.request == 'pending' &&
              user.type == 'received' && (
                <Button
                  variant="dropdownBtn"
                  layout="dropdown"
                  dropdownOptions={['Accept', 'Reject']}
                  onClick={(n) => accept(user, i, n, setLoading)}
                >
                  Respond
                </Button>
              )}
            {loading && (
              <div className="loader-spinner">
                <Spinner style={{ width: '25px', height: '25px' }} />
              </div>
            )}
          </div>
        </div>
      </li>
    </ul>
  );
}

export default AllSuggested;
