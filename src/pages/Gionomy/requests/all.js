import React from 'react';
import GigFilter from '../../../components/Filter/gigFilter';
import CreateGigWidget from '../../../components/Gigs/Create';
import GigRequest from '../../../components/Gigs/GigRequest';
import PopularGigs from '../../../components/Gigs/PopularGigs';
import { allGigRequests } from '../../../http/gig-calls';

require('./style.scss');

class AllGigRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      posts: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    allGigRequests().then(
      (resp) => {
        this.setState({
          posts: resp,
        });
      },
      (err) => {}
    );
  };

  render() {
    return (
      <div className="">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GigFilter />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <h2 className="subtitle mt-1">All Gig Requests</h2>
              <div>
                {this.state.posts && this.state.posts.length > 0 ? (
                  this.state.posts.map((gig, i) => (
                    <div className="row-1" key={i}>
                      <GigRequest {...this.props} post={gig} />
                      {/* <TopThumbCard report={this.reportModal} unReport={()=>this.unReport(gig)} url={"/passionomy/gig-request/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={this.removePost}  base={"/passionomy/request/edit/"} /> */}
                    </div>
                  ))
                ) : (
                  <p className="no-found">No Gig Requests Found</p>
                )}
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <CreateGigWidget extra />
              <PopularGigs />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AllGigRequests;
