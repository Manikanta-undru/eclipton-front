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
import { getNewsFeed } from '../../http/post-calls';
import Post from './Post';
import GroupSinglePost from './GroupSinglePost';
import { getAllPairs } from '../../http/wallet-calls';
import walletCheck from '../../hooks/walletCheck';
import Loading from '../Loading/Loading';

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
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
      initialLoad: false,
      isloader: false,
    };

    this.commentLike = this.commentLike.bind(this);
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPaginatePost = this.getPaginatePost.bind(this);
  }

  componentDidMount() {
    console.log('tt');
    this.getPaginatePost();
    // this.checkWallet();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.latestpost._id != this.props.latestpost._id) {
      const { latestpost } = this.props;
      const postObj = this.state.posts;

      const isExist = postObj.find(
        (item) => item != null && item._id == latestpost._id
      );
      if (!(isExist && isExist._id)) {
        postObj.unshift(latestpost);
        this.setState({ posts: [] }, () => {
          this.setState({ posts: postObj });
        });
      }
    }
    if (prevState.posts != this.state.posts) {
      this.setState({ posts: this.state.posts });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps() {
    if (this.props.latestpost && this.props.latestpost.userid) {
      const { latestpost } = this.props;
      const postObj = this.state.posts;

      const isExist = postObj.find(
        (item) => item != null && item._id == latestpost._id
      );
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
      (err) => {}
    );
  };

  getCoins = () => {
    // var coins = localStorage.getItem("allPairs");
    // if(coins != null){
    //     this.setState({
    //         coins: JSON.parse(coins)
    //     }, () => {
    //         this.setState({
    //             coinsLoaded:true
    //         })
    //     })
    // }
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
      (err) => {}
    );
  };

  getPaginatePost = () => {
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

    // if(this.props.page == "1"){
    //     getNewsFeed({ userid: this.props.currentUser._id, limit: 1, page: 1 }, true)
    //     .then(async resp => {
    //         var arr1 = resp.posts.post;
    //         if(arr1 !== undefined && arr1.length > 0){
    //             var post_share = [...arr1, ...this.state.posts]
    //             console.log(post_share,"test")
    //             this.setState({
    //                 posts: [...arr1, ...this.state.posts],
    //             });
    //         }
    //     });

    // }else{

    // }

    getNewsFeed(
      {
        userid: this.props.currentUser._id,
        limit: this.state.limit,
        page: this.props.page == '' ? this.state.page : '1',
      },
      true
    ).then(
      async (resp) => {
        const arr1 = resp.posts.post;
        // console.log(arr1,"arr1")
        // var arr2 = resp.blogs.post;
        // var arr = arr1.concat(arr2);
        // var sorted = arr.sort(function(a, b){
        //     return b.createdAt - a.createdAt;
        // });

        if (arr1 !== undefined && arr1.length > 0) {
          if (this.props.page == 1) {
            /* empty */
          } else {
            this.setState({
              posts: [...this.state.posts, ...arr1],
              hasMore: !!(resp.posts.post && resp.posts.post.length > 0),
              postLoaded: true,
              showSkeleton: false,
            });
          }
        } else {
          this.setState({
            posts: this.state.posts,
            hasMore: !!(resp.posts.post && resp.posts.post.length > 0),
            postLoaded: true,
            showSkeleton: false,
          });
        }
        // if(arr1.length > 0){
        //     this.setState({})
        // }
      },
      (error) => {
        this.setState({
          postLoaded: false,
          showSkeleton: true,
          hasMore: false,
        });
      }
    );

    // }
  };

  loadFunc = () => {
    if (!this.state.showSkeleton && this.state.hasMore) {
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
    } else {
      this.setState({ showSkeleton: true, postLoaded: true, hasMore: false });
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

  updatePost = (key, value) => {
    const temp = [...this.state.posts];
    const updatedpost = temp.findIndex((x) => x._id == key);
    temp[updatedpost] = value;
    // temp[key] = value;
    this.setState({ modal: false, posts: temp });
  };

  handleCallbackLikeOrShare = (data) => {
    console.log(data.type, 'dataType');
    if (
      data.type &&
      (data.type === 'post_like' || data.type === 'post_share')
    ) {
      this.setState({ page: 1 });
      // this.getPaginatePost();
      getNewsFeed(
        { userid: this.props.currentUser._id, limit: 5, page: 1 },
        true
      ).then(async (resp) => {
        const arr1 = resp.posts.post;
        if (arr1 !== undefined && arr1.length > 0) {
          const post_share = [...arr1, ...this.state.posts];
          console.log(post_share, 'test');
          this.setState({
            posts: [...arr1, ...this.state.posts],
          });
        }
      });
    }
  };

  getSkeletonContent = (i) => (
    <div className=" post">
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

  setStateFunc = (key, value) => {
    // console.log(key,value,"testttestt")
    // if(key == "issharedpost"){
    //     console.log(key,value);
    //     // this.getPaginatePost();
    //     this.props.setState("isloader",true);
    //     this.setState({isloader:false});
    // }
    // this.setState({ [key]: value });
  };

  renderdata = () => (
    <div>
      <InfiniteScroll
        pageStart={0}
        initialLoad={this.state.initialLoad}
        loadMore={this.loadFunc}
        hasMore={this.state.hasMore}
      >
        {this.state.postLoaded &&
          this.state.posts.map(
            (post, i) =>
              post != null ? (
                post.tribes_groups_docs.posts._id != undefined ? (
                  <GroupSinglePost
                    parentCallback={this.handleCallbackLikeOrShare}
                    post={post.tribes_groups_docs.posts}
                    posts={this.state.posts}
                    setProp={this.setStateFunc}
                    filter=""
                    commentLike={this.commentLike}
                    commentReply={this.commentReply}
                    currentUser={this.props.currentUser}
                    updatePost={this.updatePost}
                    history={this.props.history}
                    isloader={this.state.isloader}
                    key={i}
                  />
                ) : (
                  <Post
                    parentCallback={this.handleCallbackLikeOrShare}
                    post={post}
                    posts={this.state.posts}
                    setProp={this.setStateFunc}
                    filter=""
                    commentLike={this.commentLike}
                    commentReply={this.commentReply}
                    currentUser={this.props.currentUser}
                    updatePost={this.updatePost}
                    history={this.props.history}
                    isloader={this.state.isloader}
                  />
                )
              ) : null

            // (post.subject == 'Eclipton' ||  post.subject == 'Eclipton') ?
            // :
            // <FeedBlog coins={this.state.coins} post={post} filter="" commentLike={this.commentLike} commentReply={this.commentReply}  currentUser={this.props.currentUser} />
          )}
      </InfiniteScroll>
      {
        // (this.state.showSkeleton) &&
        // <div>
        //     {Array(5).fill().map((item, index) => this.getSkeletonContent(index))}
        // </div>
        // <Spinner />
        <Loading />
      }
      {this.state.posts.length == 0 && this.state.postLoaded && (
        <div className="post">
          <p className="post-inner no-found">No Posts Found</p>
        </div>
      )}
    </div>
  );

  render() {
    // const { post, showComments, commentText,isloader } = this.state;
    // console.log(this.state.posts,"test")
    return <div>{this.renderdata()}</div>;
  }
}

export default NewsFeed;
