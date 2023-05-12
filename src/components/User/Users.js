import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { getGlobalUsers } from '../../http/http-calls';
import A from '../A';

import Button from '../Button';
import { profilePic } from '../../globalFunctions';
import Loading from '../Loading/Loading';

class SearchUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: props.limit == null ? 10 : props.limit,
      users: [],
      hasMore: true,
      postLoaded: false,
      showSkeleton: false,
    };
  }

  componentDidMount() {
    this.setState(
      {
        page: 1,
        limit: this.props.limit == null ? 10 : this.props.limit,
        users: [],
      },
      () => {
        this.getUsers();
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.query != this.props.query ||
      prevProps.loadMore != this.props.loadMore
    ) {
      this.setState(
        {
          page: 1,
          limit: this.props.limit == null ? 10 : this.props.limit,
          users: [],
        },
        () => {
          this.getUsers();
        }
      );
    }
  }

  getUsers = () => {
    if (
      (this.props.search && this.props.query != '') ||
      !this.props.search ||
      typeof this.props.search === 'undefined'
    ) {
      getGlobalUsers({
        limit: this.state.limit,
        page: this.state.page,
        query: this.props.query,
      }).then(
        async (resp) => {
          // this.setState({
          //     users: resp
          // });
          if (resp.length > 0) {
            this.setState({
              users: [...resp],
              showSkeleton: false,
              hasMore: !!(resp && resp.length > 0),
              postLoaded: true,
            });
          } else {
            this.setState({
              users: [...this.state.users],
              showSkeleton: false,
              hasMore: !!(resp && resp.length > 0),
              postLoaded: true,
            });
          }
        },
        (error) => {}
      );
    }
  };

  omponentWillReceiveProps() {
    if (this.props.latestPost && this.props.latestPost._id) {
      const { latestPost } = this.props;
      const postObj = this.state.users;

      const isExist = postObj.find((item) => item._id == latestPost._id);
      if (!(isExist && isExist._id)) {
        postObj.unshift(latestPost);
        this.setState({ users: [] }, () => {
          this.setState({ users: postObj });
        });
      }
    }
  }

  loadFunc = () => {
    if (!this.state.showSkeleton) {
      this.setState({ showSkeleton: true });
      this.setState(
        (prevState) => ({
          ...prevState,
          page: prevState.page + 1,
          showSkeleton: true,
        }),
        () => {
          this.getUsers();
        }
      );
    }
  };

  render() {
    const { users } = this.state;

    return (
      <div>
        {this.props.loadMore ? (
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.loadFunc}
            hasMore={this.state.hasMore}
          >
            {!this.postLoaded && this.state.users.length > 0 && (
              <div className="container">
                <div className="row">
                  {this.state.users.map((user, index) => (
                    <ul className="list-group w-100 remove-border" key={index}>
                      <li className="list-group-item ">
                        <div className="media w-100 d-flex align-items-center justify-content-between px-2">
                          <div className="d-flex align-items-center">
                            <div className="media-left me-2">
                              <A href={`/u/${user._id}`}>
                                <img
                                  className="media-object pic circle"
                                  src={profilePic(user.avatar, user.name)}
                                  alt="..."
                                />
                              </A>
                            </div>
                            <div className="media-body">
                              <A href={`/u/${user._id}`}>
                                <p className="media-heading">
                                  {user.name == undefined || user.name == ''
                                    ? user.username
                                    : user.name}
                                </p>
                              </A>
                              {/* <p className="media-subheading">{user.mutualFriends} Mutual Friends</p> */}
                            </div>
                          </div>
                          <div className="media-right ">
                            <A href={`/u/${user._id}`}>
                              <Button variant="secondaryBtn" size="compact">
                                View
                              </Button>
                            </A>
                          </div>
                        </div>
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            )}
          </InfiniteScroll>
        ) : (
          <div className="container">
            <div className="row">
              {this.state.users.map((user, index) => (
                <ul className="list-group w-100 remove-border" key={index}>
                  <li className="list-group-item ">
                    <div className="media w-100 d-flex align-items-center justify-content-between px-2 p-1">
                      <div className="d-flex align-items-center">
                        <div className="media-left me-2">
                          <A href={`/u/${user._id}`}>
                            <img
                              className="media-object pic circle"
                              src={profilePic(user.avatar, user.name)}
                              alt="..."
                            />
                          </A>
                        </div>
                        <div className="media-body">
                          <A href={`/u/${user._id}`}>
                            <p className="media-heading">
                              {user.name == undefined || user.name == ''
                                ? user.username
                                : user.name}
                            </p>
                          </A>
                          {/* <p className="media-subheading">{user.mutualFriends} Mutual Friends</p> */}
                        </div>
                      </div>
                      <div className="media-right ">
                        <A href={`/u/${user._id}`}>
                          <Button variant="secondaryBtn" size="compact">
                            View
                          </Button>
                        </A>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        )}
        {(this.state.users.length === 0 || this.state.showSkeleton) &&
          !this.state.postLoaded && (
            <div>
              <Loading />
            </div>
          )}
        {this.state.users.length === 0 && this.state.postLoaded && (
          <p className="no-found">No Users Found</p>
        )}
      </div>
    );
  }
}

export default SearchUsers;
