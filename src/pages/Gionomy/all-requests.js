import React from 'react';
import ToggleButton from 'react-toggle-button';
import InfiniteScroll from 'react-infinite-scroller';
import { alertBox } from '../../commonRedux';
import Button from '../../components/Button';
import GigFilter from '../../components/Filter/gigFilter';
import GigRequest from '../../components/Gigs/GigRequest';
import Modal from '../../components/Popup';
import Spinner from '../../components/Spinner';
import RewardsWidget from '../../components/RewardsWidget';
import { allGigRequests } from '../../http/gig-calls';
import { postReport, postUnReport } from '../../http/http-calls';
import './gigs.scss';

class AllGigRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      gigPage: false,
      page: 1,
      cid: 0,
      posts: [],
      category: '',
      reason: '',
      reportModal: false,
      hasMore: true,
      postLoaded: false,
      showSkeleton: true,
      showComments: false,
      prevData: {},
      data: {
        category: '',
        subCategory: '',
        priceFrom: '',
        priceTo: '',
        rating: '',
        key: '',
      },
      lastData: null,
      lastI: null,
      lastType: null,
      gigs: [],
      currentTab: 0,
      gigsres: '',
    };
  }

  reportModal = (p = null, i = null, t = null) => {
    this.setState({
      lastData: p,
      lastI: i,
      lastType: t,
    });
    this.setState({ reportModal: !this.state.reportModal }); // true/false toggle
  };

  report = () => {
    const { lastData } = this.state;
    const { lastI } = this.state;
    const link = `gigonomy/gig/${lastData._id}`;
    postReport({
      id: lastData._id,
      type: this.state.lastType,
      link,
      category: this.state.category,
      reason: this.state.reason,
    }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        const temp = this.state.posts;
        temp[lastI].reported = 1;
        this.setState({ reportModal: false, posts: temp });
      },
      (error) => {
        alertBox(true, error.data.message);
        this.setState({ reportModal: false });
      }
    );
  };

  unReport = (post, i) => {
    postUnReport({ id: post._id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        const temp = this.state.posts;
        temp[i].reported = 0;
        this.setState({ reportModal: false, posts: temp });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  componentDidMount() {
    this.getRequests();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.posts !== this.state.posts) {
      this.setState({
        // posts: [],
      });
    }
  }

  dataChange = (data = {}) => {
    const err = [];
    if (parseInt(data.priceFrom) > parseInt(data.priceTo)) {
      err.push('Price to must be greater than price from');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      this.setState({ data, page: 1, posts: [], gigsres: '' });
      this.getRequests(data, 1);
    }
  };

  loadFunc = () => {
    // if (!this.state.showSkeleton && this.state.hasMore) {
    //     this.setState({ showSkeleton: true })
    //     this.setState(prevState => {
    //         return {
    //             ...prevState,
    //             page: prevState.page + 1,
    //             postLoaded: true,
    //             showSkeleton: false,
    //             hasMore:true

    //                 }
    //     }, () => {
    //         this.getRequests(this.state.data);
    //     })
    // }else{
    //     this.setState({ showSkeleton: true, postLoaded:true,hasMore:false })
    //     // this.getRequests();

    // }

    if (this.state.hasMore) {
      this.setState({ hasMore: false });
      this.setState(
        (prevState) => ({
          ...prevState,
          page: prevState.page + 1,
          // postLoaded: true,
          // showSkeleton: true,
          hasMore: false,
        }),
        () => {
          this.getRequests(this.state.data);
        }
      );
    }
  };

  getRequests = (data = {}, page) => {
    const d = data;
    d.page = page !== undefined ? page : this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    d.all = 1;

    if (
      Object.keys(this.state.prevData).length === 0 ||
      (this.state.prevData == data && this.state.gigsres != null) ||
      this.state.prevData != data ||
      (data.category == '' && data.subCategory != '')
    ) {
      if (data.category == '' && data.subCategory != '') {
        d.subCategory = '';
      }
      this.setState({ prevData: this.state.data });

      allGigRequests(d).then(
        (resp) => {
          let filteredArray = [];
          if (resp.data && resp.data !== undefined && resp.data.length > 0) {
            const arr1 = resp.data;

            if (
              this.state.data == this.state.prevData &&
              this.state.posts.length > 0 &&
              arr1.length > 0
            ) {
              const com = [...this.state.posts, ...arr1];
              filteredArray = com;
            } else {
              this.setState({ posts: [] });
              filteredArray = arr1;
            }
            // var filteredArray = arr1;

            this.setState(
              {
                posts: filteredArray,
                postLoaded: true,
                gigsres: '',
                // showSkeleton: (resp.total > this.state.gigs.length) ? false :true,
                // usewindow :true
                // prevData:this.state.data
              },
              () => {
                this.setState({
                  hasMore: !!(
                    resp.total > this.state.posts.length ||
                    this.state.posts.length == 0
                  ),
                });
              }
            );
          } else {
            this.setState({ gigsres: null });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  getdata = () => {
    const { posts } = this.state;
    return posts.length == 0 ? (
      <p className="no-found">No Gigs Found</p>
    ) : (
      <div className="row-1">
        {posts.map((gig, i) => (
          // return <TopThumbCard  report={() => this.reportModal(gig, i, 'gig')} unReport={()=>this.unReport(gig, i)} url={"/passionomy/gig/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={this.removePost}  base={"/passionomy/edit/"} />
          <GigRequest
            {...this.props}
            post={gig}
            posts={posts}
            {...this.state}
            key={i}
          />
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="gigsPage">
        <Modal
          displayModal={this.state.reportModal}
          closeModal={this.reportModal}
        >
          <div>
            <div className="form-group">
              <select
                className="form-control"
                value={this.state.category}
                onChange={(e) => this.setState({ category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option>Violence</option>
                <option>Racism / Hatespeech</option>
                <option>Pornographic</option>
                <option>Spam</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                type="text"
                placeholder="Reason"
                className="form-control"
                onChange={(e) => this.setState({ reason: e.target.value })}
                value={this.state.reason}
              />
            </div>
          </div>
          <div className="">
            <Button
              variant="primary"
              size="compact m-2"
              onClick={() => this.report()}
            >
              Report
            </Button>
            <Button
              variant="secondary"
              size="compact m-2"
              onClick={this.reportModal}
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GigFilter dataChange={this.dataChange} page="company" />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="banner">
                <div className="banner-body">
                  <div className="banner-desc">
                    <h3>All Jobs</h3>
                  </div>
                  <div className="banner-btns">
                    <span className="p-2">Find Jobs</span>
                    <ToggleButton
                      activeLabel=""
                      inactiveLabel=""
                      value
                      onToggle={(value) => {
                        if (value) {
                          this.props.history.push('/passionomy/gigs');
                        }
                      }}
                    />
                    <span className="p-2">Hire Talents</span>
                  </div>
                </div>
              </div>
              <InfiniteScroll
                pageStart={0}
                initialLoad={false}
                loadMore={this.loadFunc}
                hasMore={this.state.hasMore}
                loader={
                  <div>
                    <Spinner />
                  </div>
                }
              >
                <div className="clearfix">{this.getdata()}</div>
              </InfiniteScroll>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
              {/* <CreateGigWidget extra={true} />
                    <PopularGigs /> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AllGigRequests;
