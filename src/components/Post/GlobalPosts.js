import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ContentLoader from 'react-content-loader';
import {
  getGlobalPosts,
  likeComment,
  replyComment,
  likePost,
  postComment,
  getComments,
} from '../../http/http-calls';
import Post from './Post';
import Loading from '../Loading/Loading';

class GlobalPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      posts: [],
      page: 1,
      limit: 5,
      hasMore: true,
      postLoaded: false,
      loading: false,
      showComments: false,
      commentText: '',
    };
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPaginatePost = this.getPaginatePost.bind(this);
  }

  componentDidMount() {
    this.getPaginatePost();
  }

  refreshHighlights = () => {
    this.props.refreshHighlights();
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.query != this.props.query ||
      prevProps.loadMore != this.props.loadMore
    ) {
      this.setState(
        {
          page: 1,
          limit: 5,
          posts: [],
        },
        () => {
          this.getPaginatePost();
        }
      );
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps() {
    if (this.props.latestPost && this.props.latestPost.userid) {
      const { latestPost } = this.props;
      const postObj = this.state.posts;

      const isExist = postObj.find((item) => item._id == latestPost._id);
      if (!(isExist && isExist._id)) {
        postObj.unshift(latestPost);
        this.setState({ posts: [] }, () => {
          this.setState({ posts: postObj });
        });
      }
    }
  }

  getPaginatePost = () => {
    if (
      (this.props.search && this.props.query != '') ||
      !this.props.search ||
      typeof this.props.search === 'undefined'
    ) {
      this.setState({ loading: true });
      getGlobalPosts(
        {
          limit: this.state.limit,
          page: this.state.page,
          query: this.props.query,
        },
        true
      ).then(
        async (resp) => {
          this.setState({
            posts: [...this.state.posts, ...resp.post],
            loading: false,
            hasMore: !!(resp.post && resp.post.length > 0),
            postLoaded: true,
          });
        },
        (error) => {
          this.setState({ loading: false });
        }
      );
    }
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

  commentLike = (commentId) => {
    // this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    likeComment({ commentId }, true).then(
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

  commentReply = (commentId, comment, commentIndex, callBack) => {
    replyComment({ commentId, comment }, true).then(
      async (resp) => {
        callBack(resp.comment, commentIndex);
      },
      (error) => {}
    );
  };

  likePost = (postId, liked) => {
    likePost({ postid: postId }, true).then(
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

  updatePost = (key, value) => {
    const temp = [...this.state.posts];
    const updatedpost = temp.findIndex((x) => x._id == key);
    temp[updatedpost] = value;
    // temp[key] = value;
    this.setState({ modal: false, posts: temp });
  };

  getSkeletonContent = () => (
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
                {...this.props}
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
        {this.props.loadMore ? (
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.loadFunc}
            hasMore={this.state.hasMore}
          >
            {!this.postLoaded &&
              this.state.posts.map((post, i) => (
                <Post
                  parentCallback={this.handleCallbackLikeOrShare}
                  refreshHighlights={this.refreshHighlights}
                  post={post}
                  commentLike={this.commentLike}
                  commentReply={this.commentReply}
                  currentUser={this.props.currentUser}
                  updatePost={this.updatePost}
                  key={i}
                />
              ))}
          </InfiniteScroll>
        ) : (
          !this.postLoaded &&
          this.state.posts.map((post, i) => (
            <Post
              parentCallback={this.handleCallbackLikeOrShare}
              refreshHighlights={this.refreshHighlights}
              post={post}
              commentLike={this.commentLike}
              commentReply={this.commentReply}
              currentUser={this.props.currentUser}
              updatePost={this.updatePost}
              key={i}
            />
          ))
        )}
        {(this.state.posts.length === 0 || this.state.showSkeleton) &&
          !this.state.postLoaded && <Loading />}
        {this.state.posts.length === 0 && this.state.postLoaded && (
          <div className="post">
            <p className="post-inner no-found">No Posts Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default GlobalPosts;
