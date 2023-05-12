import moment from 'moment';
import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../../commonRedux';
import { remove } from '../../../../../http/product-calls';

import '../styles.scss';

require('../../../_styles/market-area.scss');
require('../../dashboard.scss');

class RecentContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(e, product_id) {
    e.preventDefault();
    const formData = {
      product_id,
    };
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      remove(formData).then(
        async (resp) => {
          alertBox(true, 'Product status has been updated!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
    /**/
  }

  render() {
    const { products } = this.props;
    return (
      <table className="table mt-1">
        <thead className="thead-light">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Product Condition</th>
            <th scope="col">Available Size</th>
            <th scope="col"> Remaining Stock Count</th>
            <th scope="col">Status </th>
            <th scope="col">Created Date</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        {products !== undefined && products.length > 0 ? (
          products.map((products, key) => (
            <tbody key={key}>
              <tr className="statusRow">
                <td>{key + 1}</td>
                <td>{products.title}</td>
                <td>{products.category}</td>
                <td>{products.condition}</td>
                <td>{products.size.join(',')}</td>
                <td>{products.stock}</td>
                <td>
                  {products.status !== 'out-of-stock' ? (
                    <span className="stockIcon">
                      <i className="fa fa-circle green" aria-hidden="true" />{' '}
                      Instock
                    </span>
                  ) : (
                    <span className="stockIcon">
                      <i className="fa fa-circle red" aria-hidden="true" /> Out
                      Of Stock
                    </span>
                  )}
                </td>
                <td> {moment(products.createdAt).format('MMM DD, YYYY')} </td>
                <td>
                  <div className="dropdown-box dropdown-1">
                    <button className="btn">
                      {' '}
                      <i className="fa fa-ellipsis-v" />{' '}
                    </button>
                    <ul className="bg-lite">
                      <li>
                        <Link
                          to={{
                            pathname: `/market-product-detail-view/${products._id}`,
                            state: { ...products },
                          }}
                        >
                          View Listing
                        </Link>
                      </li>
                      <li>
                        {' '}
                        <Link
                          to={{
                            pathname: '/market-product-overview',
                            state: products._id,
                          }}
                        >
                          {' '}
                          Edit Listing{' '}
                        </Link>{' '}
                      </li>
                      <li>
                        {' '}
                        <Link
                          onClick={(e) =>
                            this.handleDelete(e, products._id, products.status)
                          }
                          className="delete"
                        >
                          {' '}
                          Delete{' '}
                        </Link>{' '}
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <p>No results found!</p>
        )}
      </table>
    );
  }
}

export default RecentContent;
