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
import { getCategoryBlogs } from '../../http/blog-calls';
import BlogPost from './BlogPost';
import { getAllPairs } from '../../http/wallet-calls';
import walletCheck from '../../hooks/walletCheck';
import Loading from '../Loading/Loading';

class CategoryBlogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
      posts: [],
      category: props.category,
      coins: [],
      coinsLoaded: false,
      page: 1,
      limit: props.limit == null ? 5 : props.limit,
      hasMore: true,
      postLoaded: false,
      loading: false,
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
    // this.checkWallet();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.category != prevProps.category ||
      prevProps.loadMore != this.props.loadMore
    ) {
      this.setState(
        {
          category: this.props.category,
          posts: [],
        },
        () => {
          this.getPaginatePost();
        }
      );
    }
  }

  // componentWillReceiveProps() {
  //     if (this.props.latestpost && this.props.latestpost.userid) {

  //         const latestpost = this.props.latestpost;
  //         const postObj = this.state.posts;

  //         let isExist = postObj.find(item => item._id == latestpost._id)
  //         if (!(isExist && isExist._id)) {
  //             postObj.unshift(latestpost);
  //             this.setState({ posts: [] }, () => {
  //                 this.setState({ posts: postObj });
  //             });
  //         }
  //     }
  // }
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
    this.setState({ loading: true });
    // if((typeof this.props.currentUser == undefined || this.props.currentUser == null) || (typeof this.props.match != undefined && this.props.match.params.id != null && typeof this.props.match.params.id != undefined && this.props.match.params.id != '' && this.props.match.params.id != this.props.currentUser._id)){
    //     getProfilePosts({ userid: this.props.match.params.id, limit: this.state.limit, page: this.state.page})
    //     .then(async resp => {
    //         this.setState({
    //             posts: [...this.state.posts, ...resp.post],
    //             hasMore: resp.post && resp.post.length > 0 ? true : false,
    //             postLoaded: true, showSkeleton: false
    //         });
    //     }, error => {

    //         this.setState({ postLoaded: true, showSkeleton: false });
    //     });
    //   }else{
    const userDetails = this.props.currentUser;
    getCategoryBlogs(
      {
        userid: userDetails == undefined ? 0 : userDetails._id,
        limit: this.state.limit,
        page: this.state.page,
        category: this.state.category,
      },
      true
    ).then(
      async (resp) => {
        this.setState({
          posts: [...this.state.posts, ...resp.post],
          hasMore: !!(resp.post && resp.post.length > 0),
          postLoaded: true,
          loading: false,
        });
      },
      (error) => {
        this.setState({ postLoaded: true, loading: false });
      }
    );
    // }
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

  refreshHighlights = () => {};

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
        {this.props.loadMore == undefined || this.props.loadMore ? (
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.loadFunc}
            hasMore={this.state.hasMore}
          >
            {this.state.postLoaded &&
              this.state.posts.map((post, i) => (
                <BlogPost
                  coins={this.state.coins}
                  post={post}
                  filter=""
                  refreshHighlights={this.refreshHighlights}
                  commentLike={this.commentLike}
                  commentReply={this.commentReply}
                  currentUser={this.props.currentUser}
                  key={i}
                />
              ))}
          </InfiniteScroll>
        ) : (
          this.state.postLoaded &&
          this.state.posts.map((post, i) => (
            <BlogPost
              coins={this.state.coins}
              post={post}
              filter=""
              refreshHighlights={this.refreshHighlights}
              commentLike={this.commentLike}
              commentReply={this.commentReply}
              currentUser={this.props.currentUser}
              key={i}
            />
          ))
        )}
        {this.state.loading && <Loading />}
        {this.state.posts.length === 0 && this.state.postLoaded && (
          <div className="post">
            <p className="post-inner no-found">No Blogs Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default CategoryBlogs;
