import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

import successIcon from '../../../../assets/images/market-place/icons/success-promotion.png';
import { getPromotion } from '../../../../http/promotion-calls';

require('../../_styles/market-area.scss');

class PromotionSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
  }

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    }
  }

  fetchData() {
    const formData = {
      promotion_id: this.state.promotion_id,
    };
    getPromotion(formData).then(
      async (res) => {
        this.setState(res);
      },
      (error) => {}
    );
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-center">
            <div className="common-empty-box">
              <div className="holder">
                <img src={successIcon} alt="" />
                <h3>
                  {' '}
                  {this.state.price} | {this.state.currency} of promotion has
                  been created successfully!{' '}
                </h3>
                <p>
                  {' '}
                  This promotion is valid from{' '}
                  {moment(this.state.start_date).format('MMM DD, YYYY')} -{' '}
                  {moment(this.state.end_date).format('MMM DD, YYYY')} |{' '}
                  {this.state.start_time} - {this.state.end_time}{' '}
                </p>
                <Link to="/market-default-view" className="btn-1">
                  {' '}
                  Go back to Marketplace{' '}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PromotionSuccess;
