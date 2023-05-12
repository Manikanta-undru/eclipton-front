import React from 'react';
import Button from '../../components/Button';
import A from '../../components/A';
import PopularArticles from '../../components/Blog/PopularArticles';
import BlogFilter from '../../components/Filter/blogFilter';
import BlogPosts from '../../components/Post/BlogPosts';
import FilteredBlogPosts from '../../components/Post/FilteredBlogPosts';
import RewardsWidget from '../../components/RewardsWidget';
import { getBlogStats } from '../../http/blog-calls';
import MobileNav from '../../components/Menu/MobileNav';

require('./styles.scss');

class MyBlogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      filter: '',
      data: null,
      loadmore: false,
      latestpost: {},
      status: null,
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    this.getStats();
  }

  getStats = () => {
    getBlogStats().then((res) => {
      if (res.gigs > 5) {
        this.setState({ loadmore: true });
      }
      this.setState({
        stats: res,
      });
    });
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

  dataChange = (data = {}) => {
    if (
      Object.keys(data).length <= 0 ||
      (data.category == '' &&
        data.priceFrom == '' &&
        data.priceTo == '' &&
        data.key == '' &&
        data.freePaid == '')
    ) {
      this.setState({
        current: 'all',
        data: null,
      });
    } else {
      this.setState({
        current: '',
        data,
      });
    }
  };

  filterPosts = (opt) => {
    this.setState({
      latestpost: {},
      filter: opt,
    });
  };

  render() {
    return (
      // <!-- Wall container -->
      <div className="myBlogsPage">
        <div className="container my-wall-container ">
          <div className="row mt-2 mobileNavRow">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <WalletBalanceWidget  {...this.props} current="/" /> */}
              <BlogFilter dataChange={this.dataChange} />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column mobileProfile">
              <MobileNav />
              <div className="centerWrapper">
                <div className="banner">
                  <div className="banner-body">
                    <div className="banner-desc">
                      <h3>My Blogs</h3>
                      <div className="row-s mt-3">
                        <div className="me-3">
                          <strong>
                            {this.state.stats == null
                              ? 0
                              : this.state.stats.gigs}
                          </strong>{' '}
                          No of blogs
                        </div>
                        <div className="me-3">
                          <strong>
                            {this.state.stats == null
                              ? 0
                              : this.state.stats.messages}
                          </strong>{' '}
                          Sales
                        </div>
                        <div>
                          $
                          <strong>
                            {this.state.stats == null
                              ? 0
                              : this.state.stats.jobs?.toFixed(2)}
                          </strong>{' '}
                          Tips
                        </div>
                      </div>
                    </div>
                    {/* <div className="banner-btns">
                                <span className="pr-2">Find Jobs</span>
                                    <ToggleButton activeLabel="" inactiveLabel="" value={false} onToggle={(value) => {
                                      if(!value){
                                          props.history.push("/passionomy/dashboard/requests");
                                      }
                                    }} />
                                <span className="pl-2">Hire Talents</span> 
                            </div> */}
                  </div>
                </div>
                <div className="banner bottom ">
                  <div className="banner-body">
                    <ul className="filters">
                      <li>
                        <span
                          className={` ${
                            this.state.filter == '' ? 'active-blog-tab' : ''
                          } pointer`}
                          onClick={(e) => this.filterPosts('')}
                        >
                          All
                        </span>
                      </li>
                      <li>
                        <span
                          className={`${
                            this.state.filter == 'saved'
                              ? 'active-blog-tab'
                              : ''
                          } pointer`}
                          onClick={(e) => this.filterPosts('saved')}
                        >
                          Wishlist
                        </span>
                      </li>
                      <li>
                        <span
                          className={`${
                            this.state.filter == 'draft'
                              ? 'active-blog-tab'
                              : ''
                          } pointer`}
                          onClick={(e) => this.filterPosts('draft')}
                        >
                          Draft
                        </span>
                      </li>
                      {/* <li><span className={"btn "+(this.state.filter == 'hidden' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('hidden')}>Hidden</span></li> */}
                      <li>
                        <span
                          className={` ${
                            this.state.filter == 'paid' ? 'active-blog-tab' : ''
                          } pointer`}
                          onClick={(e) => this.filterPosts('paid')}
                        >
                          Paid
                        </span>
                      </li>
                      <li className="">
                        <span
                          className={` ${
                            this.state.filter == 'purchased'
                              ? 'active-blog-tab'
                              : ''
                          } pointer`}
                          onClick={(e) => this.filterPosts('purchased')}
                        >
                          Purchased
                        </span>
                      </li>
                    </ul>

                    <A href="/add-blog">
                      <Button variant="primaryBtn">Add</Button>
                    </A>
                  </div>
                </div>
                {/* <!-- create post container --> */}
                {/* <A href="/add-blog"><CreateBlog setState={this.setStateFunc} {...this.props} /></A> */}
                {/* <!-- end create post container --> */}

                {/* <!-- post container --> */}
                {/* <div className="feedFilters">
                  <h3 className="subtitle">My Blogs</h3>
                  <ul>
                    <li><span className={"btn "+(this.state.filter == '' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('')}>All</span></li>
                    <li><span className={"btn "+(this.state.filter == 'saved' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('saved')}>Wishlist</span></li>
                    <li><span className={"btn "+(this.state.filter == 'draft' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('draft')}>Draft</span></li>
                    <li><span className={"btn "+(this.state.filter == 'hidden' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('hidden')}>Hidden</span></li>
                    <li><span className={"btn "+(this.state.filter == 'paid' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('paid')}>Paid</span></li>
                    <li className="ml-auto"><span className={"btn "+(this.state.filter == 'purchased' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('purchased')}>Purchased</span></li>
                    {/* <li><span className={"btn "+(this.state.filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</span></li> 
                  </ul>
                  </div> */}
                {this.state.filter == '' ? (
                  <BlogPosts
                    filters={this.state.data}
                    loadMore={this.state.loadmore}
                    setState={this.setStateFunc}
                    latestpost={this.state.latestpost}
                    {...this.props}
                    refreshHighlights={this.refreshHighlights}
                    type="blogs"
                    mine
                  />
                ) : (
                  <FilteredBlogPosts
                    setState={this.setStateFunc}
                    latestpost={this.state.latestpost}
                    {...this.props}
                    filter={this.state.filter}
                    mine
                    filters={this.state.data}
                    from="blog"
                  />
                )}
                {/* <!-- end post container --> */}
                {/* <div className="mt-3">
                <PopularGigsWidget {...this.props} />
                </div> */}
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
              <PopularArticles {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default MyBlogs;
