import React from 'react';
import { alertBox } from '../../../commonRedux';
import A from '../../A';
import Button from '../../Button';
import Gig from '../Gig';
import { getGigs } from '../../../http/gig-calls';
import { postReport, postUnReport } from '../../../http/http-calls';
import './style.scss';

class PopularGigsWidget extends React.Component {
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

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.toppost !== this.props.toppost) {
      this.setState({ gigs: this.props.toppost });
    }
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
      gigs: [],
    });
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    getGigs(d).then(
      (resp) => {
        const gigpost = [];
        if (resp.data.post != undefined) {
          const postdata = resp.data.post;
          this.setState(
            {
              gigs: postdata,
            },
            () => {}
          );
        }
      },
      (err) => {
        console.log(err);
      }
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
            <h3 className="gtitle">Talents you may like</h3>
            <h4 className="gsubtitle">Gigs you might be interested in</h4>
          </div>
          <A href="/passionomy/gigs">
            <Button variant="secondaryBtn">View All</Button>{' '}
          </A>
        </div>
        <div className="clearfix">
          {this.state.gigs.length == 0 ? (
            <p className="no-found">No Gigs Found</p>
          ) : (
            <div className="row-1">
              {this.state.gigs.map(
                (gig, i) => (
                  <Gig {...this.props} post={gig} key={i} />
                )
                // return <TopThumbCard  report={() => this.reportModal(gig, i, 'gig')} unReport={()=>this.unReport(gig, i)} url={"/passionomy/gig/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={this.removePost}  base={"/passionomy/edit/"} />
                // return (gig.userid != this.props.currentUser._id) ? <Gig {...this.props} post={gig} /> :(gig.userid != this.props.currentUser._id) ? (this.state.gigs.length == i+1 && gig.userid != this.props.currentUser._id) ? <p className="no-found">No Gigs Found</p> : null : null
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PopularGigsWidget;
