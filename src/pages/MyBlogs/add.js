import { ContentState, EditorState } from 'draft-js';
import editorjsHTML from 'editorjs-html';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorJs from 'react-editor-js';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import FileBrowse from '../../components/FormFields/FileBrowse';
import Spinner from '../../components/Spinner';
import {
  createBlog,
  getBlogCategories,
  getBlogDraft,
  getSinglePost,
} from '../../http/blog-calls';
import { uploadFile } from '../../http/http-calls';
import { EDITOR_JS_TOOLS } from './tools';
import { convertDataToHtml } from '../../globalFunctions';

require('./styles.scss');

class AddBlog extends React.Component {
  constructor(props) {
    super(props);
    // const edjsParser = editorjsHTML();
    const edjsParser = editorjsHTML({
      table: convertDataToHtml,
      checklist: convertDataToHtml,
      image: convertDataToHtml,
      raw: convertDataToHtml,
      warning: convertDataToHtml,
    });

    const html =
      '{"time":1612692654392,"blocks":[{"type":"paragraph","data":{"text":"sdff"}},{"type":"paragraph","data":{"text":"<b>sdfsdf</b>"}}],"version":"2.19.1"}';
    const contentBlock = htmlToDraft(html);
    this.editor = React.createRef();

    let editor = null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      editor = editorState;
    }
    this.state = {
      id: 0,
      data: '',
      loading: true,
      categories: [],
      editorState: editor,
      editorInstance: null,
      edjsParser,
      refreshing: false,
      filter: '',
      title: '',
      post_image: null,
      edit_image: null,
      latestpost: {},
      paymentType: 'free',
      currentTab: 0,
      tags: [],
      currency: '',
      amount: '',
      category2: '',
      category: '',
      categoryId: '',
      suggestions: [
        { id: 3, name: 'Bananas' },
        { id: 4, name: 'Mangos' },
        { id: 5, name: 'Lemons' },
        { id: 6, name: 'Apricots' },
      ],
      price_mul: [],
    };

    this.tagRef = React.createRef();
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  tagChange = (val) => {};

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    getBlogCategories().then(
      (resp) => {
        this.setState({
          categories: resp,
        });
      },
      (err) => {}
    );
    try {
      if (this.props.match.params.id != undefined) {
        this.getData();
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id != this.props.match.params.id) {
      try {
        if (this.props.match.params.id != undefined) {
          this.getData();
        } else {
          this.setState({
            loading: false,
          });
        }
      } catch (error) {
        this.setState({
          loading: false,
        });
      }
    }
  }

  getData = () => {
    getSinglePost({
      postid: this.props.match.params.id,
      slug: this.props.match.params.id,
    }).then(
      (res) => {
        const post = res.post[0];
        this.setState(
          {
            id: post._id,
            title: post.subject,
            draft: post,
            data: JSON.parse(post.editorContent),
            // price_mul: post.price_extra ? JSON.parse(post.price_extra) : [],
            price_mul:
              typeof post.price_extra === 'object' ? post.price_extra : [],

            text: post.text,
            amount: post.price,
            tags:
              post.hashtags == undefined ||
              post.hashtags[0] == undefined ||
              post.hashtags[0] == ''
                ? []
                : post.hashtags,
            currency: post.preferedCurrency,
            category: post.category,
            categoryId: post.categoryId,
            paymentType: post.paidPost ? 'paid' : 'free',
            edit_image:
              post.contents[0] == undefined
                ? null
                : post.contents[0].content_url,
            category2: `${post.category}^${post.categoryId}`,
          },
          () => {
            setTimeout(() => {
              this.setState({
                loading: false,
              });
            }, 1000);
          }
        );
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  getDraft = () => {
    getBlogDraft().then(
      (post) => {
        this.setState(
          {
            id: post._id,
            title: post.subject,
            draft: post,
            data: JSON.parse(post.editorContent),
            text: post.text,
            amount: post.price,
            tags:
              post.hashtags == undefined ||
              post.hashtags[0] == undefined ||
              post.hashtags[0] == ''
                ? []
                : post.hashtags,
            currency: post.preferedCurrency,
            category: post.category,
            categoryId: post.categoryId,
            paymentType: post.paidPost ? 'paid' : 'free',
            edit_image:
              post.contents[0] == undefined
                ? null
                : post.contents[0].content_url,
            category2: `${post.category}^${post.categoryId}`,
          },
          () => {
            setTimeout(() => {
              this.setState({
                loading: false,
              });
            }, 1000);
          }
        );
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleInput = (e) => {
    let val = e.target.value;
    const { name } = e.target;
    if (name === 'title') {
      if (val === '' || val.trim() === '') {
        alertBox(true, 'Please enter the title');
      } else {
        if (val.length > 100) {
          val = val.substring(0, 100);
        }
        const regex = /^[a-zA-Z0-9-_.,&()/:;\s+=#]+$/;
        if (val.search(regex) === -1) {
          alertBox(
            true,
            'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis, plus, equal, hash'
          );
        }
      }
      this.setState({
        [name]: val,
      });
    }
    if (name === 'amount') {
      if (parseInt(val) < 0) {
        alertBox(true, 'Value must be greater than zero');
      } else {
        const split = val.split('.');
        let isValid = false;
        if (split[0] !== undefined) {
          const myArray1 = Array.from(split[0]);
          myArray1.forEach((data) => {
            if (parseInt(data) > 0) {
              isValid = true;
            }
          });
        }
        if (split[1] !== undefined) {
          const myArray2 = Array.from(split[1]);
          myArray2.forEach((data) => {
            if (parseInt(data) > 0) {
              isValid = true;
            }
          });
        }
        if (!isValid) {
          alertBox(true, 'Price must be greater than zero');
        }
      }
    }
    if (name === 'currency') {
      const find_same_currency = this.state.price_mul.filter(
        (i) => i != null && i.prefered_currency === val
      );
      if (find_same_currency.length > 0) {
        alertBox(true, 'Please choose other currency,Already have the price');
      }
    }
    this.setState({
      [name]: val,
    });
  };

  handleRemove = (e) => {
    const name = e.target.getAttribute('name');
    this.setState({
      [name]: null,
    });
  };

  handleFile = (name, type, value) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        const reader = new FileReader();
        // it's onload event and you forgot (parameters)
        reader.onload = function (e) {
          const image = document.getElementById(`${name}_preview`);
          image.src = e.target.result;
        };
        // you have to declare the file loading
        reader.readAsDataURL(value);
      }
    );
  };

  handleCheckbox = (e) => {
    const { name } = e.target;
    if (e.target.checked) {
      const val = e.target.value;
      this.setState({
        [name]: val,
      });
    } else {
      const val = e.target.getAttribute('uncheckedValue');
      this.setState({
        [name]: val,
      });
    }
  };

  handleCategory = (e) => {
    const val = e.target.value;
    const v = val.split('^');
    this.setState({
      category2: val,
      category: v[0],
      categoryId: v[1],
    });
  };

  dataChange = (e) => {
    console.log(e);
  };

  submit = async (e, t) => {
    e.preventDefault();
    const edata = await this.editor.save();
    const err = [];
    let status = 'active';
    if (t == 1) {
      if (this.state.title == '') {
        err.push('Title is required');
      }
      const regex = /^[a-zA-Z0-9-_.,&()/:;\s+=#]+$/;
      if (this.state.title.search(regex) === -1) {
        err.push(
          'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis, plus, equal, hash'
        );
      }
      if (this.state.title.length > 100 || this.state.title.length < 4) {
        err.push('Title is required with in 4 to 100 charecters ');
      }
      if (this.state.category == '') {
        err.push('Category is required');
      }

      if (edata.blocks.length <= 0) {
        err.push('Content is required');
      }

      if (this.state.post_image == null && this.state.edit_image == null) {
        err.push('Main Image is required');
      }
    } else {
      if (this.state.title == '') {
        err.push('Title is required');
      }
      status = 'draft';
    }
    if (this.state.paymentType == 'paid' && this.state.currency === '') {
      err.push('Currency is required');
    }
    const find_same_currency = this.state.price_mul.filter(
      (i) => i != null && i.prefered_currency === this.state.currency
    );
    if (find_same_currency.length > 0) {
      err.push('Please choose other currency,Already have the price');
    }

    const find_zero_val =
      this.state.price_mul !== undefined
        ? this.state.price_mul.filter(
            (i) =>
              i != null &&
              (i.prefered_price === '0' || parseInt(i.prefered_price) < 0)
          )
        : [];
    if (find_zero_val.length > 0) {
      err.push('Please Enter the amount');
    }

    const find_currency_val =
      this.state.price_mul !== undefined
        ? this.state.price_mul.filter(
            (i) => i != null && i.prefered_currency === ''
          )
        : [];
    if (find_currency_val.length > 0) {
      err.push('Please Choose the currency');
    }

    if (
      (this.state.amount === 0 || parseInt(this.state.amount) < 0) &&
      this.state.paymentType == 'paid'
    ) {
      err.push('Price must be greater than zero');
    }
    if (this.state.amount && this.state.amount !== 0) {
      const amount = this.state.amount.toString();
      const split = amount.split('.');
      let isValid = false;
      if (split[0] !== undefined) {
        const myArray1 = Array.from(split[0]);
        myArray1.forEach((data) => {
          if (parseInt(data) > 0) {
            isValid = true;
          }
        });
      }
      if (split[1] !== undefined) {
        const myArray2 = Array.from(split[1]);
        myArray2.forEach((data) => {
          if (parseInt(data) > 0) {
            isValid = true;
          }
        });
      }
      if (!isValid) {
        err.push('Price must be greater than zero');
      }
    }

    if (
      this.state.paymentType == 'paid' &&
      (this.state.amount == 0 || parseInt(this.state.amount) < 0)
    ) {
      err.push('Price must be greater than zero');
    }

    const filter_price_zero = this.state.price_mul.filter(
      (item, i) => item.prefered_price == 0 || parseInt(item.prefered_price) < 0
    );
    if (filter_price_zero.length > 0) {
      err.push('Price must be greater than zero');
    }
    let data = this.state.edjsParser.parse(edata);
    data = data.join(' ');
    const count_word = data.length;
    if (count_word > 30000) {
      err.push('Maximum length of content is 1500');
    }
    let index = 0;
    this.state.tags.forEach((tagitem) => {
      index++;
      const regex = /^[a-zA-Z]+$/;
      if (tagitem.search(regex) === -1 && index == this.state.tags.length) {
        err.push(
          `Only allow alphabets in tags` + ` remove this tag item ${tagitem}`
        );
      }
      if (tagitem.length > 50 && index == this.state.tags.length) {
        err.push('Keywords Tag must be with in 50 charectors');
      }
    });
    if (this.state.tags.length > 30) {
      err.push('Keywords Tag must be with in 30 Tags');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let hashtags = '';
      const postImages = this.state.post_image;
      if (this.state.tags.length > 0) {
        hashtags = this.state.tags.join(',');
      } else {
        hashtags = '';
      }

      const formData = new FormData();
      if (this.state.id != 0) {
        formData.append('id', this.state.id);
      }
      formData.append('postImgs', postImages);
      formData.append('text', data);
      formData.append('editorContent', JSON.stringify(edata));
      formData.append('subject', this.state.title);
      formData.append('hashtags', hashtags);
      formData.append('paymentType', this.state.paymentType);
      if (this.state.amount !== null && this.state.amount !== '') {
        formData.append('amount', this.state.amount);
      }
      formData.append('currency', this.state.currency);
      formData.append('category', this.state.category);
      formData.append('categoryId', this.state.categoryId);
      formData.append('price_extra', JSON.stringify(this.state.price_mul));
      formData.append('status', status);
      switchLoader('Your post is being updated...');
      createBlog(formData).then(
        async (resp) => {
          switchLoader();
          if (t == 1) {
            window.location.href = '/blogs';
          } else {
            alertBox(true, 'Draft has been saved!', 'success');
            this.props.history.push(`/edit-blog/${resp.post.slug}`);
          }
        },
        (error) => {
          switchLoader();
        }
      );
    }
  };

  uploadImageCallBack = (file) =>
    new Promise((resolve, reject) => {
      uploadFile({ file }).then(
        (resp) => {
          const out = { data: { link: resp.file.filePath } };
          resolve(out);
        },
        (error) => {
          reject(error);
        }
      );
    });
  // return new Promise(
  //   (resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', 'https://api.imgur.com/3/image');
  //     xhr.setRequestHeader('Authorization', 'Client-ID ##clientid##');
  //     const data = new FormData();
  //     data.append('image', file);
  //     xhr.send(data);
  //     xhr.addEventListener('load', () => {
  //       const response = JSON.parse(xhr.responseText);
  //       resolve(response);
  //     });
  //     xhr.addEventListener('error', () => {
  //       const error = JSON.parse(xhr.responseText);
  //       console.log(error)
  //       reject(error);
  //     });
  //   }
  // );

  review = () => {};

  addPrice = () => {
    const optins = this.state.price_mul;
    optins.push({ prefered_price: '', prefered_currency: '' });
    this.setState({ price_mul: optins });
  };

  removePrice = (i) => {
    const option = this.state.price_mul;
    delete option[i];
    this.setState({ price_mul: option });
  };

  handleextra = (i, e) => {
    const temp = this.state.price_mul;
    const { name } = e.target;
    const val = e.target.value;
    let err = 0;
    if (name === 'prefered_price' || parseInt(val) < 0) {
      if (val === 0) {
        alertBox(true, 'Price must be greater than zero');
      }
      const split = val.split('.');
      let isValid = false;
      if (split[0] !== undefined) {
        const myArray1 = Array.from(split[0]);
        myArray1.forEach((data) => {
          if (parseInt(data) > 0) {
            isValid = true;
          }
        });
      }
      if (split[1] !== undefined) {
        const myArray2 = Array.from(split[1]);
        myArray2.forEach((data) => {
          if (parseInt(data) > 0) {
            isValid = true;
          }
        });
      }
      if (!isValid) {
        alertBox(true, 'Price must be greater than zero');
      }
    }
    if (name == 'prefered_currency') {
      const find_same_currency = temp.filter(
        (i) =>
          i != null &&
          (i.prefered_currency == val || this.state.currency == val)
      );
      if (find_same_currency.length > 0) {
        err = 1;
        alertBox(true, 'Please choose other currency,Already have the price');
      }
    }
    if (err == 0) {
      temp[i][name] = val;
      this.setState({ price_mul: temp });
    }
  };

  handleTagKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value !== '' && e.target.value.trim() !== '') {
        const regex = /^[a-zA-Z]+$/;
        if (e.target.value.search(regex) === -1) {
          alertBox(true, 'Only allow alphabets');
        } else {
          const tags = [].concat(this.state.tags, e.target.value);
          this.setState({ tags });
          this.tagRef.current.value = '';
        }
      }
    }
  }

  onDelete(i) {
    const temp = this.state.tags;
    temp.splice(i, 1);
    this.setState({ tags: temp });
  }

  render() {
    return (
      // <!-- Wall container -->
      <div className="addBlogPage">
        <div className="container my-wall-container mrgn_bm_50">
          <div className="row mt-2">
            {/* <!-- left column --> */}

            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-border center-column big mx-auto p-4 addBlogs">
              <h1>Add an Article</h1>
              <form onSubmit={(e) => this.submit(e, 1)} method="post">
                <div className="form-group">
                  <label>Title of the Article</label>
                  <input
                    maxLength="60"
                    type="text"
                    placeholder="Alpha numeric"
                    name="title"
                    value={this.state.title}
                    className="form-control"
                    onChange={this.handleInput}
                  />
                </div>

                <div className="form-group">
                  <label>Content</label>
                  {/* <Editor
          editorState={this.state.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        /> */}
                  {/* <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}    
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      /> */}
                  {this.state.loading ? (
                    <Spinner />
                  ) : (
                    <EditorJs
                      instanceRef={(instance) => {
                        this.editor = instance;
                      }}
                      data={this.state.data}
                      tools={EDITOR_JS_TOOLS}
                    />
                  )}
                </div>

                <div className="form-group">
                  <div className="custom-control custom-checkbox pl-0">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="defaultCheck1"
                      name="paymentType"
                      value="paid"
                      // eslint-disable-next-line react/no-unknown-property
                      uncheckedValue="free"
                      checked={this.state.paymentType == 'paid'}
                      onChange={this.handleCheckbox}
                    />

                    <label
                      className="custom-control-label pt-1"
                      htmlFor="defaultCheck1"
                    >
                      Make this a paid article
                    </label>
                  </div>
                </div>
                {this.state.paymentType == 'paid' && (
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="Amount"
                          name="amount"
                          className="form-control"
                          value={this.state.amount}
                          onChange={this.handleInput}
                        />
                        <small className="text-secondary">
                          Enter how much you want to charge for your content
                        </small>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label>Currency</label>
                        <select
                          type="text"
                          placeholder="Amount"
                          className="form-control"
                          name="currency"
                          value={this.state.currency}
                          onChange={this.handleInput}
                        >
                          <option value="">Choose</option>
                          <option>BTC</option>
                          <option>ETH</option>
                          <option>LTC</option>
                          <option>XRP</option>
                          <option>BCH</option>
                          <option>USDT</option>
                          <option>DASH</option>
                          <option>USD</option>
                          <option>EUR</option>
                          <option>INR</option>
                        </select>
                        <small className="text-secondary">
                          Select a currency you want to charge for your content
                        </small>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <span
                        onClick={() => this.addPrice()}
                        className="addPrice"
                      >
                        <i
                          className="fa fa-plus"
                          title="Add Price with multiple currency"
                        />
                        <p>Add another currency</p>
                      </span>
                    </div>
                  </div>
                )}
                {this.state.paymentType == 'paid' &&
                  this.state.price_mul.length > 0 &&
                  this.state.price_mul.map(
                    (item, i) =>
                      item != null && (
                        <div className="row" key={i}>
                          <div className="col-md-5">
                            <div className="form-group">
                              <strong>Price</strong>
                              <input
                                type="number"
                                placeholder="Amount"
                                name="prefered_price"
                                className="form-control"
                                value={this.state.price_mul[i].prefered_price}
                                onChange={(e) => this.handleextra(i, e)}
                                required
                              />
                              <small className="text-secondary">
                                Enter how much you want to charge for your
                                content
                              </small>
                            </div>
                          </div>
                          <div className="col-md-5">
                            <div className="form-group">
                              <strong>Currency</strong>
                              <select
                                type="text"
                                placeholder="Amount"
                                className="form-control"
                                name="prefered_currency"
                                value={
                                  this.state.price_mul[i].prefered_currency
                                }
                                onChange={(e) => this.handleextra(i, e)}
                                required
                              >
                                <option value="">Choose</option>
                                <option>BTC</option>
                                <option>ETH</option>
                                <option>LTC</option>
                                <option>XRP</option>
                                <option>BCH</option>
                                <option>USDT</option>
                                <option>DASH</option>
                                <option>USD</option>
                                <option>EUR</option>
                                <option>INR</option>
                              </select>

                              <small className="text-secondary">
                                Select a currency you want to charge for your
                                content
                              </small>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <span className="deleteIcon text-center">
                              <i
                                className="fa fa-times"
                                onClick={() => this.removePrice(i)}
                              />
                            </span>
                          </div>
                        </div>
                      )
                  )}
                {/* {
                          this.state.paymentType == 'paid' &&
                          <div className="row">
                            <div className='col-md-12'>
                            <div className='pull-right'>
                              <Button type="button" onClick={() => this.addPrice()} size="compact" variant="primary-outline" className="mr-1">
                                <span>Add Currency <i className="fa fa-plus"></i></span>
                              </Button>
                            </div>
                            </div>
                          </div>
                        } */}

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group newCreatebox_banner">
                      <label>Main Image</label>
                      <FileBrowse
                        name="post_image"
                        page="blogs"
                        fileChange={this.handleFile}
                        value={this.state.post_image}
                        accept="image"
                      />
                      <small className="text-secondary">
                        Select the main image for your article
                      </small>
                      {this.state.post_image == null &&
                        this.state.edit_image != null && (
                          <div className="uploadedImage">
                            <img
                              src={this.state.edit_image}
                              id="post_image_preview"
                            />
                          </div>
                        )}

                      {this.state.post_image != null && (
                        <div className="uploadedImage">
                          <img
                            src={this.state.post_image.tmp_name}
                            id="post_image_preview"
                          />
                          <div
                            className="fa fa-times remove"
                            name="post_image"
                            onClick={this.handleRemove}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        type="text"
                        name="category"
                        className="form-control"
                        value={this.state.category2}
                        onChange={this.handleCategory}
                      >
                        <option value="">Select</option>
                        {this.state.categories.map((e, i) => (
                          <option
                            value={`${e.category}^${e._id}`}
                            selected={e.category == this.state.category}
                            key={i}
                          >
                            {e.category}
                          </option>
                        ))}
                      </select>
                      <small className="text-secondary">
                        Select one related
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-block">
                    <div className="">
                      {this.state.tags.map((tag, i) => (
                        <span key={i}>
                          {tag}{' '}
                          <i
                            className="fa fa-times"
                            onClick={() => this.onDelete(i)}
                          />
                        </span>
                      ))}
                    </div>
                    <input
                      onKeyDown={this.handleTagKeyDown.bind(this)}
                      ref={this.tagRef}
                      type="text"
                      placeholder="Enter tags"
                      name="title"
                      className="new-form-control w-100"
                    />
                  </div>
                  <small className="pt-1 text-secondary pull-right">
                    30 max
                  </small>
                </div>
                <div className="form-group text-center">
                  {this.props.match.path !== '/edit-blog/:id' ? (
                    <Button
                      type="button"
                      onClick={(e) => this.submit(e, 0)}
                      variant="secondaryBtn"
                      size="big me-2"
                    >
                      Save Draft
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={(e) => this.props.history.push('/blogs')}
                      variant="secondaryBtn"
                      size="big me-2"
                    >
                      Cancel
                    </Button>
                  )}

                  <Button variant="primaryBtn" size="big">
                    {this.props.match.params.id == undefined
                      ? 'Publish'
                      : 'Save'}
                  </Button>
                  {/* <Button type="button" variant="primary-outline" className="ml-2" size="big" onClick={(e) => this.review(e)}>Review</Button> */}
                </div>
              </form>
            </div>
            {/* <div className="col-sm empty-container-with-out-border center-column">
                  Twitter Tweets
                </div> */}
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}

            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AddBlog;
