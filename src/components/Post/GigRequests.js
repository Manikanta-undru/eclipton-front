import React from 'react';
import { allGigRequests } from '../../http/gig-calls';
import GigRequest from '../Gigs/GigRequest';

class GlobalRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit == undefined ? 20 : props.limit,
      page: 1,
      cid: 0,
      posts: [],
      query: props.query,
      data: {
        category: '',
        subCategory: '',
        priceFrom: '',
        priceTo: '',
        rating: '',
        key: '',
      },
      gigs: [],
      currentTab: 0,
    };
  }

  componentDidMount() {
    this.getData();
    // this.getRequests();
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.getData();
    }
    // this.getRequests();
  }

  categoryChange = (c) => {
    this.setState({
      cid: c,
      currentTab: 0,
    });
  };

  dataChange = (data = {}) => {
    this.getData(data);
    this.getRequests(data);
  };

  getData = (data = {}) => {
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.key = this.props.query == undefined ? '' : this.props.query;
    d.mine = this.props.mine == undefined ? 'false' : this.props.mine;
    d.userid = this.props.currentUser._id;
    allGigRequests(d).then(
      (resp) => {
        this.setState({
          gigs: resp.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // getRequests = (data = {}) => {
  //     var d = data;
  //     d['page']  = this.state.page;
  //     d['limit'] = this.state.limit;
  //     allGigRequests(data).then(resp => {
  //       this.setState({
  //         posts: resp
  //       })
  //     }, err => {

  //     });
  // }
  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  render() {
    return (
      <div className="tab mt-2 ">
        {/* <h2 className="subtitle mt-1">All Gigs</h2> */}
        {this.state.gigs.length == 0 ? (
          <p className="no-found">No Gigs Found</p>
        ) : (
          <div className="row-1">
            {this.state.gigs.map((gig, i) => (
              // return <TopThumbCard  report={this.reportModal} unReport={()=>this.unReport(gig)} url={"/passionomy/gig/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={this.removePost}  />
              <GigRequest {...this.props} post={gig} key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default GlobalRequests;
