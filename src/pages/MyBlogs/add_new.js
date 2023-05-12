import { ContentState, EditorState } from 'draft-js';
import editorjsHTML from 'editorjs-html';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorJs from 'react-editor-js';
import MultipleValueTextInput from 'react-multivalue-text-input';
import Multiselect from 'multiselect-react-dropdown';
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

require('./styles.scss');

class AddBlog extends React.Component {
  constructor(props) {
    super(props);
    const edjsParser = editorjsHTML();
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
      // currency: "",
      currency: [],
      amount: 0,
      category2: '',
      category: '',
      categoryId: '',
      selectedcurrency: [],
      suggestions: [
        { id: 3, name: 'Bananas' },
        { id: 4, name: 'Mangos' },
        { id: 5, name: 'Lemons' },
        { id: 6, name: 'Apricots' },
      ],
    };

    this.addItem = this.addItem.bind(this);
    this.reactTags = React.createRef();
  }

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  addItem(name, value) {
    const selectval = [];
    value.map((item) => {
      selectval.push(item.key);
    });
    console.log(value, 'value');

    console.log(selectval, 'selectval');
    this.setState({ [name]: selectval, [`selected${name}`]: value });
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  tagChange = (val) => {
    console.log(val);
  };

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    console.log(this.props.currentUser);
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
    getSinglePost({ postid: this.props.match.params.id }).then(
      (res) => {
        let op_cur;
        const post = res.post[0];
        const selectedcurrency = post.preferedCurrency;
        if (selectedcurrency.length > 0) {
          const options_curr = [];
          const currency_select = selectedcurrency[0].split(',');
          currency_select.map((item) => {
            const valobjcurr = { cat: 'Group 1', key: item };
            options_curr.push(valobjcurr);
          });
          op_cur = options_curr;
        } else {
          op_cur = [];
        }
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
            selectedcurrency: op_cur,
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
    const val = e.target.value;
    const { name } = e.target;
    console.log(`${name}:${val}`);
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
    console.log(value);
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
    console.log(name);
    if (e.target.checked) {
      const val = e.target.value;
      console.log(val);
      this.setState({
        [name]: val,
      });
    } else {
      const val = e.target.getAttribute('uncheckedValue');
      console.log(val);
      this.setState({
        [name]: val,
      });
    }
  };

  handleCategory = (e) => {
    const val = e.target.value;
    const v = val.split('^');
    console.log(v);
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

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let data = this.state.edjsParser.parse(edata);
      data = data.join(' ');
      const count_word = data.length;
      let hashtags;
      if (count_word > 1000) {
        err.push('Minimum length of content is 1000');
      }
      if (err.length > 0) {
        alertBox(true, err.join(', '));
      } else {
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
        formData.append('amount', this.state.amount);
        formData.append('currency', this.state.currency);
        formData.append('category', this.state.category);
        formData.append('categoryId', this.state.categoryId);
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
    }
  };

  uploadImageCallBack = (file) =>
    new Promise((resolve, reject) => {
      uploadFile({ file }).then(
        (resp) => {
          const out = { data: { link: resp.file.filePath } };
          console.log(out);
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
  //       console.log(response)
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

  render() {
    return (
      // <!-- Wall container -->
      <div className="addBlogPage">
        <div className="container my-wall-container mrgn_bm_50">
          <div className="row mt-2">
            {/* <!-- left column --> */}

            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-border center-column big mx-auto p-4 newCreateblog addBlogs">
              <h1>Add an Article</h1>
              <form onSubmit={(e) => this.submit(e, 1)} method="post">
                <div className="form-group">
                  <label>Title of the Article</label>
                  <input
                    maxLength="60"
                    type="text"
                    placeholder="Enter Title"
                    name="title"
                    value={this.state.title}
                    className="form-control"
                    onChange={this.handleInput}
                  />
                </div>

                <div className="form-group newaddEditor">
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
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="paymentType"
                      value="paid"
                      // eslint-disable-next-line react/no-unknown-property
                      uncheckedValue="free"
                      checked={this.state.paymentType == 'paid'}
                      onChange={this.handleCheckbox}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Make this article paid
                    </label>
                  </div>
                </div>
                {this.state.paymentType == 'paid' && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="number"
                          min="1"
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
                    <div className="col-md-6">
                      <div className="form-group multiSelect">
                        <label>Currency</label>
                        {/* <select type="text" placeholder="Amount" className="form-control" name="currency" value={this.state.currency}  onChange={this.handleInput} >
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
                                </select> */}
                        <Multiselect
                          displayValue="key"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={function noRefCheck() {}}
                          onSearch={function noRefCheck() {}}
                          onSelect={(key) => this.addItem('currency', key)}
                          selectedValues={this.state.selectedcurrency}
                          options={[
                            {
                              cat: 'Group 1',
                              key: 'BTC',
                            },
                            {
                              cat: 'Group 1',
                              key: 'ETH',
                            },
                            {
                              cat: 'Group 1',
                              key: 'BNB',
                            },
                            {
                              cat: 'Group 2',
                              key: 'LTC',
                            },
                            {
                              cat: 'Group 2',
                              key: 'XRP',
                            },
                            {
                              cat: 'Group 2',
                              key: 'USDT',
                            },
                            {
                              cat: 'Group 2',
                              key: 'EUR',
                            },
                            {
                              cat: 'Group 2',
                              key: 'INR',
                            },
                          ]}
                          // showArrow
                          placeholder="Select Preferred Currency"
                          showCheckbox
                        />
                        <small className="text-secondary">
                          Enter how much you want to charge for your content
                        </small>
                      </div>
                    </div>
                  </div>
                )}

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
                      <small className="pull-right smallText">
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
                      <small className="pull-right smallText">
                        Select one related
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group tagInput">
                  <label>Tags</label>
                  <MultipleValueTextInput
                    onItemAdded={(item, allItems) =>
                      this.setState({ tags: allItems })
                    }
                    onItemDeleted={(item, allItems) =>
                      this.setState({ tags: allItems })
                    }
                    label=""
                    maxLength="70"
                    values={this.state.tags}
                    name="item-input"
                    placeholder="Do not include #"
                  />

                  <small className="pull-right smallText">
                    Separate tags using commas
                  </small>
                </div>
                <div className="form-group text-right pt-4">
                  {this.props.match.params.id == undefined ? (
                    <Button
                      type="button"
                      onClick={(e) => this.submit(e, 0)}
                      variant="secondaryBtn"
                      size="big mr-2"
                    >
                      Save Draft
                    </Button>
                  ) : null}

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
