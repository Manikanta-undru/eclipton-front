import React from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import { get, update } from '../../../../http/product-calls';
import SideMenu1 from '../../_widgets/sideMenu1';
import Button from '../../../../components/Button';
import { getDelivery } from '../../../../http/delivery-calls';
import { history } from '../../../../store';

require('../../_styles/market-area.scss');
const coins = require('../../../Gionomy/add/coins.json');

class MarketProductReturnAndWarranty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: this.props.location.state,
      delivery_data: [],
      delivery_details: [],
      returns: [
        { title: '', no_of_days: '', no_of_cancel_days: '', description: '' },
      ],
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  handleReturn = (i, e) => {
    const { name } = e.target;
    const temp = this.state.returns;
    const val = e.target.value;
    temp[i][name] = val;
    this.setState({
      returns: temp,
    });
  };

  addReturn = () => {
    const temp = this.state.returns;
    temp.push({
      title: '',
      no_of_days: '',
      no_of_cancel_days: '',
      description: '',
    });
    this.setState({
      returns: temp,
    });
  };

  removeReturn = (i) => {
    const temp = this.state.returns;
    delete temp[i];
    this.setState({
      returns: temp,
    });
  };

  componentDidMount() {
    if (this.state.product_id) {
      this.fetchData();
    }
  }

  fetchData() {
    const formData = {
      product_id: this.state.product_id,
    };
    get(formData).then(
      async (res) => {
        let resp = res[0];
        let files2 = [];
        let videos2 = [];
        if (resp.attachment) {
          for (const x in resp.attachment) {
            if (resp.attachment[x].type === 'Video') {
              videos2.push({
                content_url: resp.attachment[x].src,
              });
            } else {
              files2.push({
                content_url: resp.attachment[x].src,
              });
            }
          }
        }

        getDelivery({
          country: resp.country,
          state: resp.state,
          city: resp.city,
        }).then(
          async (resp) => {
            this.setState({
              delivery_details: resp.delivery_details,
            });
          },
          (err) => {}
        );

        this.setState({
          loading: false,
          title: resp.title,
          condition: resp.condition,
          category: resp.category,
          target_audience: resp.target_audience,
          stock: resp.stock,
          size:
            resp.size == undefined ||
            resp.size[0] == undefined ||
            resp.size[0] == ''
              ? []
              : resp.size,
          userid: resp.userid,
          description: resp.description,
          editorContent: resp.editorContent,
          status: resp.status,
          discount_period: resp.discount_period,
          price_currency: resp.price_currency,
          amount: resp.amount,
          discount: resp.discount,
          availableCurrency: resp.availableCurrency,
          faqs: resp.faqs,
          returns: resp.returns,
          attachment: resp.attachment,
          files2,
          videos2,
          sub_category: resp.sub_category,
          address: resp.address,
          country: resp.country,
          state: resp.state,
          city: resp.city,
          zipcode: resp.zipcode,
        });
      },
      (error) => {}
    );
  }

  handleCancel() {
    history.push({
      pathname: '/market-product-faq',
      state: this.state.product_id,
    });
  }

  handleSkip() {
    this.setState({
      returns: [
        { title: '', no_of_days: '', no_of_cancel_days: '', description: '' },
      ],
    });
    history.push({
      pathname: '/market-publish-first-time',
      state: { ...this.state, attachment: this.state.attachment },
    });
  }

  handleChange(e, data, key) {
    let { delivery_data } = this.state;
    if (e.target.checked) {
      delivery_data.push(data);
    } else {
      const found = delivery_data.find(
        (element) =>
          element.amount === data.amount && element.currency === data.currency
      );
      if (found !== undefined)
        this.setState({
          delivery_data: [],
        });
      delivery_data = [];
    }
    if (delivery_data.length > 1) {
      alertBox(true, 'Kindly choose one delivery item');
    } else {
      this.setState({
        delivery_data,
      });
    }
  }

  submit = async (e, t) => {
    e.preventDefault();
    const status = t === 1 ? this.state.status : 'draft';
    let err = [];
    if (this.state.delivery_data.length === 0)
      err.push(
        'Kindly choose the one delivery data if data is empty, kindly add that using above mention link'
      );
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let hashsize = '';
      if (this.state.size.length > 0) {
        hashsize = this.state.size.join(',');
      }

      this.setState((prevState) => {
        const returns = [...prevState.returns];
        const updatedReturn = { ...returns[0], title: 'Shipment' };
        returns[0] = updatedReturn;
        return { returns };
      });

      const formData = {
        price_currency: this.state.price_currency,
        amount: this.state.amount,
        discount: this.state.discount,
        availableCurrency: this.state.availableCurrency,
        returns: JSON.stringify(this.state.returns),
        faqs: JSON.stringify(this.state.faqs),
        discount_period: this.state.discount_period,
        product_id: this.state.product_id,
        title: this.state.title,
        condition: this.state.condition,
        category: this.state.category,
        target_audience: this.state.target_audience,
        stock: this.state.stock,
        size: hashsize,
        userid: this.state.userid,
        description: this.state.description,
        editorContent: this.state.editorContent,
        status,
        files2: JSON.stringify(this.state.files2),
        videos2: JSON.stringify(this.state.videos2),
        sub_category: this.state.sub_category,
        address: this.state.address,
        country: this.state.country,
        state: this.state.state,
        city: this.state.city,
        zipcode: this.state.zipcode,
        delivery_data: this.state.delivery_data,
      };
      update(formData).then(
        async (resp) => {
          if (t === 1) {
            alertBox(true, 'Shipment and returns has been saved!', 'success');
            history.push({
              pathname: '/market-publish-first-time',
              state: { ...this.state, attachment: resp.attachment },
            });
          } else {
            alertBox(
              true,
              'Shipment and returns draft has been saved!',
              'success'
            );
            history.push({
              pathname: '/market-product-returns',
              state: this.state.product_id,
            });
          }
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Product Shipment and Returns </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  <div className="form-group">
                    <div className="left">
                      <strong>
                        Product Shipment and Returns Delivery Details
                      </strong>
                    </div>
                    <div className="right">
                      <table className="table">
                        <th />
                        <th>Title</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th />
                        {this.state.delivery_details.length > 0 ? (
                          this.state.delivery_details.map((data, key) => (
                            <tr key={data._id}>
                              <td>
                                <input
                                  type="checkbox"
                                  className={`checkbox-1 ${key}`}
                                  onChange={(e) =>
                                    this.handleChange(e, data, key)
                                  }
                                />
                              </td>
                              <td>{data.title}</td>
                              <td>{data.country}</td>
                              <td>{data.state}</td>
                              <td>{data.city}</td>
                              <td>{data.type}</td>
                              <td>
                                {data.type === 'paid' ? data.amount : null}
                              </td>
                              <td>
                                {data.type === 'paid' ? data.currency : null}
                              </td>
                              <td>
                                <Link to="/market-delivery"> Change </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}>
                              <p>
                                {' '}
                                Kindly add atleast one delivery details{' '}
                                <Link to="/market-delivery"> here </Link>{' '}
                              </p>
                            </td>
                          </tr>
                        )}
                      </table>
                      <table className="table table-bordered">
                        {this.state.returns.map((v, i) => (
                          <tr key={i}>
                            <td>
                              {i === 0 && (
                                <div>
                                  <label htmlFor=""> Title</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Enter the Title"
                                    name="title"
                                    className="form-control w-100"
                                    disabled
                                    value="Shipment"
                                  />
                                </div>
                              )}
                              {i > 0 && (
                                <div>
                                  <label htmlFor=""> Title</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Enter the Title"
                                    name="title"
                                    className="form-control w-100"
                                    onChange={(e) => this.handleReturn(i, e)}
                                    value={this.state.returns[i].title}
                                  />
                                </div>
                              )}
                            </td>
                            <td>
                              <label htmlFor=""> No of business days</label>
                              <input
                                type="number"
                                required
                                placeholder="Enter the No of days"
                                name="no_of_days"
                                className="form-control w-100"
                                onChange={(e) => this.handleReturn(i, e)}
                                value={this.state.returns[i].no_of_days}
                              />
                            </td>
                            <td>
                              <label htmlFor="">
                                {' '}
                                No of cancelation due days
                              </label>
                              <input
                                type="number"
                                required
                                placeholder="Enter the No of cancelation due days"
                                name="no_of_cancel_days"
                                className="form-control w-100"
                                onChange={(e) => this.handleReturn(i, e)}
                                value={this.state.returns[i].no_of_cancel_days}
                              />
                            </td>
                            <td>
                              <label htmlFor=""> Description </label>
                              <textarea
                                required
                                placeholder="Enter the Description"
                                name="description"
                                className="form-control w-100"
                                onChange={(e) => this.handleReturn(i, e)}
                                value={this.state.returns[i].description}
                              >
                                {' '}
                              </textarea>
                            </td>
                            <td>
                              {i > 0 && (
                                <span
                                  className="removeRow"
                                  onClick={() => this.removeReturn(i)}
                                >
                                  <i className="fa fa-times" />
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </table>
                      <Button
                        type="button"
                        onClick={this.addReturn}
                        size="compact"
                        variant="primary-outline"
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </div>
                  </div>

                  {/* BEGIN :: FORM GROUP */}
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    {/* <Button onClick={this.handleSkip} className="btn-2"> Skip </Button> */}
                    <A href="/market-product-returns">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-product-returns">
                      <Button className="btn-1"> Save & Continue </Button>
                    </A>
                  </div>
                </form>
              </div>
              {/* END :: FORM HOLDER 1 */}
            </div>
            {/* END :: RIGHT */}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductReturnAndWarranty;
