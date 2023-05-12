import editorjsHTML from 'editorjs-html';
import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorJs from 'react-editor-js';
import MultipleValueTextInput from 'react-multivalue-text-input';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import FileBrowse from '../../components/FormFields/FileBrowse';
import { getSinglePost, updateBlog } from '../../http/blog-calls';
import { uploadFile } from '../../http/http-calls';
import { EDITOR_JS_TOOLS } from './tools';

require('./styles.scss');

class EditBlog extends React.Component {
  constructor(props) {
    super(props);
    const edjsParser = editorjsHTML();
    this.state = {
      post: null,
      loading: true,
      data: '',
      title: '',
      edjsParser,
      refreshing: false,
      filter: '',
      latestpost: {},
      paymentType: 'free',
      post_image: null,
      edit_image: null,
      currentTab: 0,
      tags: '',
      amount: 0,
      category: 'General',
      suggestions: [
        { id: 3, name: 'Bananas' },
        { id: 4, name: 'Mangos' },
        { id: 5, name: 'Lemons' },
        { id: 6, name: 'Apricots' },
      ],
    };

    this.editor = React.createRef();
    this.reactTags = React.createRef();
  }

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
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
    this.getBlog();
  }

  getBlog = () => {
    getSinglePost({
      postid: this.props.match.params.id,
      userid:
        this.props.currentUser && this.props.currentUser._id
          ? this.props.currentUser._id
          : 0,
    }).then(
      async (resp) => {
        const post = resp.post[0];
        this.setState(
          {
            title: post.subject,
            post,
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
            paymentType: post.paidPost ? 'paid' : 'free',
            edit_image: post.contents[0].content_url,
            loading: false,
          },
          () => {
            if (post.paidPost) {
              document.getElementById('paid').click();
            }
          }
        );
      },
      (error) => {
        this.setState({ loading: false });
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

  dataChange = (e) => {};

  submit = async (e) => {
    e.preventDefault();
    const edata = await this.editor.save();

    const err = [];
    if (this.state.title == '') {
      err.push('Title is required');
    }
    if (edata.blocks.length <= 0) {
      err.push('Content is required');
    }
    if (this.state.post_image == null && this.state.edit_image == null) {
      err.push('Main Image is required');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let hashtags = '';
      let data = this.state.edjsParser.parse(edata);
      data = data.join(' ');
      const postImages = this.state.post_image;
      if (this.state.tags.length > 0) {
        hashtags = this.state.tags.join(',');
      } else {
        hashtags = '';
      }

      const formData = new FormData();
      formData.append('id', this.state.post._id);
      formData.append('postImgs', postImages);
      formData.append('text', data);
      formData.append('editorContent', JSON.stringify(edata));
      formData.append('subject', this.state.title);
      formData.append('hashtags', hashtags);
      formData.append('paymentType', this.state.paymentType);
      formData.append('amount', this.state.amount);
      formData.append('currency', this.state.currency);
      formData.append('category', this.state.category);
      switchLoader('Your post is being updated...');
      updateBlog(formData).then(
        async (resp) => {
          window.location.href = '/blogs';
          switchLoader();
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

  render() {
    return (
      // <!-- Wall container -->
      this.state.loading ? (
        <div />
      ) : (
        <div className="addBlogPage">
          <div className="container my-wall-container mrgn_bm_50">
            <div className="row mt-2">
              {/* <!-- left column --> */}

              {/* <!-- end left column --> */}

              {/* <!-- center column --> */}
              <div className="col-sm empty-container-with-border center-column big mx-auto p-4 addBlogs">
                <h1 className="text-center">Edit Article</h1>
                <form onSubmit={(e) => this.submit(e)} method="post">
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
                    <EditorJs
                      instanceRef={(instance) => {
                        this.editor = instance;
                      }}
                      data={this.state.data}
                      tools={EDITOR_JS_TOOLS}
                    />
                  </div>
                  <div className="form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="paymentType"
                        value="paid"
                        id="paid"
                        // eslint-disable-next-line react/no-unknown-property
                        uncheckedValue="free"
                        onChange={this.handleCheckbox}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="defaultCheck1"
                      >
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
                        <div className="form-group">
                          <label>Currency</label>
                          <select
                            type="text"
                            placeholder="Amount"
                            className="form-control"
                            id="currency"
                            name="currency"
                            value={this.state.currency}
                            onChange={this.handleInput}
                          >
                            <option value="">Choose</option>
                            <option>USD</option>
                            <option>BTC</option>
                            <option>ETH</option>
                            <option>LTC</option>
                            <option>XRP</option>
                            <option>BCH</option>
                            <option>USDT</option>
                          </select>
                          <small className="text-secondary">
                            Enter how much you want to charge for your content
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Main Image</label>
                        <FileBrowse
                          name="post_image"
                          page="blogs"
                          fileChange={this.handleFile}
                          value={this.state.post_image}
                          accept="image/*"
                        />
                        <small className="text-secondary">
                          Replace the main image for your article
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
                          value={this.state.category}
                          onChange={this.handleInput}
                        >
                          <option value="General">General</option>
                          <option value="Technology">Technology</option>
                          <option value="Politics">Politics</option>
                        </select>
                        <small className="text-secondary">
                          Select one related
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tags</label>
                    <MultipleValueTextInput
                      onItemAdded={(item, allItems) =>
                        this.setState({ tags: allItems })
                      }
                      onItemDeleted={(item, allItems) =>
                        this.setState({ tags: allItems })
                      }
                      label=""
                      values={this.state.tags}
                      name="item-input"
                      maxLength="70"
                      placeholder="Do not include #"
                    />

                    <small className="text-secondary">
                      Separate tags using commas
                    </small>
                  </div>
                  <div className="form-group">
                    <Button variant="primaryBtn" size="big">
                      Update
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
      )
    );
  }
}

export default EditBlog;
