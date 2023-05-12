import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ContentLoader from 'react-content-loader';
import {
  likeComment,
  replyComment,
  likePost,
  postComment,
  getComments,
} from '../../http/http-calls';
import { getFilteredBlogPosts } from '../../http/blog-calls';
import BlogPost from './BlogPost';
import { getAllPairs } from '../../http/wallet-calls';
import walletCheck from '../../hooks/walletCheck';

class FilteredBlogPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
      filters: props.filters,
      filter: props.filter,
      from: props.from,
      posts: [],
      page: 1,
      limit: 5,
      coins: [],
      coinsLoaded: false,
      hasMore: true,
      postLoaded: false,
      showSkeleton: false,
      showComments: false,
      commentText: '',
    };
    this.commentLike = this.commentLike.bind(this);
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPaginatePost = this.getPaginatePost.bind(this);
  }

  componentDidMount() {
    this.getPaginatePost();
    this.checkWallet();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter != prevProps.filter) {
      this.setState(
        {
          showSkeleton: false,
        },
        () => {
          this.setState({ posts: [], page: 1 });
          this.getPaginatePost();
          this.checkWallet();
        }
      );
    }
    if (
      this.props.filters &&
      prevProps.filters &&
      ((prevProps.filters.isFromFreePaid &&
        this.props.filters.isFromFreePaid &&
        this.props.filters.isFromFreePaid !=
          prevProps.filters.isFromFreePaid) ||
        (prevProps.filters.category &&
          this.props.filters.category &&
          this.props.filters.category != prevProps.filters.category) ||
        (prevProps.filters.freePaid &&
          this.props.filters.freePaid &&
          this.props.filters.freePaid != prevProps.filters.freePaid) ||
        (prevProps.filters.key &&
          this.props.filters.key &&
          this.props.filters.key != prevProps.filters.key) ||
        (prevProps.filters.priceFrom &&
          this.props.filters.priceFrom &&
          this.props.filters.priceFrom != prevProps.filters.priceFrom) ||
        (prevProps.filters.priceTo &&
          this.props.filters.priceTo &&
          this.props.filters.priceTo != prevProps.filters.priceTo))
    ) {
      this.setState(
        {
          showSkeleton: false,
        },
        () => {
          this.setState({ posts: [], page: 1 });
          this.getPaginatePost();
          this.checkWallet();
        }
      );
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps() {
    if (this.props.latestpost && this.props.latestpost.userid) {
      const { latestpost } = this.props;
      const postObj = this.state.posts;

      const isExist = postObj.find((item) => item._id == latestpost._id);
      if (!(isExist && isExist._id)) {
        postObj.unshift(latestpost);
        this.setState({ posts: [] }, () => {
          this.setState({ posts: postObj });
        });
      }
    }
  }

  checkWallet = () => {
    walletCheck().then(
      (resp) => {
        this.getCoins();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCoins = () => {
    const coins = localStorage.getItem('allPairs');
    if (coins != null) {
      this.setState(
        {
          coins: JSON.parse(coins),
        },
        () => {
          this.setState({
            coinsLoaded: true,
          });
        }
      );
    }
    getAllPairs().then(
      (resp) => {
        localStorage.setItem('allPairs', JSON.stringify(resp.data));
        this.setState(
          {
            coins: resp.data,
          },
          () => {
            this.setState({
              coinsLoaded: true,
            });
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getPaginatePost = () => {
    getFilteredBlogPosts(
      {
        userid: this.props.currentUser._id,
        limit: this.state.limit,
        page: this.state.page,
        filter: this.props.filter,
        mine: this.props.mine,
        ...this.props.filters,
      },
      true
    ).then(
      async (resp) => {
        this.setState({
          posts: [...this.state.posts, ...resp.post],
          hasMore: !!(resp.post && resp.post.length > 0),
          postLoaded: true,
          showSkeleton: false,
        });
      },
      (error) => {
        this.setState({ postLoaded: true, showSkeleton: false });
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
          showSkeleton: true,
        }),
        () => {
          this.getPaginatePost();
        }
      );
    }
  };

  commentLike = (postid, commentId) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    likeComment({ postid, commentId }, true).then(
      async (resp) => {
        if (resp.message == 'Like') {
          // this.postActivityCount('likesCount');
        } else if (resp.message == 'Dislike') {
          // this.postActivityCount('likesCount', 'sub');
        }
      },
      (error) => {}
    );
  };

  commentReply = (postid, commentId, comment, commentIndex, callBack) => {
    replyComment({ postid, commentId, comment }, true).then(
      async (resp) => {
        callBack(resp.comment, commentIndex);
      },
      (error) => {}
    );
  };

  refreshHighlights = () => {
    this.props.refreshHighlights();
  };

  likePost = (postid, liked) => {
    likePost({ postid }, true).then(
      async (resp) => {},
      (error) => {}
    );
  };

  postCmt = (postid) => {
    const obj = { postid, comment: this.state.commentText };
    postComment(obj).then(
      async (resp) => {},
      (error) => {}
    );
  };

  showComments = (postid) => {
    getComments({ postid }, true).then(
      async (resp) => {
        this.setState({ showComments: true });
      },
      (error) => {}
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

  getSkeletonContent = (i) => (
    <div className="row cardBody post">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100 m-0">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <ContentLoader
                speed={2}
                width={610}
                height={350}
                viewBox="0 0 610 350"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                <circle cx="20" cy="20" r="20" />
                <rect x="0" y="88" rx="3" ry="3" width="900" height="1000" />
              </ContentLoader>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  render() {
    const { post, showComments, commentText } = this.state;

    return (
      <div>
        {this.state.from && this.state.from === 'my_profile' ? (
          this.state.posts.map((post, i) => (
            <BlogPost
              allpost={this.state.posts}
              coins={this.state.coins}
              refreshHighlights={this.refreshHighlights}
              post={post}
              filter={this.props.filter}
              commentLike={this.commentLike}
              commentReply={this.commentReply}
              currentUser={this.props.currentUser}
              key={i}
            />
          ))
        ) : (
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.loadFunc}
            hasMore={this.state.hasMore}
          >
            {this.state.postLoaded &&
              this.state.posts.map((post, i) => (
                <BlogPost
                  allpost={this.state.posts}
                  coins={this.state.coins}
                  refreshHighlights={this.refreshHighlights}
                  post={post}
                  filter={this.props.filter}
                  commentLike={this.commentLike}
                  commentReply={this.commentReply}
                  currentUser={this.props.currentUser}
                  key={i}
                />
              ))}
          </InfiniteScroll>
        )}
        {!this.state.postLoaded &&
          (this.state.showSkeleton || !this.state.coinsLoaded) && (
            <div>
              {Array(5)
                .fill()
                .map((item, index) => this.getSkeletonContent(index))}
            </div>
          )}
        {this.state.posts.length === 0 && this.state.postLoaded && (
          <div className="post">
            <p className="post-inner no-found">No Blogs Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default FilteredBlogPosts;
