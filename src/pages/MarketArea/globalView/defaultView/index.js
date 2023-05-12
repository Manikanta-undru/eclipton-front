import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';

import bannerTopImg from '../../../../assets/images/market-place/banner-top.jpg';
import FiltersAndMenu from '../../../../pages/MarketArea/_widgets/filtersAndMenu';
import Product from '../../_widgets/product/Index';
import ProductList from '../../_widgets/product/productList';
import ProductFilter from '../../../../components/Filter/productFilter';
import { getAllPromotion } from '../../../../http/promotion-calls';
import '../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import { Carousel } from 'react-bootstrap';
import ProductReportModal from '../../_widgets/product/report';
import { getProductCategories } from '../../../../http/product-category-calls';
import { STATUS_APPROVE } from '../../../../constants/actionTypes';
require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./default.scss');

class MarketDefaultView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      searchKey: '',
      bannerImages: [],
      categories: [],
    };
  }

  dataChange = (data) => {
    if (data.bannerImages !== undefined && data.bannerImages) {
      this.setState({
        bannerImages: data.bannerImages,
      });
    }
    if (data.products !== undefined && data.products) {
      this.setState({
        products: data.products,
        recordFound: data.recordFound,
      });
    }
    if (
      data.datas !== undefined &&
      data.datas.key !== undefined &&
      data.datas.key
    ) {
      this.setState({
        searchKey: data.datas.key,
      });
    }
  };

  componentDidMount() {
    this.fetchData();
    getProductCategories().then(
      async (res) => {
        this.setState({
          categories: res,
        });
      },
      (err) => {}
    );
  }

  fetchData() {
    var err = [];
    let formData = {};
    if (this.props.match.params.id) {
      formData.category = this.props.match.params.id;
    }
    getAllPromotion(formData).then(
      async (resp) => {
        var bannerImages = [];
        resp.map((res) => {
          if (res.approval_status === STATUS_APPROVE) {
            for (let x in res.attachment) {
              bannerImages.push({
                title: res.title,
                description: res.description,
                src: res.attachment[x].src,
                buttons: res.buttons,
                status: resp.approval_status,
              });
            }
          }
        });
        this.setState({ bannerImages: bannerImages });
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  handleCallbackReport = (data) => {
    this.setState({
      isProductReport: data.isProductReport,
      productId: data.productId,
    });
  };

  render() {
    return (
      <div className="container-fluid container-layout-1">
        <div className="banner-top">
          {this.state.bannerImages !== undefined &&
          this.state.bannerImages.length > 0 ? (
            <div className="markCarousel">
              <div className="container-fluid">
                <div className="row">
                  <Carousel className="carouselFade" interval={2000}>
                    {this.state.bannerImages.map((image, i) => {
                      return (
                        <Carousel.Item key={i}>
                          <img
                            className="d-block w-100"
                            src={
                              image.src +
                              '?auto=compress&cs=tinysrgb&w=260&h=150&dpr=1'
                            }
                            alt={image.title}
                          />
                          <Carousel.Caption>
                            <div className="col-lg-6 col-md-12">
                              <div className="captionBox">
                                <h1>{image.title}</h1>
                                <p>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: image.description,
                                    }}
                                  ></div>
                                </p>
                                <div className="captionBtn_box mt-2">
                                  {image.buttons.map((data) => {
                                    return (
                                      <a
                                        key={data}
                                        href={
                                          '/market-product-detail-view/' +
                                          data.product_id
                                        }
                                        className="captionBtn"
                                      >
                                        {data.name}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </Carousel.Caption>
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
            </div>
          ) : (
            <div className="banner-top">
              <img src={bannerTopImg} />
            </div>
          )}
        </div>
        <FiltersAndMenu
          dataChange={this.dataChange}
          category={
            this.props.match.params.id ? this.props.match.params.id : 'all'
          }
        />
        <div className="layout-type-1">
          <div className="left">
            <MarketMenu {...this.props} current="/" />
            <ProductFilter
              dataChange={this.dataChange}
              category={
                this.props.match.params.id ? this.props.match.params.id : 'all'
              }
            />
          </div>

          <div className="middle content-area">
            {this.state.products.length > 0 &&
              this.state.recordFound === 'found' &&
              this.state.searchKey && (
                <div className="item-found">
                  <p>
                    <span> {this.state.products.length} items found for </span>
                    {`"${this.state.searchKey}"`}
                  </p>
                </div>
              )}
            {/*   <TitleAndFilter />
            
            
            <!-- BEGIN :: PRODUCT WRAPPER -->
            */}
            {this.state.products.length !== 0 &&
              this.state.recordFound === 'found' && (
                <div className="product-wrapper">
                  <ProductList
                    parentCallback={this.handleCallbackReport}
                    products={this.state.products}
                  />
                </div>
              )}
            {this.state.products.length === 0 &&
              this.state.recordFound === 'not_found' && (
                <h6>Product Not Found!</h6>
              )}
            {this.props.match.params.id &&
              this.state.products.length === 0 &&
              !this.state.recordFound && (
                <div className="product-wrapper">
                  <Product
                    parentCallback={this.handleCallbackReport}
                    category_menu={this.props.match.params.id}
                  />
                </div>
              )}
            {/* {
              !this.props.match.params.id &&
              !this.state.recordFound &&
              <AdBox />
            } */}
            {!this.props.match.params.id &&
              this.state.products.length === 0 &&
              !this.state.recordFound &&
              this.state.categories &&
              this.state.categories.length > 0 &&
              this.state.categories.map((e, i) => {
                return (
                  <div className="related-products" key={e.slug}>
                    <div className="title1">
                      <h2> {e.category} </h2>
                    </div>

                    <div className="product-wrapper">
                      <Product
                        category={e.slug}
                        parentCallback={this.handleCallbackReport}
                      />
                    </div>
                  </div>
                );
              })}
            {/* <!-- END :: PRODUCT WRAPPER --> */}
            {this.state.isProductReport && (
              <ProductReportModal
                parentCallback={this.handleCallbackReport}
                isProductReport={this.state.isProductReport}
                productId={this.state.productId}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketDefaultView;
