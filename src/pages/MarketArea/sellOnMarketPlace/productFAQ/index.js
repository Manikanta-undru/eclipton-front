import React from 'react';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import { get, update } from '../../../../http/product-calls';
import SideMenu1 from '../../_widgets/sideMenu1';
import Button from '../../../../components/Button';
import { history } from '../../../../store';

require('../../_styles/market-area.scss');

class MarketProductFAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: this.props.location.state,
      faqs: [{ question: '', answer: '' }],
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  handleFaq = (i, e) => {
    const { name } = e.target;
    const temp = this.state.faqs;
    const val = e.target.value;
    temp[i][name] = val;
    this.setState({
      faqs: temp,
    });
  };

  addFaq = () => {
    const temp = this.state.faqs;
    temp.push({ question: '', answer: '' });
    this.setState({
      faqs: temp,
    });
  };

  removeFaq = (i) => {
    const temp = this.state.faqs;
    delete temp[i];
    this.setState({
      faqs: temp,
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
        const resp = res[0];
        const files2 = [];
        const videos2 = [];
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

        console.log(resp, 'resp-faq');
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
      pathname: '/market-product-gallery-preview',
      state: this.state.product_id,
    });
  }

  handleSkip() {
    this.setState({
      faqs: [{ question: '', answer: '' }],
    });
    history.push({
      pathname: '/market-product-returns',
      state: this.state.product_id,
    });
  }

  submit = async (e, t) => {
    e.preventDefault();
    const status = t === 1 ? this.state.status : 'draft';
    let err = [];
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let hashsize;
      if (this.state.size.length > 0) {
        hashsize = this.state.size.join(',');
      } else {
        hashsize = '';
      }
      const formData = {
        price_currency: this.state.price_currency,
        amount: this.state.amount,
        discount: this.state.discount,
        faqs: JSON.stringify(this.state.faqs),
        returns: JSON.stringify(this.state.returns),
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
      };
      update(formData).then(
        async (resp) => {
          if (t === 1) {
            alertBox(true, 'FAQ has been saved!', 'success');
            history.push({
              pathname: '/market-product-returns',
              state: this.state.product_id,
            });
          } else {
            alertBox(true, 'FAQ draft has been saved!', 'success');
            history.push({
              pathname: '/market-product-faq',
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
                    <h2> Create Your Product FAQ </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  <div className="form-group">
                    <div className="left">
                      <strong>Product Faq</strong>
                    </div>
                    <div className="right">
                      <table className="table table-bordered">
                        {this.state.faqs.map((v, i) => (
                          <tr key={i}>
                            <td>
                              <label htmlFor=""> FAQ Question</label>
                              <textarea
                                required
                                placeholder="Enter the Question"
                                name="question"
                                className="form-control w-100"
                                onChange={(e) => this.handleFaq(i, e)}
                                value={this.state.faqs[i].question}
                              >
                                {' '}
                              </textarea>
                              <br />
                              <label htmlFor=""> FAQ Answer </label>
                              <textarea
                                required
                                placeholder="Enter the Answer"
                                name="answer"
                                className="form-control w-100"
                                onChange={(e) => this.handleFaq(i, e)}
                                value={this.state.faqs[i].answer}
                              >
                                {' '}
                              </textarea>
                            </td>
                            <td>
                              {i > 0 && (
                                <span
                                  className="removeRow"
                                  onClick={() => this.removeFaq(i)}
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
                        onClick={this.addFaq}
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
                    <A href="/market-product-faq">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <Button onClick={this.handleSkip} className="btn-2">
                      {' '}
                      Skip{' '}
                    </Button>
                    <A href="/market-product-faq">
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

export default MarketProductFAQ;
