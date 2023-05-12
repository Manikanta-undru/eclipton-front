import React from 'react';
import SideMenu1 from '../../_widgets/sideMenu1';
import Button from '../../../../components/Button';
import imageIcon from '../../../../assets/images/icons/icon-upload-image.png';
import videoIcon from '../../../../assets/images/icons/icon-upload-video.png';
import A from '../../../../components/A';
import { alertBox } from '../../../../commonRedux';
import { get, updateWithFile } from '../../../../http/product-calls';
import { history } from '../../../../store';

require('../../_styles/market-area.scss');
require('./product-gallery.scss');

class MarketProductGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      files2: [],
      videos: [],
      videos2: [],
      product_id: this.props.location.state,
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleDragEnter = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    if (t === 1) {
      this.setState({
        dragclass: 'enter',
      });
    } else {
      this.setState({
        videodragclass: 'enter',
      });
    }
  };

  handleDragLeave = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    if (t === 1) {
      this.setState({
        dragclass: '',
      });
    } else {
      this.setState({
        videodragclass: '',
      });
    }
  };

  handleDragOver = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    if (t === 1) {
      this.setState({
        dragclass: 'over',
      });
    } else {
      this.setState({
        videodragclass: 'over',
      });
    }
  };

  handleDrop = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    const { files } = dt;
    if (t === 1) {
      this.setState({
        dragclass: '',
      });
      this.handleFiles(files);
    } else {
      this.setState({
        videodragclass: '',
      });
      this.handleVideos(files);
    }
  };

  handleClick = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    if (t === 1) {
      const el = document.querySelector('.droppedFiles');
      if (el && !el.contains(e.target)) {
        const fileInput = document.getElementById('uploadImage');
        if (fileInput) {
          fileInput.click();
        }
      }
    } else {
      const el = document.querySelector('.droppedVideoFiles');
      if (el && !el.contains(e.target)) {
        const fileInput = document.getElementById('uploadVideo');
        if (fileInput) {
          fileInput.click();
        }
      }
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
      if (temp.length <= 10) {
        const f = await this.readAsDataURL(temp);
        this.setState({
          files: temp,
          imgs: f,
        });
      } else {
        alertBox(true, 'Max 10 images uploads are allowed');
      }
    }
    if (files[0] !== null && files[0].size > 2e6) {
      alertBox(true, 'Please upload a file smaller than 2 MB');
    }
  };

  removeFile = (i, n = 1) => {
    if (n == 2) {
      const temp = this.state.files2;
      temp.splice(i, 1);
      this.setState({
        files2: temp,
      });
    } else {
      const temp = this.state.files;
      const temp2 = this.state.imgs;
      temp.splice(i, 1);
      temp2.splice(i, 1);
      this.setState({
        files: temp,
        imgs: temp2,
      });
    }
  };

  handleVideos = async (files) => {
    if (files[0] !== null && files[0].size < 2e6) {
      const temp = [...this.state.videos, ...files];
      if (temp.length <= 5) {
        const f = await this.readAsDataURL(temp);
        this.setState({
          videos: temp,
          vids: f,
        });
      } else {
        alertBox(true, 'Max 5 videos uploads are allowed');
      }
    }
    if (files[0] !== null && files[0].size > 2e6) {
      alertBox(true, 'Please upload a video file smaller than 2 MB');
    }
  };

  removeVideo = (i, n = 1) => {
    if (n == 2) {
      const temp = this.state.videos2;
      temp.splice(i, 1);
      this.setState({
        videos2: temp,
      });
    } else {
      const temp = this.state.videos;
      const temp2 = this.state.vids;
      temp.splice(i, 1);
      temp2.splice(i, 1);
      this.setState({
        videos: temp,
        vids: temp2,
      });
    }
  };

  addImages = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    this.handleFiles(e.target.files);
  };

  addVideos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    this.handleVideos(e.target.files);
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
                src: resp.attachment[x].src,
                type: 'Video',
              });
            } else {
              files2.push({
                src: resp.attachment[x].src,
                type: 'Image',
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
          description: resp.description,
          editorContent: resp.editorContent,
          status: resp.status,
          price_currency: resp.price_currency,
          amount: resp.amount,
          discount: resp.discount,

          discount_period: resp.discount_period,
          files2,
          videos2,
          faqs: resp.faqs,
          returns: resp.returns,
          attachment: resp.attachment,
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
      pathname: '/market-product-pricing',
      state: this.state.product_id,
    });
  }

  submit = async (e, t) => {
    e.preventDefault();
    const status = t === 1 ? this.state.status : 'draft';
    let err = [];
    if (
      this.state.videos.length == 0 &&
      this.state.videos2.length == 0 &&
      this.state.files.length == 0 &&
      this.state.files2.length == 0
    )
      err.push('At least one video or image is required');
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let hashsize = '';
      if (this.state.size.length > 0) {
        hashsize = this.state.size.join(',');
      }
      const formData = {
        price_currency: this.state.price_currency,
        amount: this.state.amount,
        discount: this.state.discount,
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
        files: this.state.files,
        files2: JSON.stringify(this.state.files2),
        videos: this.state.videos,
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
      updateWithFile(formData).then(
        async (resp) => {
          if (t === 1) {
            alertBox(true, 'Gallery has been saved!', 'success');
            history.push({
              pathname: '/market-product-faq',
              state: this.state.product_id,
            });
          } else {
            alertBox(true, 'Gallery draft has been saved!', 'success');
            history.push({
              pathname: '/market-product-gallery-preview',
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
                    <h2> Upload Your Product Images </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="upload-gallery-box photo">
                    <div className="holder">
                      <input
                        type="file"
                        id="uploadImage"
                        onChange={(e) => {
                          this.addImages(e);
                        }}
                        accept="image/png, image/jpg, image/jpeg"
                        className="form-control-file"
                        multiple
                      />
                      <div
                        className={`uploadArea ${this.state.dragclass}`}
                        onDrop={(e) => this.handleDrop(e, 1)}
                        onDragOver={(e) => this.handleDragOver(e, 1)}
                        onDragEnter={(e) => this.handleDragEnter(e, 1)}
                        onDragLeave={(e) => this.handleDragLeave(e, 1)}
                        onClick={(e) => this.handleClick(e, 1)}
                      >
                        <img src={imageIcon} alt="" className="icon" />
                        <p>
                          {' '}
                          Drag & drop your product image or{' '}
                          <label htmlFor="uploadImage" className="browse">
                            {' '}
                            Browse{' '}
                          </label>{' '}
                        </p>
                        <p> PNG or JPG or JPEG no bigger than 2MB </p>
                      </div>
                    </div>
                    <div className="preview-image droppedFiles">
                      <ul>
                        {this.state.files2.length > 0 &&
                          this.state.files2.map((f, i) => (
                            <li key={i}>
                              <div className="file">
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
                            </li>
                          ))}
                        {this.state.files.length > 0 &&
                          this.state.files.map((f, i) => (
                            <li key={i}>
                              <div className="file">
                                <img src={this.state.imgs[i]} />
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.removeFile(i)}
                                />
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="upload-gallery-box video">
                    <div className="holder">
                      <input
                        type="file"
                        id="uploadVideo"
                        onChange={(e) => {
                          this.addVideos(e);
                        }}
                        accept="video/mp4"
                        className="form-control-file"
                        multiple
                      />
                      <div
                        className={`uploadVideoArea ${this.state.videodragclass}`}
                        onDrop={(e) => this.handleDrop(e, 2)}
                        onDragOver={(e) => this.handleDragOver(e, 2)}
                        onDragEnter={(e) => this.handleDragEnter(e, 2)}
                        onDragLeave={(e) => this.handleDragLeave(e, 2)}
                        onClick={(e) => this.handleClick(e, 2)}
                      >
                        <img src={videoIcon} alt="" className="icon" />
                        <p>
                          {' '}
                          Drag & drop your product video or{' '}
                          <label htmlFor="uploadVideo" className="browse">
                            {' '}
                            Browse{' '}
                          </label>{' '}
                        </p>
                        <p> mp4 no bigger than 2MB </p>
                      </div>
                    </div>
                    <div className="preview-video-image droppedVideoFiles">
                      <ul>
                        {this.state.videos2.length > 0 &&
                          this.state.videos2.map((f, i) => (
                            <li key={i}>
                              <div className="file">
                                <video controls>
                                  <source
                                    src={
                                      f.src != undefined
                                        ? f.src
                                        : this.state.vids[i]
                                    }
                                    type="video/mp4"
                                  />{' '}
                                </video>
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.removeVideo(i, 2)}
                                />
                              </div>
                            </li>
                          ))}
                        {this.state.videos.length > 0 &&
                          this.state.videos.map((f, i) => (
                            <li key={i}>
                              <div className="file">
                                <video controls>
                                  <source
                                    src={this.state.vids[i]}
                                    type="video/mp4"
                                  />{' '}
                                </video>
                              </div>
                              <i
                                className="fa fa-times"
                                onClick={() => this.removeVideo(i)}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-product-gallery-preview">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-product-gallery-preview">
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

export default MarketProductGallery;
