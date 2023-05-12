import React from 'react';
import { alertBox } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import GigFilter from '../../components/Filter/gigFilter';
import Gig from '../../components/Gigs/Gig';
import GigRequest from '../../components/Gigs/GigRequest';
import Modal from '../../components/Popup';
import RewardsWidget from '../../components/RewardsWidget';
import { allGigRequests, getGigs } from '../../http/gig-calls';
import { postReport, postUnReport } from '../../http/http-calls';
import './gigs.scss';
import MobileNav from '../../components/Menu/MobileNav';
import Loading from '../../components/Loading/Loading';

class Gigonomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 6,
      page: 1,
      cid: 0,
      posts: [],
      category: '',
      reason: '',
      reportModal: false,
      loading: false,
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
    // this.getData();
    // this.getRequests();
  }

  categoryChange = (c) => {
    this.setState({
      cid: c,
      currentTab: 0,
    });
  };

  dataChange = (data = {}) => {
    // this.props.history.push("/passionomy/gig");
    const err = [];
    if (parseInt(data.priceFrom) > parseInt(data.priceTo)) {
      err.push('Price to must be greater than price from');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      this.setState({ data });
      this.getData(data);
      this.getRequests(data);
    }
  };

  getData = (data = {}) => {
    this.setState({ loading: true });
    this.setState({
      gigs: [],
    });
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    d.pre = 1;
    getGigs(d).then(
      (resp) => {
        const gigpost = [];
        if (resp.data && resp.data.post !== undefined) {
          const postdata = resp.data.post;
          postdata.length > 0 &&
            postdata.map((item) => {
              // if(item.purchaseLoguser == 0){
              gigpost.push(item);
              // }
            });
        }
        if (gigpost.length > 0) {
          this.setState(
            {
              gigs: gigpost,
              loading: false,
            },
            () => {}
          );
        }

        // this.setState({
        //     gigs: resp.post
        // }, () => {
        // });
      },
      (err) => {
        this.setState({ loading: false });
        console.log(err);
      }
    );
  };

  getRequests = (data = {}) => {
    this.setState({
      posts: [],
    });
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    d.all = 1;
    allGigRequests(data).then(
      (resp) => {
        this.setState({
          posts: resp.data,
          loading: false,
        });
      },
      (err) => {}
    );
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
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
          <div className="row mt-2 mobileNavRow">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GigFilter dataChange={this.dataChange} />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column mobileProfile">
              <MobileNav />
              <div className="centerWrapper">
                <div className="banner">
                  <div className="banner-header" />
                  <div className="banner-body">
                    <div className="banner-desc" style={{ display: 'flex' }}>
                      <div className="banner-icon" />
                      <div className="banner-content">
                        <h3>{`Let's hire work or hire talents!`}</h3>
                        <p>
                          An easy marketplace for digital services where
                          individuals or companies can go to find freelancers
                          and gigs with a skill that suits their needs.
                        </p>
                      </div>
                    </div>
                    <div className="banner-btns">
                      <A href="/passionomy/gigs/add">
                        <Button className="primaryBtn">Create Gig</Button>
                      </A>{' '}
                      <A href="/passionomy/requests/add">
                        <Button className="secondaryBtn">Hire Talents</Button>
                      </A>
                    </div>
                  </div>
                </div>

                <div className="mobile-view">
                  <GigFilter dataChange={this.dataChange} />
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="gtitle">Talents you may like</h3>
                    <h4 className="gsubtitle">
                      Gigs you might be interested in
                    </h4>
                  </div>
                  <A href="/passionomy/gigs">
                    <Button variant="secondaryBtn">View All</Button>{' '}
                  </A>
                </div>
                <div className="clearfix">
                  {this.state.loading ? (
                    <Loading />
                  ) : this.state.gigs.length == 0 ? (
                    <p className="no-found">No Gigs Found</p>
                  ) : (
                    <div className="row-1">
                      {this.state.gigs.map(
                        (gig, i) =>
                          gig.userid != this.props.currentUser._id && (
                            <Gig
                              {...this.props}
                              post={gig}
                              {...this.state}
                              key={i}
                            />
                          )
                      )}
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="gtitle mt-4">Jobs you may like</h3>
                    <h4 className="gsubtitle">Gigs that are popular now</h4>
                  </div>
                  <A href="/passionomy/requests">
                    <Button variant="secondaryBtn">View All</Button>{' '}
                  </A>
                </div>

                <div className="clearfix">
                  {this.state.loading ? (
                    <Loading />
                  ) : this.state.posts && this.state.posts.length > 0 ? (
                    <div className="row-1">
                      {this.state.posts.map(
                        (gig, i) =>
                          gig.userid != this.props.currentUser._id && (
                            <GigRequest
                              {...this.props}
                              post={gig}
                              {...this.state}
                              key={i}
                            />
                          )
                      )}
                    </div>
                  ) : (
                    <p className="no-found">No Gig Requests Found</p>
                  )}
                </div>
              </div>
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

export default Gigonomy;
