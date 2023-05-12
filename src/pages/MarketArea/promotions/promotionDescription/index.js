import React from 'react';
import { NavLink } from 'react-router-dom';
import edjsHTML from 'editorjs-html';
import EditorJs from 'react-editor-js';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import {
  getPromotion,
  promotionUpdateDescription,
} from '../../../../http/promotion-calls';
import { history } from '../../../../store';
import Spinner from '../../../../components/Spinner';
import { EDITOR_JS_TOOLS } from '../../../MyBlogs/tools';

require('../../_styles/market-area.scss');

class PromotionDescription extends React.Component {
  constructor(props) {
    super(props);
    const edjsParser = edjsHTML({ table: this.convertDataToHtml });
    this.state = {
      edjsParser,
      data: {},
      loading: true,
      text: '',
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  fetchData() {
    const formData = {
      promotion_id: this.state.promotion_id,
    };
    getPromotion(formData).then(
      async (res) => {
        if (res.editorContent) {
          const edc = JSON.parse(res.editorContent);
          this.setState({
            data: edc,
            loading: false,
          });
        }
        this.setState(res);
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
    let data = '';
    const edata = await this.editor.save();
    if (edata.blocks.length <= 0) {
      err.push('Description is required');
    }

    data = this.state.edjsParser.parse(edata);
    data = data.join(' ');
    if (parseInt(data.length) > 1200) {
      err.push(' Product description should be at least 1200 characters long ');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      data = this.state.edjsParser.parse(edata);
      data = data.join(' ');
      const formData = {
        description: data,
        editorContent: JSON.stringify(edata),
        promotion_id: this.state.promotion_id,
        loading: false,
      };
      promotionUpdateDescription(formData).then(
        async (res) => {
          if (t === 1) {
            history.push({
              pathname: '/market-promotion-pricing',
              state: { promotion_id: res._id },
            });
          } else {
            history.push({
              pathname: '/market-promotion-description',
              state: { promotion_id: res._id },
            });
          }
          alertBox(
            true,
            'Promotion Description Updated Successfully!',
            'success'
          );
        },
        (error) => {
          alertBox(true, 'Error Update Promotion!');
        }
      );
    }
  };

  handleCancel() {
    history.push({
      pathname: '/market-promotion-overview',
      state: { promotion_id: this.state.promotion_id },
    });
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <div className="side-menu-1">
                <div className="holder">
                  <NavLink className="step" to="/market-promotion-overview">
                    {' '}
                    Promotion Overview{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-pricing">
                    {' '}
                    Pricing{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-banner">
                    {' '}
                    Banner{' '}
                  </NavLink>
                </div>
              </div>
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Promotion Description </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor=""> Promotion Description </label>
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
                    <div className="input-condition-info grid-2">
                      <p>
                        {' '}
                        Promotion description should be at least 1200 characters
                        long{' '}
                      </p>
                      <p> {this.state.text.length}/1200 max </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-promotion-description">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-promotion-description">
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

export default PromotionDescription;
