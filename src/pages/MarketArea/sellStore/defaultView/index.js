import React from 'react';
import { Link } from 'react-router-dom';

import MarketMenu from '../../../../components/Menu/MarketMenu';
import SideMenu3 from '../../_widgets/sideMenu3';
import profileImg from '../../../../assets/images/market-place/sell-store/profile1.png';
import statusIcon from '../../../../assets/images/market-place/sell-store/status-icon.png';
import pieChart from '../../../../assets/images/market-place/sell-store/pie-chart.png';
import { getAll } from '../../../../http/product-calls';

require('../../_widgets/titleAndFilter/title-and-filter.scss');
require('../../_styles/market-area.scss');

class MarketSellStoreDefault extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      this.fetchAllProduct('all');
    }
  }

  fetchAllProduct(category) {
    const err = [];
    const formData = {};
    if (category === 'all') {
      formData.limit = 6;
    } else {
      formData.category = category;
    }
    getAll(formData).then(
      async (resp) => {
        this.setState({
          products: resp,
        });
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  render() {
    return (
      <div className="container-fluid container-layout-1">
        <div className="layout-type-1">
          <div className="left">
            <MarketMenu {...this.props} current="/" />
          </div>

          <div className="middle content">
            <div className="split-type-1">
              <div className="left">
                <SideMenu3 />
              </div>

              <div className="right">
                <div className="sell-store-search-result">
                  {/* BEGIN :: PROFILE WIDGET 1 */}
                  <div className="left profile-widget-1">
                    <div className="imgs">
                      <img src={profileImg} />

                      <span className="status-icon">
                        <img src={statusIcon} />
                      </span>
                    </div>

                    <div className="content">
                      <h3> Mahesh Kumar </h3>
                      <p>
                        {' '}
                        <i className="fa fa-phone" /> +91 303 7235312{' '}
                      </p>

                      <Link className="btn-2"> Follow </Link>
                      <p> 780 Followers </p>
                    </div>
                  </div>
                  {/* END :: PROFILE WIDGET 1 */}

                  {/* BEGIN :: PROFILE DETAIL */}
                  <div className="right profile-detail">
                    {/* BEGIN :: LEFT */}
                    <div className="left">
                      <div className="common-top">
                        <p> Positive Seller Rating </p>
                        <h2> 83% </h2>
                      </div>
                      <div className="common-bottom">
                        <p> Ship on Time</p>
                        <h2> 99% </h2>
                      </div>
                    </div>
                    {/* END :: LEFT */}

                    {/* BEGIN :: MIDDLE */}
                    <div className="middle">
                      <div className="common-top grid">
                        <div className="left">
                          <p>
                            {' '}
                            Joined <i className="fa fa-clock" />{' '}
                          </p>
                          <h2> 1+ Year </h2>
                        </div>
                        <div className="right">
                          <img src={pieChart} alt="" />
                        </div>
                      </div>

                      <div className="common-bottom grid">
                        <div className="left">
                          <p>
                            {' '}
                            Seller Size <i className="fa fa-clock" />{' '}
                          </p>
                          <h2> Initial Level </h2>
                        </div>
                        <div className="right seller-levels">
                          <span className="level black" />
                          <span className="level" />
                          <span className="level" />
                          <span className="level" />
                          <span className="level" />
                        </div>
                      </div>
                    </div>
                    {/* END :: MIDDLE */}

                    {/* BEGIN :: RIGHT */}
                    <div className="right">
                      <div className="common-top grid">
                        <div className="left">
                          <p>
                            {' '}
                            Shipped on Time <i className="fa fa-clock" />{' '}
                          </p>
                          <h3>
                            {' '}
                            this is average for sellers in same category{' '}
                          </h3>
                        </div>
                        <div className="right">
                          <h2> 100% </h2>
                        </div>
                      </div>

                      {/* <div className="common-bottom">
                <Link to="/market-chat-with-seller-2" className="btn-1 btn-block"> Chat with Seller </Link>
              </div> */}
                    </div>
                    {/* END :: RIGHT */}
                  </div>
                  {/* BEGIN :: PROFILE DETAIL */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketSellStoreDefault;
