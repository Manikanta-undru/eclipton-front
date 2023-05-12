import React from 'react';
import { alertBox, switchLoader } from '../../../commonRedux';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { getCategories, getGig, updateGig } from '../../../http/gig-calls';

require('./styles.scss');
const coins = require('./coins.json');

class EditGig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      level: 1,
      dragclass: '',
      gig: null,
      parent: '',
      files: [],
      features: [{ feature: '', standard: 0, premium: 1 }],
      extras: [{ feature: '', value: '', amount: '' }],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      coins,
      title: '',
      currency: '',
      category: '',
      category_id: '',
      format: '',
      standard_days: '',
      premium_days: '',
      standard_price: '',
      premium_price: '',
      fast_days: '',
      fast_price: '',
      desc: '',
      gallery: [],
    };
  }

  handleFeature = (i, e) => {
    const { name } = e.target;
    const temp = this.state.features;
    let val;
    if (name == 'feature') {
      val = e.target.value;
      temp[i][name] = val;
    } else {
      val = e.target.checked;
      temp[i][name] = val ? 1 : 0;
    }
    this.setState({
      features: temp,
    });
  };

  addFeature = () => {
    const temp = this.state.features;
    temp.push({ feature: '', standard: 0, premium: 1 });
    this.setState({
      features: temp,
    });
  };

  removeFeature = (i) => {
    const temp = this.state.features;
    delete temp[i];
    this.setState({
      features: temp,
    });
  };

  handleExtra = (i, e) => {
    const { name } = e.target;
    const temp = this.state.extras;
    const val = e.target.value;
    temp[i][name] = val;
    this.setState({
      extras: temp,
    });
  };

  addExtra = () => {
    const temp = this.state.extras;
    temp.push({ feature: '', value: '', amount: '' });
    this.setState({
      extras: temp,
    });
  };

  removeExtra = (i) => {
    const temp = this.state.extras;
    delete temp[i];
    this.setState({
      extras: temp,
    });
  };

  componentDidMount() {
    this.getGigCategories(1);
    getGig({ id: this.props.match.params.id }).then(
      (resp) => {
        this.setState({
          id: resp._id,
          gigs: resp,
          title: resp.subject,
          format: resp.format,
          currency: resp.preferedCurrency,
          desc: resp.text,
          extras: resp.extras,
          standard_days: resp.standardDays,
          premium_days: resp.premiumDays,
          standard_price: resp.standardPrice,
          premium_price: resp.premiumPrice,
          fast_days: resp.fastDays,
          fast_price: resp.fastPrice,
          features: resp.features,
          files: resp.contents,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getGigCategories = (level) => {
    getCategories({ level, parent: this.state.parent }).then(
      (resp) => {
        this.setState({
          [`level${level}`]: resp,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  handleInput = (e) => {
    let val = e.target.value;
    const { name } = e.target;
    if (name == 'title') {
      if (val.length > 100) {
        val = val.substring(0, 100);
      }
      this.setState({
        [name]: val,
      });
    } else {
      this.setState({
        [name]: val,
      });
    }
  };

  handleCategory = (e, i) => {
    const val = e.target.value;
    const v = val.split('^');
    this.setState(
      {
        category: v[1],
        category_id: v[0],
        parent: v[0],
        level: i,
      },
      () => {
        if (i < 6) {
          this.getGigCategories(i);
        }
      }
    );
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

  submit = async (e) => {
    e.preventDefault();
    const err = [];
    if (this.state.title == '') {
      err.push('Title is required');
    }
    if (this.state.category == '') {
      err.push('Category is required');
    }
    if (this.state.files.length == 0) {
      err.push('At least one gallery image is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const f = [];
      this.state.files.forEach((e) => {
        if (e.content_url == undefined) {
          f.push(e);
        }
      });

      const formData = {
        id: this.state.id,
        subject: this.state.title,
        category: this.state.category,
        category_id: this.state.category_id,
        format: this.state.format,
        currency: this.state.currency,
        standard_price: this.state.standard_price,
        premium_price: this.state.premium_price,
        standard_days: this.state.standard_days,
        premium_days: this.state.premium_days,
        features: JSON.stringify(this.state.features),
        extras: JSON.stringify(this.state.extras),
        fast_days: this.state.fast_days,
        fast_price: this.state.fast_price,
        text: this.state.desc,
        files: f,
      };
      // const formData = new FormData();
      // formData.append('postImgs', postImages);
      // formData.append('text', data);
      // formData.append('editorContent', JSON.stringify(edata));
      // formData.append('subject', this.state.title);
      // formData.append('hashtags', hashtags);
      // formData.append('paymentType', this.state.paymentType);
      // formData.append('amount', this.state.amount);
      // formData.append('currency', this.state.currency);
      // formData.append('category', this.state.category);
      switchLoader('Your post is being updated...');
      updateGig(formData).then(
        async (resp) => {
          window.location.href = '/passionomy';
          switchLoader();
        },
        (error) => {
          alertBox(true, error.message);
          switchLoader();
        }
      );
    }
  };

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

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('gallery').click();
  };

  fileToDataURL = (file) => {
    if (file.content_url != undefined) {
      return file;
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  readAsDataURL = (filesArray) =>
    // target => <input type="file" id="file">
    // var filesArray = Array.prototype.slice.call(target.files)
    Promise.all(filesArray.map(this.fileToDataURL));

  handleFiles = async (files) => {
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      if (
        !element.type.match('image*') &&
        !element.type.match('video*') &&
        !element.type.match('audio*') &&
        !element.type.match('pdf*') &&
        !element.type.match('xls*')
      ) {
        alertBox(true, 'Please select valid file');
        return;
      }
    }
    const temp = [...this.state.files, ...files];
    const f = await this.readAsDataURL(temp);
    this.setState({
      files: temp,
      imgs: f,
    });
  };

  removeFile = (i) => {
    const temp = this.state.files;
    const temp2 = this.state.imgs;
    try {
      delete temp[i];
      delete temp2[i];
    } catch (error) {
      /* empty */
    }

    this.setState({
      files: temp,
      imgs: temp2,
    });
  };

  render() {
    return (
      // <!-- Wall container -->
      <div className="GigRequestPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {this.state.gigs == null ? (
              <div className="col-sm empty-container-with-border center-column big mx-auto p-4 AddGigPage_box">
                <Spinner />
              </div>
            ) : (
              <div className="col-sm empty-container-with-border center-column big mx-auto p-4">
                <h1>Edit Gigs</h1>
                <form onSubmit={(e) => this.submit(e)} method="post">
                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Gig Title</label>
                      </div>
                      <div className="right">
                        <textarea
                          type="text"
                          placeholder="I will help you for..."
                          name="title"
                          className="form-control w-100"
                          onChange={this.handleInput}
                          value={this.state.title}
                          required
                        >
                          {this.state.title}
                        </textarea>
                        <span className="add-comment">
                          {this.state.title.length} / 100 max
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Category</label>
                      </div>
                      <div className="right">
                        <select
                          type="text"
                          placeholder="I will help you for..."
                          name="category"
                          className="form-control w-100"
                          onChange={(e) => this.handleCategory(e, 2)}
                        >
                          <option value="">Select</option>
                          {this.state.level1.map((c, k) => (
                            <option key={k} value={`${c._id}^${c.category}`}>
                              {c.category}
                            </option>
                          ))}
                        </select>
                        {this.state.level2.length > 0 && (
                          <select
                            type="text"
                            placeholder="I will help you for..."
                            name="category"
                            className="form-control w-100"
                            onChange={(e) => this.handleCategory(e, 3)}
                          >
                            <option value="">Select</option>
                            {this.state.level2.map((c, k) => (
                              <option key={k} value={`${c._id}^${c.category}`}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        )}
                        {this.state.level3.length > 0 && (
                          <select
                            type="text"
                            placeholder="I will help you for..."
                            name="category"
                            className="form-control w-100"
                            onChange={(e) => this.handleCategory(e, 4)}
                          >
                            <option value="">Select</option>
                            {this.state.level3.map((c, k) => (
                              <option key={k} value={`${c._id}^${c.category}`}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        )}
                        {this.state.level4.length > 0 && (
                          <select
                            type="text"
                            placeholder="I will help you for..."
                            name="category"
                            className="form-control w-100"
                            onChange={(e) => this.handleCategory(e, 5)}
                          >
                            <option value="">Select</option>
                            {this.state.level4.map((c, k) => (
                              <option key={k} value={`${c._id}^${c.category}`}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        )}
                        {this.state.level5.length > 0 && (
                          <select
                            type="text"
                            placeholder="I will help you for..."
                            name="category"
                            className="form-control w-100"
                            onChange={(e) => this.handleCategory(e, 6)}
                          >
                            <option value="">Select</option>
                            {this.state.level5.map((c, k) => (
                              <option key={k} value={`${c._id}^${c.category}`}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>File Format</label>
                      </div>
                      <div className="right">
                        <input
                          type="text"
                          required
                          value={this.state.format}
                          placeholder="Enter all file formats you will be sending"
                          name="format"
                          className="form-control w-100"
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Preferred Currency</label>
                      </div>
                      <div className="right">
                        <select
                          name="currency"
                          required
                          className="form-control w-100"
                          onChange={this.handleInput}
                          value={this.state.currency}
                        >
                          <option value="">Select</option>
                          {this.state.coins.map((e, i) => (
                            <option value={e.currencySymbol} key={i}>
                              {`${e.currencyName} (${e.currencySymbol})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Pricing</label>
                      </div>
                      <div className="right">
                        <table className="table table-bordered">
                          <tr>
                            <th />
                            <th>Standard</th>
                            <th>Premium</th>
                          </tr>
                          <tr>
                            <td>Price</td>
                            <td>
                              <span className="input-icon">
                                {this.state.currency}
                              </span>
                              <input
                                type="number"
                                required
                                placeholder=""
                                step="1"
                                min="1"
                                name="standard_price"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.standard_price}
                              />
                            </td>
                            <td>
                              <span className="input-icon">
                                {this.state.currency}
                              </span>{' '}
                              <input
                                type="number"
                                required
                                placeholder=""
                                step="1"
                                min="1"
                                name="premium_price"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.premium_price}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Delivery Time</td>
                            <td>
                              <input
                                type="number"
                                required
                                placeholder="in days"
                                step="1"
                                min="1"
                                name="standard_days"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.standard_days}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                required
                                placeholder="in days"
                                step="1"
                                min="1"
                                name="premium_days"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.premium_days}
                              />
                            </td>
                          </tr>
                          {this.state.features.map((v, i) => (
                            <tr key={i}>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Add a Feature"
                                  required
                                  name="feature"
                                  className="form-control"
                                  value={this.state.features[i].feature}
                                  onChange={(e) => this.handleFeature(i, e)}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  name="standard"
                                  value="1"
                                  checked={this.state.features[i].standard != 0}
                                  className="checkbox d-block mx-auto"
                                  onChange={(e) => this.handleFeature(i, e)}
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  name="premium"
                                  value="1"
                                  className="checkbox d-block mx-auto"
                                  onChange={(e) => this.handleFeature(i, e)}
                                  checked
                                  readOnly
                                />
                                {i > 0 && (
                                  <span
                                    className="removeRow"
                                    onClick={() => this.removeFeature(i)}
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
                          onClick={this.addFeature}
                          size="compact"
                          variant="primary-outline"
                        >
                          <i className="fa fa-plus" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Extras</label>
                      </div>
                      <div className="right">
                        <table className="table table-bordered">
                          <tr>
                            <td>Fast Delivery</td>
                            <td>
                              <input
                                type="number"
                                required
                                placeholder="in days"
                                step="1"
                                min="1"
                                name="fast_days"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.fast_days}
                              />
                            </td>
                            <td>
                              <span className="input-icon">
                                {this.state.currency}
                              </span>{' '}
                              <input
                                type="number"
                                required
                                placeholder=""
                                step="1"
                                min="1"
                                name="fast_price"
                                className="form-control w-100"
                                onChange={this.handleInput}
                                value={this.state.fast_price}
                              />
                            </td>
                          </tr>
                          {this.state.extras.map((v, i) => (
                            <tr key={i}>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Add Extra Feature"
                                  required
                                  name="feature"
                                  className="form-control"
                                  onChange={(e) => this.handleExtra(i, e)}
                                  value={this.state.extras[i].feature}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="value"
                                  className="form-control"
                                  value={this.state.extras[i].value}
                                  onChange={(e) => this.handleExtra(i, e)}
                                  placeholder="value (optional)"
                                />
                              </td>
                              <td>
                                <span className="input-icon">
                                  {this.state.currency}
                                </span>{' '}
                                <input
                                  type="number"
                                  required
                                  placeholder=""
                                  step="1"
                                  min="1"
                                  name="amount"
                                  className="form-control w-100"
                                  onChange={(e) => this.handleExtra(i, e)}
                                  value={this.state.extras[i].amount}
                                />
                                {i > 0 && (
                                  <span
                                    className="removeRow"
                                    onClick={() => this.removeExtra(i)}
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
                          onClick={this.addExtra}
                          size="compact"
                          variant="primary-outline"
                        >
                          <i className="fa fa-plus" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>About</label>
                      </div>
                      <div className="right">
                        <textarea
                          type="text"
                          required
                          placeholder="Description about this gig"
                          name="desc"
                          className="form-control w-100"
                          onChange={this.handleInput}
                        >
                          {this.state.desc}
                        </textarea>
                      </div>
                    </div>
                  </div>

                  <div className="add-group">
                    <div className="add-row">
                      <div className="left">
                        <label>Gallery / My Work</label>
                      </div>
                      <div className="right">
                        <div
                          className={`uploadArea ${this.state.dragclass}`}
                          onDrop={(e) => this.handleDrop(e)}
                          onDragOver={(e) => this.handleDragOver(e)}
                          onDragEnter={(e) => this.handleDragEnter(e)}
                          onDragLeave={(e) => this.handleDragLeave(e)}
                        >
                          <div className="droppedFiles">
                            {this.state.files.map((f, i) => (
                              <div className="file" key={i}>
                                <img
                                  src={
                                    f.content_url != undefined
                                      ? f.content_url
                                      : this.state.imgs[i]
                                  }
                                />
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.removeFile(i)}
                                />
                              </div>
                            ))}
                          </div>
                          Drag and Drop
                          {/* <input type="file" id="gallery" onChange={this.addToGallery} style={{display: "none"}} /> */}
                        </div>
                        {/* <Button type="button" variant="primary" size="compact" >Upload</Button> */}
                      </div>
                    </div>
                  </div>

                  <div className="form-group text-center">
                    <Button variant="primary" size="big">
                      Publish
                    </Button>
                    {/* <Button type="button" variant="primary-outline" className="ml-2" size="big" onClick={(e) => this.review(e)}>Review</Button> */}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EditGig;
