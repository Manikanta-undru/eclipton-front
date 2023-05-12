import React from 'react';
import ContentLoader from 'react-content-loader';
import InfiniteScroll from 'react-infinite-scroller';
import A from '../../components/A';
import { pic } from '../../globalFunctions';
import { getAuthorBlogs } from '../../http/blog-calls';
import { getGlobalProfile } from '../../http/http-calls';

require('./styles.scss');

class AuthorWiseBlogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      author: {},
      id: null,
      limit: 20,
      users: [],
      seemore: false,
      showSkeleton: true,
    };
  }

  getAuthor = () => {
    getGlobalProfile({ id: this.state.id }, true).then(
      async (resp) => {
        this.setState({
          author: resp,
        });
      },
      (error) => {}
    );
  };

  getSuggestedFriends = () => {
    getAuthorBlogs(
      { userid: this.state.id, limit: this.state.limit, page: this.state.page },
      true
    ).then(
      async (resp) => {
        this.setState(
          { users: [...this.state.users, ...resp.post], showSkeleton: false },
          () => {
            this.checkMore(1);
          }
        );
      },
      (error) => {}
    );
  };

  checkMore = (i) => {
    getAuthorBlogs(
      {
        userid: this.state.id,
        limit: this.state.limit,
        page: this.state.page + 1,
      },
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
    this.setState(
      {
        id: this.props.match.params.id,
      },
      () => {
        this.getAuthor();
        this.getSuggestedFriends();
      }
    );
  }

  render() {
    const { author } = this.state;
    return (
      <div className="seeAllPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column" />
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="empty-container-with-border w-100 authorBio">
                <ul className="list-group popular_item w-100 border-bottom">
                  <li className="list-group-item">
                    <div className="media">
                      <div className="media-left">
                        <A href={`/u/${author._id}`}>
                          <div
                            className="thumbnail circle widgetPic"
                            style={{
                              backgroundImage: `url(${pic(author.avatar)})`,
                            }}
                          />
                        </A>
                      </div>
                      <div className="media-body">
                        <A href={`/u/${author._id}`}>
                          <p className="media-heading">{author.name}</p>
                        </A>
                      </div>
                      <div className="media-right text-end">
                        <A href={`/u/${author._id}`}>
                          <button
                            type="button"
                            className="primaryBtn ms-4 mt-2"
                          >
                            Profile
                          </button>
                        </A>
                      </div>
                    </div>
                  </li>
                </ul>
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
                    this.state.users.map((e, i) => (
                      <ul className="list-group popular_item w-100" key={i}>
                        <li className="list-group-item">
                          <div className="media">
                            <div className="media-left">
                              <A href={`/blog/${e.slug}`}>
                                <div
                                  className="thumbnail"
                                  style={{
                                    backgroundImage: `url(${e.contents[0].content_url})`,
                                  }}
                                />
                              </A>
                            </div>
                            <div className="media-body">
                              <A href={`/blog/${e.slug}`}>
                                <p className="media-heading">{e.subject}</p>
                              </A>
                            </div>
                          </div>
                        </li>
                      </ul>
                    ))}
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
            <div className="col-sm empty-container-with-out-border right-column" />
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AuthorWiseBlogs;
