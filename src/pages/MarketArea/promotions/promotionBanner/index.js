import React from 'react';
import { NavLink } from 'react-router-dom';
import EditorJs from 'react-editor-js';
import edjsHTML from 'editorjs-html';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import {
  getPromotion,
  promotionUpdateBanner,
  promotionUpdateDescription,
} from '../../../../http/promotion-calls';
import { history } from '../../../../store';
import 'react-datepicker/dist/react-datepicker.css';
import { alertBox } from '../../../../commonRedux';
import { getAllProduct } from '../../../../http/product-calls';
import Spinner from '../../../../components/Spinner';
import { EDITOR_JS_TOOLS } from '../../../MyBlogs/tools';

require('../../_styles/market-area.scss');
require('./product-banner.scss');

class PromotionBanner extends React.Component {
  constructor(props) {
    super(props);
    const edjsParser = edjsHTML({ table: this.convertDataToHtml });
    this.state = {
      edjsParser,
      data: {},
      loading: true,
      text: '',
      banner_title: '',
      files: [],
      files2: [],
      products: [],
      imgs: '',
      buttons: [{ name: '', product_id: '' }],
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
    this.editor = React.createRef();
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleButton = (i, e) => {
    const { name } = e.target;
    const temp = this.state.buttons;
    const val = e.target.value;
    temp[i][name] = val;
    this.setState({
      buttons: temp,
    });
  };

  addButton = () => {
    const temp = this.state.buttons;
    temp.push({ name: '', product_id: '' });
    this.setState({
      buttons: temp,
    });
  };

  removeButton = (i) => {
    const temp = this.state.buttons;
    delete temp[i];
    this.setState({
      buttons: temp,
    });
  };

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  handleInput = async (e) => {
    const val = e.target.value;
    const { name } = e.target;

    if (name === 'banner_title') {
      this.setState({
        [name]: val,
      });
    } else {
      const edata = await this.editor.save();
      const data = this.state.edjsParser.parse(edata);
      const with_html_data = data.join(' ');
      const without_html_data = with_html_data.replace(/(<([^>]+)>)/gi, '');
      this.setState({
        text: without_html_data,
      });
    }
  };

  fetchData() {
    getAllProduct().then(
      async (resp) => {
        this.setState({
          products: resp,
        });
      },
      (error) => {}
    );

    const formData = {
      promotion_id: this.state.promotion_id,
    };
    getPromotion(formData).then(
      async (res) => {
        const files2 = [];
        if (res.attachment) {
          for (const x in res.attachment) {
            if (res.attachment[x].type === 'Video') {
              /* empty */
            } else {
              files2.push({
                src: res.attachment[x].src,
                type: 'Image',
              });
            }
          }
        }
        this.setState({
          files2,
        });
        if (res.editorContent) {
          let edc = JSON.parse(res.editorContent);
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

  handleCancel() {
    history.push({
      pathname: '/market-promotion-pricing',
      state: { promotion_id: this.state.promotion_id },
    });
  }

  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'enter',
    });
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'over',
    });
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    const dt = e.dataTransfer;
    const { files } = dt;
    this.handleFiles(files);
  };

  addToGallery = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    this.handleFiles(e.target.files);
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.querySelector('.droppedFiles');
    if (!el.contains(e.target)) {
      document.getElementById('gallery').click();
    }
  };

  fileToDataURL = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  readAsDataURL = (filesArray) =>
    Promise.all(filesArray.map(this.fileToDataURL));

  handleFiles = async (files) => {
    if (files[0] !== null && files[0].size < 2e6) {
      const temp = [...this.state.files, ...files];
      const f = await this.readAsDataURL(temp);
      this.setState({
        files: temp,
        imgs: f,
      });
    }
    if (files[0] !== null && files[0].size > 2e6) {
      alertBox(true, 'Please upload a file smaller than 2 MB');
    }
  };

  removeFile = (i, n = 1) => {
    let temp;
    if (n == 2) {
      temp = this.state.files2;
      temp.splice(i, 1);
      this.setState({
        files2: temp,
      });
    } else {
      temp = this.state.files;
      const temp2 = this.state.imgs;
      temp.splice(i, 1);
      temp2.splice(i, 1);
      this.setState({
        files: temp,
        imgs: temp2,
      });
    }
  };

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];
    const edata = await this.editor.save();
    let data;
    if (edata.blocks.length <= 0) {
      err.push('Description is required');
    }

    data = this.state.edjsParser.parse(edata);
    data = data.join(' ');
    if (parseInt(data.length) > 1200) {
      err.push(' Product description should be at least 1200 characters long ');
    }

    if (this.state.banner_title === '') err.push('Banner title is required');
    if (this.state.files.length === 0 && this.state.files2.length === 0) {
      err.push('At least one gallery image is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      data = this.state.edjsParser.parse(edata);
      data = data.join(' ');
      const des_formData = {
        description: data,
        editorContent: JSON.stringify(edata),
        promotion_id: this.state.promotion_id,
        loading: false,
      };
      promotionUpdateDescription(des_formData).then(
        async (res) => {},
        (err) => {}
      );
      const formData = {
        promotion_id: this.state.promotion_id,
        banner_title: this.state.banner_title,
        buttons: JSON.stringify(this.state.buttons),
        files2: JSON.stringify(this.state.files2),
        files: this.state.files,
      };
      if (this.state.promotion_id) {
        promotionUpdateBanner(formData).then(
          async (res) => {
            if (t === 1) {
              alertBox(true, 'Banner has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-success',
                state: { promotion_id: res._id },
              });
            } else {
              alertBox(true, 'Banner draft has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-banner',
                state: { promotion_id: res._id },
              });
            }
          },
          (error) => {
            alertBox(true, 'Error Update Promotion!');
          }
        );
      }
    }
  };

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
                    <h2> Create Your Promotional Banner </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}

                  <div className="form-group type-1">
                    <div className="left">
                      <strong>Banner Image</strong>
                    </div>
                    <div className="right">
                      <div
                        className={`uploadArea ${this.state.dragclass}`}
                        onDrop={(e) => this.handleDrop(e)}
                        onDragOver={(e) => this.handleDragOver(e)}
                        onDragEnter={(e) => this.handleDragEnter(e)}
                        onDragLeave={(e) => this.handleDragLeave(e)}
                        onClick={(e) => this.handleClick(e)}
                      >
                        <div className="droppedFiles">
                          {this.state.files2 !== undefined &&
                            this.state.files2.length > 0 &&
                            this.state.files2.map((f, i) => (
                              <div className="file" key={i}>
                                <img
                                  src={
                                    f.src != undefined
                                      ? f.src
                                      : this.state.imgs[i]
                                  }
                                />
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.removeFile(i, 2)}
                                />
                              </div>
                            ))}
                          {this.state.files.map((f, i) => (
                            <div className="file" key={i}>
                              <img src={this.state.imgs[i]} />
                              <i
                                className="fa fa-times"
                                onClick={() => this.removeFile(i)}
                              />
                            </div>
                          ))}
                        </div>
                        Browse / Drag and Drop
                      </div>
                      <input
                        type="file"
                        id="gallery"
                        onChange={this.addToGallery}
                        accept="image/jpg, image/jpeg, image/png"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="form-group type-1">
                    <label htmlFor=""> Banner Heading </label>
                    <div className="input-holder">
                      <input
                        type="text"
                        required
                        className="form-control field"
                        placeholder="Enter your promotion banner heading"
                        name="banner_title"
                        onChange={this.handleInput}
                        value={this.state.banner_title}
                      />
                    </div>
                    <div className="input-condition-info grid-2">
                      <p>
                        {' '}
                        Promotion banner heading should be at least 15
                        characters long, Promotion banner heading contain at
                        least 6 words.{' '}
                      </p>
                      <p> {this.state.banner_title.length}/80 max </p>
                    </div>
                  </div>
                  <br />
                  <div className="form-group type-1">
                    <label htmlFor=""> Banner Description </label>
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
                  <br />
                  <div className="form-group type-1">
                    <div className="left">
                      <strong> Banner Buttons</strong>
                    </div>
                    <div className="right">
                      <table className="table table-bordered">
                        {this.state.buttons.map((v, i) => (
                          <tr key={i}>
                            <td>
                              <label htmlFor=""> Name </label>
                              <input
                                type="text"
                                required
                                placeholder="Enter the button name"
                                name="name"
                                className="form-control w-100"
                                onChange={(e) => this.handleButton(i, e)}
                                value={this.state.buttons[i].name}
                              />
                            </td>
                            <td>
                              <label htmlFor="">
                                {' '}
                                Link button to below product lists{' '}
                              </label>
                              <select
                                name="product_id"
                                value={this.state.buttons[i].product_id}
                                required
                                className="form-control w-100"
                                onChange={(e) => this.handleButton(i, e)}
                              >
                                <option value="">---</option>
                                {this.state.products.map((products, key) => (
                                  <option
                                    key={key}
                                    value={products._id}
                                    selected={
                                      products._id ===
                                      this.state.buttons[i].product_id
                                    }
                                  >
                                    {products.title}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              {i > 0 && (
                                <span
                                  className="removeRow"
                                  onClick={() => this.removeButton(i)}
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
                        onClick={this.addButton}
                        size="compact"
                        variant="primary-outline"
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </div>
                  </div>
                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-promotion-banner">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-promotion-banner">
                      <Button
                        onClick={(e) => this.submit(e, 1)}
                        className="btn-1"
                      >
                        {' '}
                        Save & Continue{' '}
                      </Button>
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

export default PromotionBanner;
