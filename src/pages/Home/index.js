import React from 'react';
import A from '../../components/A';
import Button from '../../components/Button';
import RecommendedFriends from '../../components/Friends/RecommendedFriends';
import SocialMenu from '../../components/Menu/SocialMenu';
import CreatePost from '../../components/Post/CreatePost';
import FilteredNewsFeed from '../../components/Post/FilteredNewsFeed';
import NewsFeed from '../../components/Post/NewsFeed';
import RewardsWidget from '../../components/RewardsWidget';
import QuickBuy from '../../components/Wallet/quickBuy';
import { pic, profilePic } from '../../globalFunctions';
import { getSuggestions, getLatest } from '../../http/http-calls';

import { notificationReceived } from '../../hooks/socket';
import MobileNav from '../../components/Menu/MobileNav';

require('./styles.scss');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      filter: '',
      latestblogs: [],
      latestgigs: [],
      latestpost: {},
      friendrequest: [],
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
    if (key == 'isloader' && value == false) {
      window.scrollTo(0, 0);
    }
  };

  componentDidMount() {
    getLatest().then((resp) => {
      try {
        this.setState({
          latestblogs: resp.blogs.post,
          latestgigs: resp.gigs.post,
        });
      } catch (error) {
        console.log(error);
      }
    });
    notificationReceived((newNotification) => {
      if (newNotification.type == 'friend_request') {
        // this.setState({friendrequest:newNotification})
      }
      getSuggestions({ limit: 6, page: 1, key: '' }, true).then(
        async (resp) => {
          this.setState({ friendrequest: resp.message }, () => {});
        },
        (error) => {}
      );
    });
  }

  refreshHighlights = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.setState({
          refreshing: false,
        });
      }
    );
  };

  filterPosts = (opt) => {
    this.setState({
      latestpost: {},
      filter: opt,
    });
  };

  render() {
    return (
      <div className="feedPage">
        <div className="container my-wall-container ">
          <div className="row mt-2 mobileNavRow">
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <WalletBalanceWidget  {...this.props} current="/" /> */}
              <SocialMenu {...this.props} current="/" />
              <RecommendedFriends
                {...this.props}
                friendrequest={this.state.friendrequest}
              />
            </div>
            <div className="col-sm empty-container-with-out-border center-column mobileProfile">
              <MobileNav />
              <div className="centerWrapper">
                <div className="mb-4 container p-0">
                  <CreatePost setState={this.setStateFunc} {...this.props} />
                </div>

                <div className="highlights mb-4">
                  <div className="highlight-body d-flex align-items-start justify-content-center w-100">
                    <div className="highlight-left">
                      <h3 className="title">Blogs</h3>
                      {this.state.latestblogs.length === 0 && (
                        <p className="no-found">No Data Found</p>
                      )}
                      <div className="highlight-col">
                        {/* <div className="highlight-item">
                          <div className="thumb" style={{backgroundImage: `url(https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/photo-1531564701487-f238224b7c_1200x768.jpeg)`}}></div>
                          <div className="highlight-desc">
                            <p className="highlight-title">This is a title</p>
                          </div>
                        </div>
                        <div className="highlight-item">
                          <div className="thumb" style={{backgroundImage: `url(https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/photo-1531564701487-f238224b7c_1200x768.jpeg)`}}></div>
                          <div className="highlight-desc">
                            <p className="highlight-title">This is a title</p>
                          </div>
                        </div> */}

                        {this.state.latestblogs.map((post, i) => (
                          <div className="highlight-item" key={i}>
                            <A href={`/blog/${post.slug}`}>
                              <div
                                className="thumb"
                                style={{
                                  backgroundImage: `url(${pic(
                                    post.contents[0] == undefined
                                      ? ''
                                      : post.contents[0].content_url
                                  )})`,
                                }}
                              />
                            </A>
                            <div className="highlight-desc">
                              <A href={`/blogs/${post.categoryId}`}>
                                <p className="highlight-category">
                                  {post.category}
                                </p>
                              </A>
                              <A href={`/blog/${post.slug}`}>
                                <p className="highlight-title">
                                  {post.subject}
                                </p>
                              </A>
                              <div className="highlight-meta">
                                <div>
                                  <strong>{post.clapsCount}</strong> Claps
                                </div>
                                {post.price == 0 ? (
                                  <div className="highlight-price">
                                    <strong>Free</strong>
                                  </div>
                                ) : (
                                  <div className="highlight-price">
                                    {post.preferedCurrency}{' '}
                                    <strong>{post.price}</strong>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <A href="/blogs/all">
                        <Button
                          variant="secondaryBtn"
                          className="pull-right mt15 "
                        >
                          View All
                        </Button>
                      </A>
                    </div>
                    <div className="p-2" />
                    <div className="highlight-right">
                      <h3 className="title">Passionomy</h3>
                      {this.state.latestgigs.length === 0 && (
                        <p className="no-found">No Data Found</p>
                      )}
                      <div className="highlight-row">
                        {this.state.latestgigs.map((post, i) => (
                          <div className="highlight-item" key={i}>
                            <A href={`/passionomy/gig/${post.slug}`}>
                              <div
                                className="thumb"
                                style={{
                                  backgroundImage: `url(${pic(
                                    post.banner == undefined ? '' : post.banner
                                  )})`,
                                }}
                              />
                            </A>

                            <A
                              href={`/u/${post.userid}`}
                              className="highlight-userinfo"
                            >
                              <div
                                className="highlight-profile-pic"
                                style={{
                                  backgroundImage: `url(${profilePic(
                                    post.userinfo.avatar,
                                    post.userinfo.name
                                  )})`,
                                }}
                              />
                              <div className="profile-name">
                                {post.userinfo.name}
                              </div>
                            </A>

                            <A href={`/passionomy/gig/${post.slug}`}>
                              <p className="highlight-title">{post.subject}</p>
                            </A>
                            <div className="highlight-meta justify-center">
                              <div className="price">
                                {' '}
                                {post.preferedCurrency} {post.standardPrice}
                              </div>
                              {/* <A href={"/passionomy/gig/"+post.slug}><Button  className="w-100 mt-1">View</Button></A> */}
                            </div>
                          </div>
                        ))}
                      </div>
                      <A href="/passionomy">
                        <Button
                          variant="secondaryBtn"
                          className="mt15 pull-right "
                        >
                          View All
                        </Button>
                      </A>
                    </div>
                  </div>
                </div>

                <div className="container p-0">
                  <h3 className="title w-100 scard">News Feed</h3>
                </div>

                {this.state.filter == '' ? (
                  <NewsFeed
                    setState={this.setStateFunc}
                    latestpost={this.state.latestpost}
                    {...this.props}
                    history={this.props.history}
                    page=""
                  />
                ) : (
                  <FilteredNewsFeed
                    setState={this.setStateFunc}
                    latestpost={this.state.latestpost}
                    {...this.props}
                    filter={this.state.filter}
                    history={this.props.history}
                  />
                )}

                <div className="mobile-view">
                  {/* <RecommendedFriends {...this.props} friendrequest={this.state.friendrequest} /> */}
                  <QuickBuy />
                </div>
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}

            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
              <QuickBuy />
              {/* <PopularArticles /> */}
              {/* <button onClick={this.testJob}> test</button> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
