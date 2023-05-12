import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ContentLoader from 'react-content-loader';
import {
  getPosts,
  likeComment,
  replyComment,
  likePost,
  postComment,
  getComments,
} from '../../http/http-calls';
import Post from './Post';
import Loading from '../Loading/Loading';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
      posts: [],
      page: 1,
      limit: 5,
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
  }

  componentDidUpdate(prevProps) {
    if (prevProps.latestpost._id != this.props.latestpost._id) {
      const { latestpost } = this.props;
      const postObj = this.state.posts;

      const isExist = postObj.find((item) => item._id == latestpost._id);
      if (!(isExist && isExist._id)) {
        postObj.unshift(latestpost);
        this.setState({ posts: [] }, () => {
          this.setState({ posts: postObj });
        });
      }

      // let isExistRe = postObj.find(item => item.removed == 1)
      // if (!(isExistRe && isExistRe._id)) {
      //     postObj.unshift(isExistRe);
      //     this.setState({ posts: [] }, () => {
      //         this.setState({ posts: postObj });
      //     });
      // }
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
    const userDetails = JSON.parse(localStorage.currentUser);
    getPosts(
      {
        userid: userDetails._id,
        limit: this.state.limit,
        page: this.state.page,
        mine: this.props.mine,
      },
      true
    ).then(
      async (resp) => {
        let { post } = resp;
        const update_post = [];
        if (this.state.posts != undefined && this.state.posts.length > 0) {
          post.map((item) => {
            const post_state = this.state.posts[0];
            if (post_state != undefined) {
              if (item._id != post_state._id) {
                update_post.push(item);
              }
            }
          });
          post = update_post;
        } else {
          // post = post; // no logic - mani
        }
        this.setState({
          posts: [...this.state.posts, ...post],
          hasMore: !!(post && post.length > 0),
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

  handleCallbackLikeOrShare = (data) => {
    if (
      data.type &&
      (data.type === 'post_like' || data.type === 'post_share')
    ) {
      this.getPaginatePost();
    }
  };

  loadFunc = () => {
    if (!this.state.loading) {
      this.setState({ loading: true });
      this.setState(
        (prevState) => ({
          ...prevState,
          page: prevState.page + 1,
          loading: true,
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

  refreshHighlights = () => {
    this.props.refreshHighlights();
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
    <div className="post">
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

  updatePost = (key, value) => {
    const temp = [...this.state.posts];
    const updatedpost = temp.findIndex((x) => x._id == key);
    temp[updatedpost] = value;
    // temp[key] = value;
    const posts = temp;
    posts.map((items) => {
      if (this.props.filter == '' && items._id == value._id) {
        posts.splice(items);
      }
    });
    this.setState({ modal: false, posts });
    if (
      this.props.history != undefined &&
      this.props.history.location.pathname != '/home'
    ) {
      // if(this.props.history.location.pathname == "/profile" || this.props.history.location.pathname == "/profile/feed/saved"){
      let url = '';
      if (this.props.filter == '') {
        url = '/profile/feed/all';
      } else if (this.props.filter == 'saved') {
        url = '/profile/feed/saved';
      } else {
        url = '/profile/feed/hidden';
      }
      window.location.href = url;
      // }
    }
  };

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { post, showComments, commentText } = this.state;

    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={this.loadFunc}
          hasMore={this.state.hasMore}
        >
          {this.state.postLoaded &&
            this.state.posts.map((post, i) => (
              <Post
                parentCallback={this.handleCallbackLikeOrShare}
                post={post}
                posts={this.state.posts}
                setProp={this.setStateFunc}
                filter=""
                refreshHighlights={this.refreshHighlights}
                commentLike={this.commentLike}
                commentReply={this.commentReply}
                currentUser={this.props.currentUser}
                setState={this.setStateFunc}
                updatePost={this.updatePost}
                history={this.props.history}
                key={i}
              />
            ))}
        </InfiniteScroll>
        {this.state.loading && <Loading />}
        {this.state.posts.length === 0 && this.state.postLoaded && (
          <div className="post">
            <p className="post-inner no-found">No Posts Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default Posts;
