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
import { getFilteredPosts } from '../../http/post-calls';
import Post from './Post';

class FilteredPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
      total_post: '',
      posts: [],
      page: 1,
      limit: 5,
      hasMore: true,
      postLoaded: false,
      showSkeleton: false,
      showComments: false,
      commentText: '',
      filter: props.filter,
      currentTab: props.currentTab,
    };
    this.commentLike = this.commentLike.bind(this);
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPaginatePost = this.getPaginatePost.bind(this);
  }

  componentDidMount() {
    // if(this.state.filter != "saved"){
    //     this.props.setState("filter",this.state.filter);
    //     this.props.setState("currentTab",1);
    //     this.props.history.push("/profile")
    //   }
    this.getPaginatePost();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter != prevProps.filter) {
      this.setState(
        {
          showSkeleton: false,
        },
        () => {
          this.setState({ posts: [] });
          this.getPaginatePost();
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

  getPaginatePost = () => {
    console.log('111');
    getFilteredPosts(
      {
        userid: this.props.currentUser._id,
        limit: this.state.limit,
        page: this.state.page,
        filter: this.props.filter,
      },
      true
    ).then(
      async (resp) => {
        let post = [];
        if (resp.data != undefined && resp.data.post !== undefined) {
          post = resp.data.post;
          this.setState({ total_post: resp.postcount });
        } else {
          post = resp.post;
        }
        let up_post = [];

        if (this.state.posts.length > 0) {
          const posts_state = this.state.posts[0];
          post.map((item) => {
            if (item._id != posts_state._id) {
              up_post.push(item);
            }
          });
        } else {
          up_post = post;
        }

        this.setState({
          posts: [...this.state.posts, ...up_post],
          hasMore: !!(post && post.length > 0),
          postLoaded: true,
          showSkeleton: false,
        });
      },
      (error) => {
        this.setState({ postLoaded: true, showSkeleton: false });
      }
    );
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
    if (!this.state.showSkeleton && this.state.total_post > 5) {
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

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
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
    let url;
    temp[updatedpost] = value;
    // temp[key] = value;
    const { posts } = this.state;
    let update_post = [];
    if (this.props.filter == 'hidden') {
      posts.map((items) => {
        if (this.props.filter == 'hidden' && items._id != value._id) {
          // posts.splice(items);
          update_post.push(items);
        }
      });
    } else {
      update_post = posts;
    }
    console.log(update_post, 'posts lll');
    this.setState({ modal: false, posts: update_post, latestpost: {} });
    if (
      this.props.history != undefined &&
      this.props.history.location.pathname != '/home'
    ) {
      // if(this.props.history.location.pathname == "/profile" || this.props.history.location.pathname == "/profile/feed/saved"){

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
                setProp={this.setStateFunc}
                filter={this.state.filter}
                currentTab={this.state.currentTab}
                refreshHighlights={this.refreshHighlights}
                allpost={this.state.posts}
                posts={this.state.posts}
                post={post}
                commentLike={this.commentLike}
                commentReply={this.commentReply}
                currentUser={this.props.currentUser}
                updatePost={this.updatePost}
                history={this.props.history}
                key={i}
              />
            ))}
        </InfiniteScroll>
        {this.state.showSkeleton && (
          <div>
            {Array(5)
              .fill()
              .map((item, index) => this.getSkeletonContent(index))}
          </div>
        )}
        {this.state.posts.length === 0 && this.state.postLoaded && (
          <div className="post">
            <p className="post-inner no-found">No Posts Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default FilteredPosts;
