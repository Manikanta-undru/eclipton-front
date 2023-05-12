import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import SideMenu3 from '../../_widgets/sideMenu3';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import {
  getAllReviews,
  removeReview,
} from '../../../../http/product-review-calls';
import { alertBox } from '../../../../commonRedux';

require('../../_styles/market-area.scss');
require('./reviews.scss');

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      products: [],
      page: 1,
      pageList: [],
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.state.page);
  }

  handleLoad(e, page) {
    e.preventDefault();
    this.setState({
      page,
    });
    const element = document.getElementsByClassName('pagination-numbers')[0];
    element.classList.add('active');
    this.state.pageList.forEach((e_item) => {
      if (page !== e_item) {
        element.classList.remove('active');
      }
    });
    this.fetchData(page);
  }

  fetchData(page) {
    const formData = {
      page,
    };
    getAllReviews(formData).then(
      async (resp) => {
        this.setState({
          reviews: resp.data,
          products: resp.product_titles,
        });

        const list = [];
        let i = 1;
        while (i <= Math.ceil(resp.total_count / 5)) {
          list.push(i);
          i++;
        }
        this.setState({
          pageList: list,
        });
      },
      (error) => {}
    );
  }

  handleDelete(e, review_id) {
    e.preventDefault();
    const formData = {
      review_id,
    };
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      removeReview(formData).then(
        async (resp) => {
          alertBox(true, 'Review has been deleted!', 'success');
          this.fetchData();
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  }

  render() {
    return (
      <div className="market-place-styles">
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

                <div className="right ">
                  <div className="your-promotion-table-holder">
                    <div className="head">
                      <div className="left">
                        <h2> Reviews List </h2>
                      </div>
                    </div>
                    {this.state.reviews.length > 0 && (
                      <table className="table-1">
                        <thead className="">
                          <tr role="row" className="">
                            <th> Image </th>
                            <th> Product Title </th>
                            <th> Comment </th>
                            <th> Created Date </th>
                            <th />
                          </tr>
                        </thead>
                        {this.state.reviews.map((reviews, i) => (
                          <tbody key={reviews._id}>
                            <tr>
                              <td data-xs="Image">
                                {reviews.attachment !== undefined &&
                                  reviews.attachment !== null &&
                                  Object.keys(reviews.attachment).length >
                                    0 && (
                                    <img
                                      src={
                                        reviews.attachment[
                                          Object.keys(reviews.attachment)[0]
                                        ].src
                                      }
                                    />
                                  )}
                              </td>
                              <td data-xs="Product Title">
                                {
                                  this.state.products.find(
                                    (o) => o._id === reviews.productid
                                  ).title
                                }
                              </td>
                              <td data-xs="Comment"> {reviews.review} </td>
                              <td data-xs="Created Date">
                                {' '}
                                {moment(reviews.createdAt).format(
                                  'MMM DD, YYYY'
                                )}{' '}
                              </td>
                              <td>
                                <div className="dropdown-box dropdown-1">
                                  <button className="btn">
                                    {' '}
                                    <i className="fa fa-ellipsis-v" />{' '}
                                  </button>
                                  <ul className="bg-lite">
                                    <li>
                                      <Link
                                        to={`/market-product-detail-view/${reviews.productid}`}
                                        className="view"
                                      >
                                        {' '}
                                        View{' '}
                                      </Link>
                                      <Link
                                        to="/market-review-list"
                                        onClick={(e) =>
                                          this.handleDelete(e, reviews._id)
                                        }
                                        className="delete"
                                      >
                                        {' '}
                                        Delete{' '}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    )}
                    <div className="pagination">
                      <a
                        href="#"
                        onClick={(e) => this.handleLoad(e, this.state.page - 1)}
                      >
                        &laquo;
                      </a>
                      {this.state.pageList.map((number, i) => (
                        <a
                          href=""
                          onClick={(e) => this.handleLoad(e, number)}
                          className="pagination-numbers"
                          key={i}
                        >
                          {number}
                        </a>
                      ))}
                      <a
                        href="#"
                        onClick={(e) => this.handleLoad(e, this.state.page + 1)}
                      >
                        &raquo;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewList;
