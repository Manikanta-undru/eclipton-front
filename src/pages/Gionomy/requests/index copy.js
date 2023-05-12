import React from 'react';
import { alertBox, switchLoader } from '../../../commonRedux';
import A from '../../../components/A';
import GigRequest from '../../../components/Gigs/GigRequest';
import MyGigsMenu from '../../../components/Menu/MyGigsMenu';
import { myGigRequests, removeGigRequest } from '../../../http/gig-calls';

require('./style.scss');

class MyGigRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      posts: [],
      filter: '',
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    myGigRequests({ filter: this.state.filter }).then(
      (resp) => {
        this.setState({
          posts: resp,
        });
      },
      (err) => {}
    );
  };

  filterPosts = (va) => {
    this.setState(
      {
        filter: va,
        posts: [],
      },
      () => {
        this.getData();
      }
    );
  };

  delete = (id, i) => {
    switchLoader(true, 'Please wait...');
    try {
      removeGigRequest({ id }).then(
        (resp) => {
          switchLoader();
          const temp = this.state.posts;
          delete temp[i];
          this.setState({
            posts: temp,
          });
          alertBox(true, 'Removed successfully!', 'success');
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error occured, try again');
    }
  };

  render() {
    return (
      <div className="">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <MyGigsMenu {...this.props} />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="feedFilters">
                <h3 className="subtitle" style={{ width: '150px' }}>
                  My Gig Requests
                </h3>
                <ul>
                  <li>
                    <button
                      className={`btn ${
                        this.state.filter == '' ? 'btn-main' : 'btn-outline'
                      }`}
                      onClick={(e) => this.filterPosts('')}
                    >
                      All
                    </button>
                  </li>
                  {/* <li><button className={"btn "+(filter == 'saved' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('saved')}>Saved</button></li> */}
                  <li>
                    <button
                      className={`btn ${
                        this.state.filter == 'draft'
                          ? 'btn-main'
                          : 'btn-outline'
                      }`}
                      onClick={(e) => this.filterPosts('draft')}
                    >
                      Draft
                    </button>
                  </li>
                  {/* <li><button className={"btn "+(filter == 'hidden' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('hidden')}>Hidden</button></li>
                    <li><button className={"btn "+(filter == 'paid' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('paid')}>Paid</button></li>
                    <li className="ml-auto"><button className={"btn "+(filter == 'purchased' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('purchased')}>Blogs purchased by me</button></li> */}
                  {/* <li><button className={"btn "+(filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                </ul>
              </div>
              {this.state.posts.length == 0 ? (
                <p className="no-found">No Requests Found</p>
              ) : (
                this.state.posts.map((gig, i) => (
                  <div className="row-1" key={i}>
                    <GigRequest {...this.props} post={gig} />
                    {/* <TopThumbCard  report={this.reportModal} unReport={()=>this.unReport(gig)} url={"/passionomy/gig-request/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={() => this.delete(gig._id, i)} base={"/passionomy/request/edit/"}  /> */}
                  </div>
                ))
              )}
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <A href="/passionomy/requests/add" className="widgetButtonMenu ">
                <i className="fa fa-plus" /> Create Request
              </A>
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default MyGigRequests;

{
  /* <div className="MyGigRequests">
<div className="container my-wall-container ">
  <div className="row">
    <div className="col-sm empty-container-with-out-border left-column">
      <MyGigsMenu {...this.props} />
    </div>
    <div className="col-sm empty-container-with-out-border center-column">
    <section className="cards">
        {
            this.state.posts.length == 0 ?
            <p className="no-found">No Requests Found</p>
            :
            this.state.posts.map((gig, i) => {
                return <div className={"post "} >
                <LeftThumbCard  report={this.reportModal} unReport={()=>this.unReport(gig)} url={"/passionomy/request/"+gig._id} currentUser={this.props.currentUser} post={gig} removePost={this.removePost}  />
            </div>
            })
        }
        </section>
    </div>
    <div className="col-sm empty-container-with-out-border right-column">
        <CreateGigWidget />
    </div>
    {/* <!-- end right column --> 
  </div>
</div>

</div> */
}
{
  /* <div className="card"  >
                                <div className="card-image" style={{backgroundImage: `url(${pic(gig.contents[0] == undefined ? '' : gig.contents[0].content_url)})`}} onClick={()=> {window.location.href = "/passionomy/gig-request/"+gig._id ; }}>
                                    
                                </div>
                                <div className="card-container">
                                    <span style={{ fontSize: '14px' }} ><img className="media-object pic" src={profilePic(gig.userinfo.avatar)} alt="Avatar" />{gig.userinfo.name}</span>
                                    <p>{gig.subject}</p>
                                    <div className="price">
                                    <p>Budget <span style={{ fontSize: '14px', color: 'blue' }}>{gig.preferedCurrency ?? 'USD'} {gig.budget}</span></p>
                                    <div className="list-group-item  p-1 pr-2 pointer  dropdown"><img
                                            src={require("../../../assets/images/vertical-dots.png")} />
                                        <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                                                <a className="dropdown-item" href={"/passionomy/request/edit/"+gig._id}>
                                                <img className="mr-1" src={require("../../../assets/images/edit-icon.png")} />
                                                <span className="m-1">Edit</span></a>
                                                <a className="dropdown-item" onClick={(e) => this.delete(gig._id, i)}>
                                                <img className="mr-1" src={require("../../../assets/images/remove-icon.png")} />
                                                <span className="m-1">Delete</span></a>
                                              
                                        </div>
                                        </div>
                                      
                                      </div>
                                </div>
                            </div> */
}
