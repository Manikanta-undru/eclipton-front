import React from 'react';
import Paper from '@material-ui/core/Paper';
import { purchasedGigs } from '../../http/gig-calls';
import { pic } from '../../globalFunctions';
import '../../pages/Gionomy/PurchasedGigs/Purchased.scss';
import { history } from '../../store';

class GlobalPurchased extends React.Component {
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
    purchasedGigs().then(
      (resp) => {
        this.setState({
          gigs: resp,
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

  redirectpost = (postid) => {
    history.push(`/passionomy/dashboard/gig/${postid}`);
  };

  render() {
    return (
      <>
        {this.state.gigs.length == 0 ? (
          <div className="tab mt-2 ">
            <p className="no-found">No Gigs Found</p>
          </div>
        ) : (
          <div className="tab mt-2 ">
            <div className="buyer-screen">
              <div className="product-list">
                {this.state.gigs.map((item, index) => (
                  <Paper
                    onClick={(e) => this.redirectpost(item.postid)}
                    variant="outlined"
                    square
                    className="product-card pointer mt-0"
                    key={index}
                  >
                    <div
                      className="product-image"
                      style={{
                        backgroundImage: `url(${pic(
                          item.gigs.banner == undefined ||
                            item.gigs.banner == ''
                            ? ''
                            : item.gigs.banner
                        )})`,
                      }}
                    >
                      {/* <img alt={item.subject} src={pic(item.contents[0] == undefined ? '' : item.contents[0].content_url)} /> */}
                    </div>

                    <div className="product-details selected-item">
                      <div className="name-cost">
                        <div className="product-name">{item.gigs.subject}</div>
                        <div className="product-cost">
                          {item.currency} {item.amount}
                        </div>
                      </div>
                      <div className="delivery-status">
                        <div className="product-delivery">
                          {item.data.fast
                            ? `Extra Fast ${item.data.days} Day(s) Delivery`
                            : `${
                                item.gigs[`${item.data.plan}Days`]
                              } Day(s) Delivery`}
                        </div>
                        <div className="product-status">
                          status:{' '}
                          <span className={`st${item.status}`}>
                            {' '}
                            {item.status == 1
                              ? 'Pending'
                              : item.status == 2
                              ? 'Accepted'
                              : item.status == -1
                              ? 'Rejected'
                              : item.status == 3
                              ? 'Completed'
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default GlobalPurchased;
