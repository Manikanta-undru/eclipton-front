import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import images from '../../assets/images/images';
import Button from '../../components/Button';
import { alertBox } from '../../commonRedux';
import { getAllBalance } from '../../http/wallet-calls';
import {
  joinedgroups,
  followercount,
  createGroup,
  particularGroups,
  getGpCategory,
} from '../../http/group-calls';

import './style/adminacti.scss';

const coins = require('./json/coins.json');

function AccordionStyle(props) {
  console.log(props, 'props');
  const useStyles = makeStyles((theme) => ({
    formControl: {
      display: 'block',
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <FormControl fullWidth className={classes.formControl}>
            <span>Subscription Type</span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.subscription}
              onChange={props.handleChangesubscription}
              fullWidth
            >
              <MenuItem value="1time">1 time Purchase</MenuItem>
              <MenuItem value="recurrence">recurrence</MenuItem>
            </Select>
          </FormControl>
        </div>

        {props.subscription == 'recurrence' ? (
          <div className="col-6">
            <FormControl fullWidth className={classes.formControl}>
              <span>Recurrence</span>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.recurrence}
                onChange={props.handleChangeRecurr}
                fullWidth
              >
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : (
          ''
        )}
        <div className="col-6">
          <FormControl fullWidth className={classes.formControl}>
            <span>Choose Currency</span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.Selectedcurrency}
              fullWidth
              onChange={props.handleCoins}
            >
              <MenuItem value="">Select Currency</MenuItem>
              {props.coins.length > 0 &&
                props.coins.map(
                  (e, i) => (
                    <MenuItem value={e.currencySymbol} key={i}>
                      {`${e.currencyName}-${e.currencySymbol}`}
                    </MenuItem>
                  )
                  // return <option value={e.currencySymbol} >{e.currencySymbol}</option>
                )}
              {/* <MenuItem value="BTC">BTC</MenuItem>
          <MenuItem value="LTC">LTC</MenuItem>
          <MenuItem value="ETH">ETH</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div className="col-6">
          <FormControl fullWidth className={classes.formControl}>
            <input
              type="text"
              className="form-control"
              placeholder="Amount"
              name="amount"
              value={props.amount}
              onChange={props.handleChangeamount}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
}

class AdminActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paid_checked: false,
      free_checked: true,
      any_post: false,
      admin_post: false,
      group_approval_any: false,
      group_approval_admin: false,
      category: 'General',
      privacy: 'public',
      group_name: '',
      display: 'visible',
      tags: '',
      banner: '',
      subscription: '1time',
      recurrence: 'Monthly',
      coins: [],
      currency: '',
      amount: '',
      currentTab: 0,
      currentdata: '',
      limit: 4,
      page: 1,
      perpage: 4,
      filter: 0,
      managegrop: [],
      usergroups: [],
      manageusergrp: [],
      mygroupsall: [],
      data: {},
      followerss: [],
      filterdata: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
      groupscategory: [],
      paid_class: 'MuiAccordionSummary-content Mui-expanded',
      description: '',
    };
  }

  handletags = (event) => {
    this.setState({
      tags: event.target.value,
    });
  };

  handlePost = (event) => {
    this.setState((prevState) => ({
      any_post: !prevState.any_post,
      admin_post: !prevState.admin_post,
    }));
  };

  handlejoinaproval = (event) => {
    this.setState((prevState) => ({
      group_approval_any: !prevState.group_approval_any,
      group_approval_admin: !prevState.group_approval_admin,
    }));
  };

  handleChange = (event) => {
    this.setState((prevState) => {
      if (!prevState.free_checked == true) {
        this.setState({ paid_class: 'MuiAccordionSummary-content' });
      }
      return {
        paid_checked: !prevState.paid_checked,
        free_checked: !prevState.free_checked,
      };
    });
  };

  handleCoins = (event) => {
    this.setState({
      currency: event.target.value,
    });
  };

  handlePrivacyChange = (value) => {
    this.setState({
      privacy: value,
    });
  };

  handleDisplayChange = (value) => {
    this.setState({
      display: value,
    });
  };

  handleCategoryChange = (event) => {
    this.setState({
      category: event.target.value,
    });
  };

  handleChangesubscription = (event) => {
    this.setState({
      subscription: event.target.value,
    });
  };

  handleChangeRecurr = (event) => {
    this.setState({
      recurrence: event.target.value,
    });
  };

  dataChange = (data = {}) => {
    if (
      Object.keys(data).length <= 0 ||
      (data.search == '' && data.category.length == 0)
    ) {
      this.setState({
        current: 'all',
        data: null,
        filter: 0,
      });
    } else {
      this.setState({
        current: '',
        data,
        filter: 1,
      });
    }
  };

  handleGroup = (event) => {
    this.setState({
      group_name: event.target.value,
    });
  };

  handleGroupdesc = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  handleChangeamount = (event) => {
    this.setState({
      amount: event.target.value,
    });
  };

  handleFile = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      banner: event.target.files[0],
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];
    const length_desc = this.state.description.length;

    if (this.state.group_name == '') {
      err.push('Group name is required');
    }

    if (this.state.description == '') {
      err.push('Group description is required');
    }

    if (length_desc > 300) {
      err.push('Group description Maximum with in 50 words');
    }

    if (this.state.banner == '') {
      err.push('Group banner is required');
    }

    if (this.state.paid_checked == true && this.state.amount == '') {
      err.push('Amount is required');
    }

    if (this.state.paid_checked == true && this.state.currency == '') {
      err.push('Currency is required');
    }

    if (this.state.tags == '') {
      err.push('Tags is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('tags', this.state.tags);
      formData.append('group_name', this.state.group_name);
      formData.append('description', this.state.description);
      formData.append('category', this.state.category);
      formData.append('privacy', this.state.privacy);
      formData.append('hidegroup', this.state.display);
      formData.append('banner', this.state.banner);

      if (this.state.paid_checked == true) {
        formData.append('purchase_type', 'paid');
        formData.append('payment_type', this.state.subscription);
      } else {
        formData.append('purchase_type', 'free');
      }
      if (
        this.state.paid_checked == true &&
        this.state.subscription == 'recurrence'
      ) {
        formData.append('recurrence', this.state.recurrence);
      }

      if (this.state.any_post == true) {
        formData.append('post_permission', 'any');
      } else {
        formData.append('post_permission', 'admin');
      }

      if (this.state.group_approval_any == true) {
        formData.append('groups_request', 'no');
      } else {
        formData.append('groups_request', 'admin');
      }

      formData.append('amount', this.state.amount);
      formData.append('currency', this.state.currency);
      if (this.props.grop_id != 'undefined') {
        formData.append('edit_id', this.props.grop_id);
      }
      createGroup(formData).then(
        async (resp) => {
          // console.log(resp)
          if (resp.message == 'error') {
            alertBox(true, resp.errors);
          } else if (
            resp.message == 'update success' ||
            resp.message == 'create success'
          ) {
            if (resp.message == 'update success') {
              alertBox(true, 'Group updated Successfully!', 'success');
              setTimeout(() => {
                window.location.href = '';
              }, 3000);
            } else {
              alertBox(true, 'Group Created Successfully!', 'success');
            }
          } else {
            alertBox(true, 'Error created new group!');
          }
          // this.props.history.push("/allgroups")
        },
        (error) => {
          alertBox(true, 'Error created new group!');
        }
      );
    }
  };

  changeBanner = async (e, t) => {
    e.preventDefault();
    const err = [];

    if (this.state.banner == '') {
      err.push('Group banner is required');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('group_name', this.state.group_name);
      formData.append('banner', this.state.banner);
      formData.append('change_conver', 1);
      if (this.props.grop_id != 'undefined') {
        formData.append('edit_id', this.props.grop_id);
      }
      createGroup(formData).then(
        async (resp) => {
          if (resp.message == 'error') {
            alertBox(true, resp.errors);
          } else if (resp.message == 'Banner Image success') {
            alertBox(true, 'banner image updated Successfully!', 'success');
            setTimeout(() => {
              window.location.href = '';
            }, 3000);
          } else {
            alertBox(true, 'Error updated banner image');
          }
        },
        (error) => {
          alertBox(true, 'Error created new group!');
        }
      );
    }
  };

  componentDidMount() {
    const { grop_id } = this.props;
    let d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          tags: res.keyword_tags,
          group_name: res.name,
          description: res.description,
          banner: res.banner,
          category: res.category,
          amount: res.amount != undefined ? res.amount : '',
          paid_checked: res.purchase_type == 'paid',
          free_checked: res.purchase_type == 'free',
          currency: res.currency != undefined ? res.currency : '',
          subscription: res.payment_type != undefined ? res.payment_type : '',
          recurrence:
            res.recurrence_type != undefined ? res.recurrence_type : '',
          any_post: !!(
            res.post_permission == 'any' || res.post_permission == undefined
          ),
          admin_post: res.post_permission == 'admin',
          group_approval_any: !!(
            res.groups_request == 'no' || res.groups_request == undefined
          ),
          group_approval_admin: res.groups_request == 'admin',
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllBalance().then(async (resp) => {
      console.log(resp, 'datasss');
      this.setState({ coins: resp.data });
    });

    const dataa = {};
    d = dataa;

    followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
        // console.log(`${key}: ${value.count}`);
        followresult[key] = value;
      }
      this.setState({
        followerss: followresult,
      });
    });
    joinedgroups(d).then(
      (res) => {
        this.setState({
          manageusergrp: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGpCategory().then(
      (resp) => {
        console.log('resp', resp);
        if (resp.message == 'success' && resp.status == 200) {
          this.setState({
            groupscategory: resp.data,
          });
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );

    // IF wallet error
    if (this.state.coins == '') {
      this.setState({ coins });
    }
  }

  handleBannerChange = (event) => {
    console.log('test', event.target.files[0]);
    this.setState({
      banner: event.target.files[0],
    });
  };

  render() {
    const groups_allcat = this.state.groupscategory;
    const Grupscate = groups_allcat.map((groupscat, index) => (
      <MenuItem value={groupscat.category} key={index}>
        {groupscat.category}
      </MenuItem>
    ));
    let privacy_an_value = '';
    if (this.state.privacy == 'public') {
      privacy_an_value = 'private';
    } else {
      privacy_an_value = 'public';
    }
    let display_an_value = '';
    if (this.state.display == 'visible') {
      display_an_value = 'hidden';
    } else {
      display_an_value = 'visible';
    }

    return (
      <div className="editGroupAdminActivity">
        <div className="personaliseAreaWrapper">
          <div className="top">
            <div
              className="centerArea"
              style={{ background: `url(${this.state.banner})` }}
            >
              {this.state.banner == '' ? (
                <>
                  <span className="heading">Personalise Your Group</span>
                  <span className="instruction">
                    You can add a photo or illustration here
                  </span>
                </>
              ) : (
                ''
              )}

              <div className="buttonArea">
                <form onSubmit={(e) => this.changeBanner(e, 1)} method="post">
                  <input
                    type="file"
                    id="socialUpload"
                    onChange={this.handleBannerChange}
                  />
                  <label
                    htmlFor="socialUpload"
                    className="uploadLabel btn btn-primary"
                  >
                    Browse image
                  </label>
                  <button
                    className="uploadLabel btn btn-primary"
                    onClick={(e) => this.changeBanner(e, 1)}
                  >
                    Change
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="actionArea">
            <div>
              <img src={images.shareIcon} alt="shareIcon" />
              <span> SHARE</span>
            </div>
            <div>
              <img src={images.invite} alt="shareIcon" />
              <span> INVITE FRIENDS</span>
            </div>
            <div>
              <img src={images.dollar} alt="shareIcon" />
              <span> Paid</span>
            </div>
          </div>
        </div>

        <div className="groupSettings">
          <div className="group-header">Group Settings</div>
          <div className="hline" />
          <div className="group-body">
            <div className="col-12">
              <form onSubmit={(e) => this.submit(e, 1)} method="post">
                <div className="create-group">
                  <h3>Edit Group</h3>

                  <div className="form-group">
                    <label>Name your group</label>
                    <input
                      type="text"
                      className="form-control"
                      name="group_name"
                      value={this.state.group_name}
                      onChange={this.handleGroup}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Group Description</label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="description"
                      placeholder={this.state.description}
                      value={this.state.description}
                      onChange={this.handleGroupdesc}
                    />
                    {/* <small id="descriptionHelp" className="form-text text-muted">
                                        Enter some attractive words for the group members...
                                    </small> */}
                  </div>
                  <div className="form-group">
                    <label>Choose Group Category</label>
                    <FormControl fullWidth className="">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="category"
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                        fullWidth
                      >
                        {Grupscate}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="form-group purchase-plan">
                    <label>Group Purchased Plan</label>

                    <Accordion>
                      <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <FormControlLabel
                          aria-label="Free"
                          control={<Radio name="plan" id="plan" />}
                          label="Free"
                          value="1"
                          onClick={this.handleChange}
                          checked={this.state.free_checked}
                        />
                      </AccordionSummary>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <FormControlLabel
                          aria-label="Paid"
                          // onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<Radio name="plan" id="plan" />}
                          label="Paid"
                          value="0"
                          onClick={this.handleChange}
                          checked={this.state.paid_checked}
                        />
                      </AccordionSummary>

                      <AccordionDetails>
                        <AccordionStyle
                          subscription={this.state.subscription}
                          recurrence={this.state.recurrence}
                          handleChangesubscription={
                            this.handleChangesubscription
                          }
                          handleChangeRecurr={this.handleChangeRecurr}
                          coins={this.state.coins}
                          handleCoins={this.handleCoins}
                          Selectedcurrency={this.state.currency}
                          handleChangeamount={this.handleChangeamount}
                          amount={this.state.amount}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </div>

                  <div className="form-group">
                    <label>Keyword Tags </label>
                    <input
                      type="text"
                      className="form-control"
                      name="tags"
                      value={this.state.tags}
                      onChange={this.handletags}
                    />
                    <span className="text-muted">
                      Separate tags using commas
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Posting Permissions</label>
                    <br />
                    <FormControlLabel
                      aria-label="Anyone"
                      control={
                        <Radio name="post_permission" id="post_permission" />
                      }
                      label="Anyone"
                      value="0"
                      onClick={this.handlePost}
                      checked={this.state.any_post}
                    />
                    <FormControlLabel
                      aria-label="Only admin and moderators"
                      control={
                        <Radio name="post_permission" id="post_permission" />
                      }
                      label="Only admin and moderators"
                      value="1"
                      onClick={this.handlePost}
                      checked={this.state.admin_post}
                    />
                  </div>

                  <div className="form-group">
                    <label>Group Join approval</label>
                    <br />
                    <FormControlLabel
                      aria-label="Anyone"
                      control={
                        <Radio name="group_permission" id="group_permission" />
                      }
                      label="No need approval"
                      value="0"
                      onClick={this.handlejoinaproval}
                      checked={this.state.group_approval_any}
                    />
                    <FormControlLabel
                      aria-label="admin need to approval"
                      control={
                        <Radio name="group_permission" id="group_permission" />
                      }
                      label="admin need to approval"
                      value="1"
                      onClick={this.handlejoinaproval}
                      checked={this.state.group_approval_admin}
                    />
                  </div>

                  {/* <div className="form-group">
                                        <label>Post Approval</label>
                                        <br />
                                        <FormControlLabel
                                            aria-label="All group posts must be approved by an admin or a moderator."
                                            control={<Checkbox />}
                                            label="All group posts must be approved by an admin or a moderator."
                                        />
                                    </div> */}

                  <div className="form-group">
                    <label>Select Privacy</label>
                    <br />
                    <div className="input-group">
                      <div className="dropdown w-100">
                        <button
                          className="btn btn-lg btn-secondary dropdown-toggle w-100"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          onClick={() =>
                            this.handlePrivacyChange(this.state.privacy)
                          }
                        >
                          <div className="inline-block mr-2">
                            <i className="fa fa-lock" />
                          </div>
                          <div className="inline-block">
                            {this.state.privacy == 'private' ? (
                              <>
                                <span className="d-block">Private</span>
                                <span>
                                  {`(Only members can see who's in the group and
                                  what they post)`}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="d-block">Public</span>{' '}
                                <span>
                                  {`(Anyone can see who's in the group and what
                                  they post)`}
                                </span>
                              </>
                            )}
                          </div>
                        </button>
                        <div
                          className="dropdown-menu w-100"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            className="dropdown-item"
                            href="javascript:void(0)"
                            onClick={() =>
                              this.handlePrivacyChange(privacy_an_value)
                            }
                          >
                            <div className="inline-block mr-2">
                              <i className="fa fa-globe" />
                            </div>
                            <div className="inline-block">
                              {privacy_an_value == 'public' ? (
                                <>
                                  <span className="d-block">Public</span>
                                  <span>
                                    {`(Anyone can see who's in the group and what
                                    they post)`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="d-block">Private</span>
                                  <span>
                                    {`(Only members can see who's in the group and
                                    what they post)`}
                                  </span>
                                </>
                              )}
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Hide Group</label>
                    <br />
                    <div className="input-group">
                      <div className="dropdown w-100">
                        <button
                          className="btn btn-lg btn-secondary dropdown-toggle w-100"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          onClick={() =>
                            this.handleDisplayChange(this.state.display)
                          }
                        >
                          {this.state.display == 'visible' ? (
                            <>
                              {' '}
                              <div className="inline-block mr-2">
                                <i className="fa fa-eye" />
                              </div>
                              <div className="inline-block">
                                <span className="d-block">Visible</span>
                                <span>(Anyone can find this group)</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="inline-block mr-2">
                                <i className="fa fa-eye-slash" />
                              </div>
                              <div className="inline-block">
                                <span className="d-block">Hidden</span>{' '}
                                <span>((Groups will be saved in draft))</span>
                              </div>
                            </>
                          )}
                        </button>
                        <div
                          className="dropdown-menu w-100"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            className="dropdown-item"
                            href="javascript:void(0)"
                            onClick={() =>
                              this.handleDisplayChange(display_an_value)
                            }
                          >
                            {display_an_value == 'visible' ? (
                              <>
                                <div className="inline-block mr-2">
                                  <i className="fa fa-eye" />
                                </div>
                                <div className="inline-block">
                                  <span className="d-block">Visible</span>
                                  <span>(Anyone can find this group)</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="inline-block mr-2">
                                  <i className="fa fa-eye-slash" />
                                </div>
                                <div className="inline-block">
                                  <span className="d-block">Hidden</span>
                                  <span>(Groups will be saved in draft)</span>
                                </div>
                              </>
                            )}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="form-group">
                                    <label>Screening Questions</label>
                                    <div className="ques-box">
                                        <span>
                                        Learn more about people who want to join your group by asking
                                        them some questions.
                                        </span>
                                        <a className="d-block">Ask Question</a>
                                    </div>
                                    </div> */}
                </div>

                <div className="">
                  <Button
                    variant="primary"
                    onClick={(e) => this.submit(e, 0)}
                    size="compact m-2 float-right"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminActivity;
