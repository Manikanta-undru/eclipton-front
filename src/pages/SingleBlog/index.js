import React from 'react';
import ContentLoader from 'react-content-loader';
import AuthorBio from '../../components/Blog/AuthorBio';
import CategoryArticles from '../../components/Blog/CategoryArticles';
import Footer from '../../components/Footer';
import BlogPostSingle from '../../components/Post/BlogPostSingle';
import { getSinglePost } from '../../http/blog-calls';
import {
  getComments,
  likeComment,
  likePost,
  postComment,
  replyComment,
} from '../../http/http-calls';
import Spinner from '../../components/Spinner';

require('./styles.scss');

class SingleBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      global: false,
      posts: [],
      page: 1,
      limit: 5,
      hasMore: true,
      postLoaded: false,
      showSkeleton: false,
      showComments: false,
      commentText: '',
    };
    this.loadFunc = this.loadFunc.bind(this);
    this.likePost = this.likePost.bind(this);
    this.getPost = this.getPost.bind(this);
  }

  componentDidMount() {
    this.getPost(this.props.match.params.postid);
    const p = this.props.location.pathname;
    if (
      p.indexOf('/blog/') != -1 &&
      (this.props.currentUser == undefined || this.props.currentUser == null)
    ) {
      this.setState({
        global: true,
      });
    } else {
      this.setState({
        global: false,
      });
      // this.logout();
    }
  }

  componentDidUpdate(prevProps) {
    try {
      if (prevProps.match.params.postid !== this.props.match.params.postid) {
        this.getPost(this.props.match.params.postid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getPost = (id) => {
    getSinglePost({
      postid: id,
      slug: id,
      userid:
        this.props.currentUser && this.props.currentUser._id
          ? this.props.currentUser._id
          : 0,
    }).then(
      async (resp) => {
        this.setState({
          posts: resp.post,
          showSkeleton: false,
          postLoaded: true,
        });
      },
      (error) => {
        this.setState({ showSkeleton: false });
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

  openChat = (r) => {
    const temp = this.state.chats;
    const foundIndex = temp.findIndex((x) => x._id == r._id);
    if (foundIndex == -1) {
      temp.push(r);
    }
    this.setState({
      chats: temp,
    });
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

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { posts, showComments, commentText } = this.state;
    return (
      // <!-- Wall container -->
      <div className="singleBlogPage">
        {/* <Header appName={this.props.appName}  openChat={this.openChat} currentUser={this.props.currentUser}   /> */}
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column" />
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column mx-auto p-0">
              {!this.postLoaded && posts.length > 0 ? (
                <>
                  <BlogPostSingle
                    path={this.props.location.pathname}
                    setProp={this.setStateFunc}
                    post={posts[0]}
                    commentLike={this.commentLike}
                    global={this.state.global}
                    commentReply={this.commentReply}
                    key={0}
                    currentUser={this.props.currentUser}
                    single
                  />
                  <div className="row">
                    <div className="col-md-6">
                      <CategoryArticles category={posts[0].category} />
                    </div>
                    <div className="col-md-6">
                      <AuthorBio {...this.props} authorid={posts[0].userid} />
                    </div>
                  </div>
                </>
              ) : (
                <Spinner />
              )}
              {this.state.showSkeleton && !this.state.postLoaded && (
                <div>
                  {Array(5)
                    .fill()
                    .map((item, index) => this.getSkeletonContent())}
                </div>
              )}
            </div>

            {posts[0] != undefined && (
              <div className="col-sm empty-container-with-out-border right-column" />
            )}
          </div>
        </div>
        <Footer
          appName={this.props.appName}
          currentUser={this.props.currentUser}
          chats={this.state.chats}
        />
      </div>
    );
  }
}

export default SingleBlog;
