import React from 'react';
import { alertBox } from '../../../commonRedux';
import A from '../../A';
import Button from '../../Button';
import GigRequest from '../GigRequest';
import { allGigRequests } from '../../../http/gig-calls';
import { postReport, postUnReport } from '../../../http/http-calls';
import './style.scss';

class PopularGigRequests extends React.Component {
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
    this.getData();
  }

  categoryChange = (c) => {
    this.setState({
      cid: c,
      currentTab: 0,
    });
  };

  dataChange = (data = {}) => {
    this.getData(data);
  };

  getData = (data = {}) => {
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
      <div className="gigsWidget">
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
          {this.state.posts && this.state.posts.length > 0 ? (
            <div className="row-1">
              {this.state.posts.map((gig, i) => (
                <GigRequest {...this.props} post={gig} key={i} />
              ))}
            </div>
          ) : (
            <p className="no-found">No Gig Requests Found</p>
          )}
        </div>
      </div>
    );
  }
}

export default PopularGigRequests;
