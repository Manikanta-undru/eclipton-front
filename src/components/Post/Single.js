import React from 'react';
import ContentLoader from 'react-content-loader';
import {
  likeComment,
  replyComment,
  likePost,
  postComment,
  getComments,
} from '../../http/http-calls';
import { getSinglePost } from '../../http/post-calls';
import Post from './Post';
import Spinner from '../Spinner';

class Single extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      page: 1,
      limit: 5,
      hasMore: true,
      postLoaded: false,
      showSkeleton: false,
      showComments: false,
      commentText: '',
      removed: 0,
    };
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPost = this.getPost.bind(this);
  }

  componentDidMount() {
    this.getPost();
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.match !== 'undefined' &&
      typeof prevProps.match !== 'undefined' &&
      prevProps.match.params.postid !== this.props.match.params.postid
    ) {
      this.getPost();
    }
  }

  getPost = () => {
    getSinglePost({
      postid: this.props.match.params.postid,
      userid:
        this.props.currentUser && this.props.currentUser._id
          ? this.props.currentUser._id
          : 0,
    }).then(
      async (resp) => {
        this.setState({
          posts: resp.post,
          removed: resp.post.length == 0 ? 1 : 0,
          showSkeleton: false,
          postLoaded: true,
        });
      },
      (error) => {
        this.setState({ showSkeleton: false });
      }
    );
  };

  handleCallbackLikeOrShare = (data) => {
    if (
      data.type &&
      (data.type === 'post_like' || data.type === 'post_share')
    ) {
      this.getPost();
    }
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
    const { posts, showComments, commentText } = this.state;
    return (
      <div>
        {posts.length == 0 && this.state.removed == 0 ? (
          <div className="text-center">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          <Post
            parentCallback={this.handleCallbackLikeOrShare}
            post={posts[0]}
            commentLike={this.commentLike}
            commentReply={this.commentReply}
            key={0}
            currentUser={this.props.currentUser}
            single
            updatePost={this.updatePost}
            history={this.props.history}
          />
        ) : (
          this.state.removed == 1 &&
          posts.length == 0 && (
            <div className="container p-0">
              <div className="post-content">Post Content are removed</div>
            </div>
          )
        )}
        {posts.length > 0 &&
          this.state.showSkeleton &&
          !this.state.postLoaded && (
            <div>
              {Array(5)
                .fill()
                .map((item, index) => this.getSkeletonContent())}
            </div>
          )}
      </div>
    );
  }
}

export default Single;
