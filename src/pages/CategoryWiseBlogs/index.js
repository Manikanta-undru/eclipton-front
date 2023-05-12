import React from 'react';
import Button from '../../components/Button';
import A from '../../components/A';
import PopularArticles from '../../components/Blog/PopularArticles';
import BlogFilter from '../../components/Filter/blogFilter';
import BlogPosts from '../../components/Post/BlogPosts';
import CategoryBlogs from '../../components/Post/CategoryBlogs';
import RewardsWidget from '../../components/RewardsWidget';
import { getBlogCategories } from '../../http/blog-calls';
import MobileNav from '../../components/Menu/MobileNav';
import Loading from '../../components/Loading/Loading';

require('./styles.scss');

class CategoryWiseBlogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postst: [],
      formdata: null,
      current: 'all',
      refreshing: false,
      loading: true,
      categories: [],
      filter: '',
      latestpost: {},
      currentcat: '',
      freePaid: '',
      currency: '',
      isFromFreePaid: false,
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    if (this.props.match.params.category != 'all') {
      this.setState({
        currentcat: this.props.match.params.category,
      });
    }
    this.setState(
      {
        current: this.props.match.params.category,
        loading: false,
      },
      () => {
        if (
          this.props.match.params.category == 'all' ||
          this.props.match.params.category != ''
        ) {
          if (this.props.match.params.category == 'all') {
            this.setState({
              currentcat: '',
            });
          }
          this.getCat();
        }
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.category != prevProps.match.params.category) {
      if (this.props.match.params.category == 'all') {
        this.setState({
          currentcat: '',
        });
      }

      this.setState(
        {
          current: this.props.match.params.category,
          loading: false,
        },
        () => {
          if (
            this.props.match.params.category == 'all' ||
            this.props.match.params.category != ''
          ) {
            this.getCat();
          }
        }
      );
    }
  }

  getCat = () => {
    this.setState({ loading: true });
    getBlogCategories().then(
      (resp) => this.setState({ categories: resp, loading: false }),
      (err) => {
        console.log(err);
      }
    );
  };

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

  catfilterPosts = (opt) => {
    const data = {};
    data.category = opt;
    data.key = '';
    data.priceFrom = '';
    data.priceTo = '';
    this.dataChange(data);
  };

  dataChange = (data = {}) => {
    console.log(data, 'data');
    if (
      Object.keys(data).length <= 0 ||
      (data.category == '' &&
        data.priceFrom == '' &&
        data.priceTo == '' &&
        data.key == '' &&
        data.currency == '')
    ) {
      if (this.props.match.params.category != 'all') {
        this.setState({
          currentcat: this.props.match.params.category,
          current: this.props.match.params.category,
          isFromFreePaid: data.isFromFreePaid,
          freePaid: data.freePaid,
          currency: data.currency,
        });
      } else {
        this.setState({
          current: 'all',
          currentcat: '',
          isFromFreePaid: data.isFromFreePaid,
          freePaid: data.freePaid,
          currency: data.currency,
        });
        if (data.isFromFreePaid && data.freePaid != 'all') {
          this.getData(data);
        }
      }
    } else {
      this.setState(
        {
          current: '',
          currentcat: '',
          isFromFreePaid: data.isFromFreePaid,
          freePaid: data.currency == '' ? data.freePaid : 'paid',
          currency: data.currency,
        },
        () => {
          this.getData(data);
        }
      );
    }
  };

  getData = (data = {}) => {
    const d = data;
    d.page = 1;
    d.limit = 5;
    d.userid = this.props.currentUser._id;
    this.setState({
      formdata: d,
    });
    // getPosts(d, true)
    //     .then(async resp => {
    //         this.setState({
    //             posts: [...this.state.posts, ...resp.post],
    //             hasMore: resp.post && resp.post.length > 0 ? true : false,
    //             postLoaded: true, showSkeleton: false
    //         });
    //     }, error => {

    //         this.setState({ postLoaded: true, showSkeleton: false });
    //     });
    // getGigs(d).then(resp => {
    //     this.setState({
    //         gigs: resp.post
    //     })
    // }, err=>{
    //     console.log(err);
    // })
  };

  render() {
    return (
      // <!-- Wall container -->
      <div className="myBlogsPage">
        <div className="container my-wall-container ">
          <div className="row mt-2 mobileNavRow">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <BlogCategoryMenu  {...this.props} current={this.state.current} /> */}
              <BlogFilter dataChange={this.dataChange} />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column mobileProfile">
              <MobileNav />
              <div className="centerWrapper">
                {this.state.current == 'all' && this.state.currentcat == '' && (
                  <div className="banner">
                    <div className="banner-header banner-header-blog" />
                    <div className="banner-body">
                      <div className="banner-desc" style={{ display: 'flex' }}>
                        <div className="banner-icon" />
                        <div className="banner-content">
                          <h3>Write, read and connect</h3>
                          <p>
                            {`It's easy and free to post your thinking on any
                            topic and connect with millions of readers.`}
                          </p>
                        </div>
                      </div>
                      <div className="banner-btns">
                        <A href="/add-blog">
                          <Button className="primaryBtn">Create Blog</Button>
                        </A>{' '}
                        <A href="/blogs">
                          <Button className="secondaryBtn">My Blogs</Button>
                        </A>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mobile-view">
                  <BlogFilter dataChange={this.dataChange} />
                </div>
                {this.state.loading ? (
                  <Loading />
                ) : this.state.current == 'all' &&
                  this.state.freePaid == 'all' &&
                  this.state.currency == '' &&
                  this.state.currentcat == '' ? (
                  this.state.categories.map((e, i) => (
                    <div className="mb-2" key={i}>
                      {/* onClick={() => this.catfilterPosts(e._id)} */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h2 className="subtitle mt-1">{e.category}</h2>{' '}
                        <A
                          href={`/blogs/${e._id}`}
                          className="text-primary d-block mb-2"
                        >
                          <Button variant="secondaryBtn">View All</Button>
                        </A>
                      </div>
                      <CategoryBlogs
                        category={e.category}
                        setState={this.setStateFunc}
                        latestpost={this.state.latestpost}
                        {...this.props}
                        type="blogs"
                        limit={3}
                        loadMore={false}
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    {/* <h2 className="subtitle mt-1">{this.state.current}</h2> */}
                    <BlogPosts
                      {...this.props}
                      formdata={this.state.formdata}
                      loadMore
                    />
                  </div>
                )}

                <div className="mobile-view">
                  <PopularArticles />
                </div>
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
              {/* <A href="/add-blog" className="widgetButtonMenu ">
                   <i className="fa fa-plus"></i> Create Blog
                </A>
                <A href="/blogs" className="widgetButtonMenu mt-3">
                   <i className="fa fa-book "></i> My Blogs
                </A> */}
              <PopularArticles />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryWiseBlogs;
