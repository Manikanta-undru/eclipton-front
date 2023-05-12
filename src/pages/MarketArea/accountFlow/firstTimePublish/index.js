import React from 'react';
import SideMenu1 from '../../_widgets/sideMenu1';
import MarketWidget from '../../../../components/MarketWidget';
import Slider1 from '../../_widgets/slider1';
import Product from '../../_widgets/product/Index';
import Tab1 from '../../_widgets/tab1';
import icon1 from '../../../../assets/images/market-place/icons/icon1.png';
import { update } from '../../../../http/product-calls';
import Button from '../../../../components/Button';
import { alertBox } from '../../../../commonRedux';
import { history } from '../../../../store';
import ProductReportModal from '../../_widgets/product/report';

require('../../_styles/market-area.scss');
require('./product-publish.scss');

class MarketProductPublish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.location.state,
      isProductReport: false,
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log(this.state, 'jjjjj');
  }

  handleEdit() {
    history.push({
      pathname: '/market-product-overview',
      state: this.state.product_id,
    });
  }

  handleSubmit() {
    let hashsize = '';
    if (this.state.size.length > 0) {
      hashsize = this.state.size.join(',');
    } else {
      hashsize = '';
    }
    this.setState({
      products: this.state,
    });

    const updateFormData = {
      description: this.state.description,
      editorContent: this.state.editorContent,
      product_id: this.state.product_id,
      loading: false,
      title: this.state.title,
      condition: this.state.condition,
      category: this.state.category,
      target_audience: this.state.target_audience,
      userid: this.state.userid,
      status: 'publish',
      price_currency: this.state.price_currency,
      amount: this.state.amount,
      discount: this.state.discount,
      availableCurrency: this.state.availableCurrency,
      discount_period: this.state.discount_period,
      attachment: this.state.attachment,
      files2: JSON.stringify(this.state.files2),
      videos2: JSON.stringify(this.state.videos2),
      faqs: JSON.stringify(this.state.faqs),
      returns: JSON.stringify(this.state.returns),
      stock: this.state.stock,
      size: hashsize,
      sub_category: this.state.sub_category,
      address: this.state.address,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipcode: this.state.zipcode,
      delivery_data: this.state.delivery_data,
    };
    update(updateFormData).then(async (resp) => {
      history.push({
        pathname: `/market-product-detail-view/${this.state.product_id}`,
        state: { ...this.state },
      });
      alertBox(true, 'Product has been updated!', 'success');
    });
  }

  handleCallbackReport = (data) => {
    this.setState({
      isProductReport: data.isProductReport,
      productId: data.productId,
    });
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div>
            <div className="reach-more-customers">
              <div className="left">
                <img src={icon1} alt="" />
              </div>

              <div className="middle">
                <h3> Review Your Details Here </h3>
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.{' '}
                </p>
              </div>

              <div className="right btns">
                <Button onClick={this.handleEdit} className="btn-2">
                  {' '}
                  Edit{' '}
                </Button>
                <br />
                <Button onClick={this.handleSubmit} className="btn-1">
                  {' '}
                  Save & Publish{' '}
                </Button>
              </div>
            </div>
          </div>
          <div className="layout-type-1">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            <div className="right-holder">
              <div className="grid-detail">
                {/* BEGIN :: MIDDLE */}
                <div className="middle">
                  {/* <!-- BEGIN :: SLIDER 1 --> */}
                  <div className="slider-1">
                    <Slider1 images={this.state.attachment} />
                  </div>
                  {/* <!-- END :: SLIDER 1 --> */}

                  {/* <!-- BEGIN :: TAB 1 --> */}
                  <div className="tab-1">
                    <Tab1
                      products={this.state}
                      description={this.state.description}
                      publish="first_time_publish"
                    />
                  </div>
                  {/* <!-- END :: TAB 1 --> */}

                  {/* <!-- BEGIN :: RELATED PRODUCTS --> */}
                  <div className="related-products">
                    <div className="title1">
                      <h2> Related Products </h2>
                    </div>
                    <div className="product-wrapper grid-2">
                      <Product
                        parentCallback={this.handleCallbackReport}
                        category={this.state.category}
                      />
                    </div>
                  </div>
                  {/* <!-- END :: RELATED PRODUCTS --> */}
                </div>
                {/* END :: MIDDLE */}

                {/* BEGIN :: RIGHT */}
                <div className="right">
                  <MarketWidget {...this.props} />
                </div>
                {/* END :: RIGHT */}
              </div>
            </div>
            {this.state.isProductReport && (
              <ProductReportModal
                parentCallback={this.handleCallbackReport}
                isProductReport={this.state.isProductReport}
                productId={this.state.product_id}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductPublish;
