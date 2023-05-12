import React from 'react';
import ContentLoader from 'react-content-loader';
import InfiniteScroll from 'react-infinite-scroller';
import { switchLoader } from '../../commonRedux';
import A from '../../components/A';
import { pic } from '../../globalFunctions';
import { connectSocket, friendRequest } from '../../hooks/socket';
import { getPopularGigs } from '../../http/gig-calls';
import {
  acceptRequest,
  cancelRequest,
  followUser,
} from '../../http/http-calls';

require('./styles.scss');

class AllPopularGigs extends React.Component {
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

  getSuggestedFriends = () => {
    getPopularGigs({ limit: this.state.limit, page: this.state.page }).then(
      (resp) => {
        this.setState(
          { users: [...this.state.users, ...resp.post], showSkeleton: false },
          () => {
            this.checkMore(1);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  checkMore = (i) => {
    getPopularGigs(
      { limit: this.state.limit, page: this.state.page + 1 },
      true
    ).then(
      async (resp) => {
        if (resp.post !== undefined && resp.post.length > 0) {
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
    if (!this.state.showSkeleton) {
      this.setState({ showSkeleton: true });
      this.setState(
        (prevState) => ({
          ...prevState,
          page: prevState.page + 1,
        }),
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
              {/* <WalletBalanceWidget  {...this.props} />
                    <SocialMenu  {...this.props} /> */}
            </div>
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="empty-container-with-border w-100 popularArticles">
                <h3 className="title border-bottom pb-2">Popular Gigs</h3>
                {this.state.users.length === 0 && this.state.toggleSkeleton && (
                  <p className="no-found">No Data Found</p>
                )}
                <InfiniteScroll
                  pageStart={0}
                  initialLoad={false}
                  loadMore={this.loadFunc}
                  hasMore={this.state.seemore}
                >
                  {this.state.users.length > 0 &&
                    this.state.users.map((e, i) =>
                      e.removed > 0 ? null : (
                        <ul className="list-group w-100" key={i}>
                          <li className="list-group-item">
                            <div className="media">
                              <div className="media-left">
                                <A href={`/blog/${e._id}`}>
                                  <div
                                    className="thumbnail"
                                    style={{
                                      backgroundImage: `url(${pic(
                                        e.contents[0].content_url
                                      )})`,
                                    }}
                                  />
                                </A>
                              </div>
                              <div className="media-body">
                                <A href={`/blog/${e._id}`}>
                                  <p className="media-heading">{e.subject}</p>
                                </A>
                              </div>
                            </div>
                          </li>
                        </ul>
                      )
                    )}
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

export default AllPopularGigs;
