import React from 'react';
import edjsHTML from 'editorjs-html';
import EditorJs from 'react-editor-js';
import Spinner from '../../../../components/Spinner';
import A from '../../../../components/A';
import SideMenu1 from '../../_widgets/sideMenu1';
import { EDITOR_JS_TOOLS } from '../../../MyBlogs/tools';
import { alertBox } from '../../../../commonRedux';
import { get, update } from '../../../../http/product-calls';
import Button from '../../../../components/Button';
import { history } from '../../../../store';

require('../../_styles/market-area.scss');
require('./product-description.scss');

class MarketProductOverview extends React.Component {
  constructor(props) {
    super(props);
    const edjsParser = edjsHTML({ table: this.convertDataToHtml });
    this.state = {
      edjsParser,
      data: {},
      loading: true,
      text: '',
      product_id: this.props.location.state,
    };
    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (this.state.product_id) {
      this.fetchData();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  fetchData() {
    const formData = {
      product_id: this.state.product_id,
    };
    get(formData).then(
      async (res) => {
        const resp = res[0];
        let edc = '';
        if (resp.editorContent) {
          edc = JSON.parse(resp.editorContent);
        }
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
          data: edc,
          editorContent: resp.editorContent,
          description: resp.description,
          status: resp.status,
          price_currency: resp.price_currency,
          amount: resp.amount,
          discount: resp.discount,
          discount_period: resp.discount_period,
          faqs: resp.faqs,
          returns: resp.returns,
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

  handleInput = async (e) => {
    const edata = await this.editor.save();
    const data = this.state.edjsParser.parse(edata);
    const with_html_data = data.join(' ');
    const without_html_data = with_html_data.replace(/(<([^>]+)>)/gi, '');
    this.setState({
      text: without_html_data,
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    let err = [];
    const edata = await this.editor.save();
    const status = t === 1 ? this.state.status : 'draft';
    if (edata.blocks.length <= 0) {
      err.push('Description is required');
    }

    let data = this.state.edjsParser.parse(edata);
    data = data.join(' ');
    if (parseInt(data.length) > 1200) {
      err.push(' Product description should be at least 1200 characters long ');
    }

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
        description: data,
        editorContent: JSON.stringify(edata),
        product_id: this.state.product_id,
        loading: false,
        title: this.state.title,
        condition: this.state.condition,
        category: this.state.category,
        target_audience: this.state.target_audience,
        stock: this.state.stock,
        size: hashsize,
        status,
        price_currency: this.state.price_currency,
        amount: this.state.amount,
        discount: this.state.discount,
        discount_period: this.state.discount_period,
        files2: JSON.stringify(this.state.files2),
        videos2: JSON.stringify(this.state.videos2),
        faqs: JSON.stringify(this.state.faqs),
        returns: JSON.stringify(this.state.returns),
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
            alertBox(true, 'Description has been saved!', 'success');
            history.push({
              pathname: '/market-product-pricing',
              state: this.state.product_id,
            });
          } else {
            alertBox(true, 'Description draft has been saved!', 'success');
            history.push({
              pathname: '/market-product-description',
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

  handleCancel() {
    history.push({
      pathname: '/market-product-overview',
      state: this.state.product_id,
    });
  }

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
                    <h2> Create Your Product Description </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <div className="input-holder">
                      {this.state.loading ? (
                        <Spinner />
                      ) : (
                        <EditorJs
                          instanceRef={(instance) => {
                            this.editor = instance;
                          }}
                          data={this.state.data}
                          onChange={this.handleInput}
                          tools={EDITOR_JS_TOOLS}
                        />
                      )}
                      {/* -- <textarea className="form-control field" placeholder="Enter your product description"></textarea> */}
                    </div>
                    <div className="input-condition-info pull-right">
                      <p> {this.state.text.length}/1200 max </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-product-description">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-product-description">
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

export default MarketProductOverview;
