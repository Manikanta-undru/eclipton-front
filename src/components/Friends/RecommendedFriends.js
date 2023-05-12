import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';
import { profilePic } from '../../globalFunctions';
import {
  getSuggestions,
  followUser,
  acceptRequest,
  cancelRequest,
} from '../../http/http-calls';
import Button from '../Button';
import { switchLoader } from '../../commonRedux';
import { friendRequest, connectSocket } from '../../hooks/socket';
import A from '../A';
import './style.scss';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import Spinner from '../Spinner';

class RecommendedFriends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
      users: [],
      seemore: false,
      toggleSkeleton: false,
      loading: false,
    };
  }

  getSuggestedFriends = (key = '') => {
    getSuggestions({ limit: 10, page: 1, key }, true).then(
      async (resp) => {
        const usersrec = [];
        for (let index = 0; index <= 5; index++) {
          usersrec.push(resp.message[index]);
        }
        this.setState({ users: usersrec, toggleSkeleton: true }, () => {
          this.checkMore(1, key);
        });
      },
      (error) => {}
    );
  };

  checkMore = (i, key = '') => {
    getSuggestions({ limit: 6, page: i + 1, key }, true).then(
      async (resp) => {
        if (resp.message.length > 0) {
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

  search = (val) => {
    if (val.length > 1) {
      this.getSuggestedFriends(val);
    } else if (val == '') {
      this.getSuggestedFriends();
    }
  };

  componentDidMount() {
    this.getSuggestedFriends();
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    friendRequest((request) => {
      this.getSuggestedFriends();
    });
  }

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

  render() {
    let userslist = [];
    if (this.props.friendrequest) {
      userslist =
        this.props.friendrequest.length > 0
          ? this.props.friendrequest
          : this.state.users;
    } else {
      userslist = this.state.users;
    }

    return (
      <div className="widget cardBody myfriends friendsWidget">
        <div className="container">
          <div className="row">
            <ul className="list-group w-100">
              {this.state.search ? (
                <li className="list-group-item d-flex justify-content-between align-items-center widgetTitle">
                  <form className="w-100">
                    <div className="input-group search-group">
                      <DebouncedInput
                        type="text"
                        className="form-control"
                        autoFocus
                        placeholder="Search"
                        id="friendSearch"
                        onChange={this.search}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-secondary search-btn"
                          type="button"
                          onClick={() => this.setState({ search: false })}
                        >
                          <i className="fa fa-times" />
                        </button>
                      </div>
                    </div>
                  </form>
                </li>
              ) : (
                <li className="widgetTitle">
                  <i className="fa fa-users" /> <span>Make New Friendfs</span>
                </li>
              )}
            </ul>
            {userslist.length === 0 && this.state.toggleSkeleton && (
              <p className="noDataFound">No People Found</p>
            )}
            {userslist.length > 0 &&
              userslist.map((user, i) => (
                <UserRow
                  user={user}
                  i={i}
                  addFriend={this.addFriend}
                  cancelRequest={this.cancelRequest}
                  accept={this.accept}
                  key={i}
                />
              ))}

            {!this.state.toggleSkeleton && (
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
            {this.state.seemore && (
              <A href="/all/suggested" className="seemore-text">
                See More
              </A>
            )}
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
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </li>
    </ul>
  );
}

export default RecommendedFriends;
