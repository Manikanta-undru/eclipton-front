import React from 'react';
import { getGigs } from '../../http/gig-calls';
import Gig from '../Gigs/Gig';
import Loading from '../Loading/Loading';

class GlobalGigs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit == undefined ? 20 : props.limit,
      page: 1,
      cid: 0,
      posts: [],
      query: props.query,
      loading: false,
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
    if (prevProps.query != this.props.query) {
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
    this.setState({ loading: true });

    d.page = this.state.page;
    d.limit = this.state.limit;
    d.key = this.props.query == undefined ? '' : this.props.query;
    d.mine = this.props.mine == undefined ? 'false' : this.props.mine;
    d.userid =
      this.props.id == undefined ? this.props.currentUser._id : this.props.id;
    getGigs(d).then(
      (resp) => {
        if (
          resp.data &&
          resp.data.post !== undefined &&
          resp.data.post.length > 0
        ) {
          this.setState({
            gigs: resp.data.post,
            loading: false,
          });
        }
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
        {this.state.loading ? (
          <Loading />
        ) : this.state.gigs.length == 0 ? (
          <p className="no-found">No Gigs Found</p>
        ) : (
          <div className="row-1">
            {this.state.gigs.map((gig, i) => (
              <Gig {...this.props} post={gig} key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default GlobalGigs;
