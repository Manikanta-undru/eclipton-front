/* eslint-disable no-prototype-builtins */
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
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import Button from '../../components/Button';
import { image } from '../../config/constants';
import { alertBox, switchLoader } from '../../commonRedux';
import {
  mygroups,
  joinedgroups,
  followercount,
  createGroup,
  particularGroups,
  getGpCategory,
} from '../../http/group-calls';

import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import './style/addgroup.scss';

function AccordionStyle(props) {
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
              name="subscription"
              onChange={props.handleInput}
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
                name="recurrence"
                value={props.recurrence}
                onChange={props.handleInput}
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
              onChange={props.handleInput}
              name="currency"
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
              onChange={props.handleInput}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
}

const coins = require('./json/coins.json');

class CreateNewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paid_checked: false,
      free_checked: true,
      category: 'Others',
      privacy: 'public',
      group_name: '',
      display: 'visible',
      tags: '',
      banner: '',
      subscription: '1time',
      recurrence: 'Monthly',
      coins,
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
      errormsg: [],
    };
    this.handleInput = this.handleInput.bind(this);
  }

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

  handleSelectChange = (value, statevalue) => {
    this.setState({
      [statevalue]: value,
    });
  };

  dataChange = (data = {}) => {
    if (data.search == '') {
      this.setState({
        current: '',
        data,
        filter: 0,
      });
    } else {
      this.setState({
        current: '',
        data,
        filter: 1,
      });
    }

    // if (Object.keys(data).length <= 0 || (data.search == '') && (data.category.length == 0)) {
    //   this.setState({
    //     current: "all",
    //     data: null,
    //     filter: 0
    //   })
    // } else {
    //   this.setState({
    //     current: "",
    //     data: data,
    //     filter: 1
    //   });
    // }
  };

  ValidationMsg = (code, type) => {
    console.log(code);
    const error_msg = [];
    if (code == 'group_name_err' && type == 'char') {
      const allowed_char = 'a-zA-Z0-9!#$%^&*_+/-={};,.?:"';
      error_msg.push({
        [code]: `Group name is only allowed these charecters${allowed_char}`,
      });
      this.setState({
        errormsg: error_msg,
      });
    } else if (code == 'group_name_err' && type == 'length') {
      error_msg.push({
        [code]: 'Group name is must be with in 4 to 100 charecters',
      });
      this.setState({
        errormsg: error_msg,
      });
    } else if (code == 'group_desc_err' && type == 'length') {
      error_msg.push({
        [code]: 'Group description is must be with in 20 to 3000 charecters',
      });
      this.setState({
        errormsg: error_msg,
      });
    } else if (code == 'group_banner_err' && type == 'size') {
      error_msg.push({ [code]: 'Please upload the attachment less than 2 MB' });
    } else if (code == 'group_banner_err' && type == 'valid') {
      error_msg.push({ [code]: 'Please select valid file' });
    }
    this.setState({
      errormsg: error_msg,
    });
  };

  handleInput = (evt) => {
    let valuere;
    let valid_msg;
    let error_msges;
    const { name, value } = evt.target;
    if (name == 'banner') {
      valuere = evt.target.files[0];
      this.setState({ [name]: valuere });
      const getExt = valuere.name.split('.').pop();
      const fileType = getExt.replace('.', '');

      if (valuere.size > 2000000) {
        this.ValidationMsg('group_banner_err', 'size');
      } else if (image.indexOf(`.${fileType}`) == -1) {
        this.ValidationMsg('group_banner_err', 'valid');
      } else {
        valuere = value;
        valid_msg = this.state.errormsg.findIndex(
          (err) => err != null && err.hasOwnProperty('group_banner_err') == true
        );
        error_msges = this.state.errormsg;
        delete error_msges[valid_msg];
        this.setState({ errormsg: error_msges });
      }
    } else {
      valuere = value;
      this.setState({ [name]: valuere });
      if (name == 'group_name') {
        // check the validation
        const pattern = /^[a-zA-Z0-9@!#$%^&*_+/-={};':",.?]*$/;
        if (value.search(pattern) === -1) {
          // this.setState({ [name]: "" });
          this.ValidationMsg('group_name_err', 'char');
        } else if (value.length < 4 && value.length > 50) {
          // this.setState({ [name]: "" });
          this.ValidationMsg('group_name_err', 'length');
        } else {
          valuere = value;
          valid_msg = this.state.errormsg.findIndex(
            // eslint-disable-next-line no-prototype-builtins
            (err) => err != null && err.hasOwnProperty('group_name_err') == true
          );
          error_msges = this.state.errormsg;
          delete error_msges[valid_msg];
          this.setState({ errormsg: error_msges });
        }
      } else if (name == 'description') {
        if (value.length < 20 && value.length > 3000) {
          // this.setState({ [name]: "" });
          this.ValidationMsg('group_desc_err', 'length');
        } else {
          valuere = value;
          valid_msg = this.state.errormsg.findIndex(
            // eslint-disable-next-line no-prototype-builtins
            (err) => err != null && err.hasOwnProperty('group_desc_err') == true
          );
          error_msges = this.state.errormsg;
          delete error_msges[valid_msg];
          this.setState({ errormsg: error_msges });
        }
      } else {
        this.setState({ [name]: valuere });
      }
    }
    error_msges = this.state.errormsg;
    if (error_msges.length > 0) {
      const newData = error_msges.filter((el) => el != null);
      this.setState({ errormsg: newData.length > 0 ? newData : newData });
    }
  };

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];
    const length_desc = this.state.description.length;

    console.log(this.state.errormsg, 'errormsg');

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
      formData.append('amount', this.state.amount);
      formData.append('currency', this.state.currency);
      if (this.props.match.params.id != 'undefined') {
        formData.append('edit_id', this.props.match.params.id);
      }
      switchLoader(true, 'Please wait...');
      createGroup(formData).then(
        async (resp) => {
          switchLoader();
          if (resp.message == 'error') {
            alertBox(true, resp.errors);
          } else if (
            resp.message == 'update success' ||
            resp.message == 'create success'
          ) {
            if (resp.message == 'update success') {
              alertBox(true, 'Group updated Successfully!', 'success');
            } else {
              alertBox(true, 'Group Created Successfully!', 'success');
            }
          } else {
            alertBox(true, 'Error created new group!');
          }
          this.props.history.push('/mygroup');
        },
        (error) => {
          alertBox(true, 'Error created new group!');
        }
      );
    }
  };

  componentDidMount() {
    //  EDIT GROUP
    const grop_id = this.props.match.params.id;
    let d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          tags: res.keyword_tags,
          group_name: res.name,
          banner: res.banner,
          category: res.category,
          amount: res.amount != undefined ? res.amount : '',
          paid_checked: res.purchase_type == 'paid',
          free_checked: res.purchase_type == 'free',
          currency: res.currency != undefined ? res.currency : '',
          subscription: res.payment_type != undefined ? res.payment_type : '',
          recurrence:
            res.recurrence_type != undefined ? res.recurrence_type : '',
        });
      },
      (err) => {
        console.log(err);
      }
    );

    // getAllBalance().then(async resp => {
    //   console.log(resp, "datasss")
    //   this.setState({ coins: resp.data })
    // });

    const dataa = {};
    d = dataa;
    this.setState({ currentdata: this.props.match.params.id });
    if (this.props.match.params.id == 'all') {
      d._id = this.props.currentUser._id;
    } else {
      d.page = this.state.page;
      d.perpage = 4;
      d.limit = this.state.limit;
      d._id = this.props.currentUser._id;
    }
    mygroups(d).then(
      (res) => {
        this.setState({
          managegrop: res.data,
          usergroups: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
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

  Viewerrormsg = (code) => {
    if (this.state.errormsg.length > 0 && this.state.errormsg != undefined) {
      const valid_msg = this.state.errormsg.filter(
        (err) => err.hasOwnProperty(code) == true
      );
      console.log(valid_msg, 'valid');
      if (valid_msg.length > 0) {
        return valid_msg[0][code];
      }
    }
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
      <div className="registerUser">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GroupFilter
                dataChange={this.dataChange}
                groupscategory={this.state.groupscategory}
              />
              <ManageGroup userGroups={this.state.managegrop} />
              <MemberGroup usermanagegrp={this.state.manageusergrp} />
              {/* <AllSuggested /> */}
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <form
                onSubmit={(e) => this.submit(e, 1)}
                method="post"
                autoComplete="off"
              >
                <div className="create-group">
                  <h3>Create New Group</h3>

                  <div className="form-group">
                    <label>Name your group</label>
                    <input
                      type="text"
                      className="form-control"
                      name="group_name"
                      value={this.state.group_name}
                      onChange={(e) => this.handleInput(e)}
                    />

                    <span className="input_error">
                      {this.Viewerrormsg('group_name_err')}
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Group Description</label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="description"
                      placeholder={this.state.description}
                      value={this.state.description}
                      onChange={(e) => this.handleInput(e)}
                    />
                    <span className="input_error">
                      {this.Viewerrormsg('group_desc_err')}
                    </span>

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
                        onChange={(e) => this.handleInput(e)}
                        fullWidth
                      >
                        {Grupscate}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="form-group">
                    <label htmlFor="exampleFormControlFile1">Add Banner</label>
                    <input
                      type="file"
                      name="banner"
                      onChange={(e) => this.handleInput(e)}
                      className="form-control-file"
                      id="exampleFormControlFile1"
                    />

                    {this.state.banner != null && (
                      <div className="uploadedImage">
                        <img
                          src={this.state.banner.tmp_name}
                          id="banner_preview"
                        />
                        {/* <div className="fa fa-times remove" name="post_image" onClick={this.handleRemove}></div> */}
                      </div>
                    )}
                    <span className="input_error">
                      {this.Viewerrormsg('group_banner_err')}
                    </span>
                  </div>

                  {this.state.banner != null && this.props.match.params.id ? (
                    <img
                      src={this.state.banner}
                      id="banner_preview"
                      style={{ height: '200px;', width: '250px;' }}
                    />
                  ) : (
                    ''
                  )}

                  {/* <div className="form-group">
                  <label>Add Location</label>
                  <FormControl fullWidth className="">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value=""
                      fullWidth
                    >
                      <MenuItem value="General">India</MenuItem>
                    </Select>
                  </FormControl>
                  <span className="text-muted">
                    This can help people find your group more easily if they're
                    looking for groups in your area.
                  </span>
                </div> */}

                  {/* <div className="form-group">
                <label>Select Privacy</label>
                <FormControl fullWidth className="">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.privacy} onChange={this.handlePrivacyChange} fullWidth>
                    <MenuItem value="Privacy">Privacy</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                  </Select>
                </FormControl>
              </div> */}

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
                          coins={this.state.coins}
                          Selectedcurrency={this.state.currency}
                          amount={this.state.amount}
                          handleInput={this.handleInput}
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
                      onChange={(e) => this.handleInput(e)}
                    />
                    <span className="text-muted">
                      Separate tags using commas
                    </span>
                  </div>

                  {/* <div className="form-group">
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
                            aria-expanded="false" onClick={() => this.handlePrivacyChange('private')}
                          >
                            <div className="inline-block mr-2">
                              <i className="fa fa-lock"></i>
                            </div>
                            <div className="inline-block">
                              <span className="d-block">Private</span>
                              <span>
                                (Only members can see who's in the group and what they
                                post)
                              </span>
                            </div>
                          </button>
                          <div
                            className="dropdown-menu w-100"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.handlePrivacyChange('public')}>
                              <div className="inline-block mr-2">
                                <i className="fa fa-globe"></i>
                              </div>
                              <div className="inline-block">
                                <span className="d-block">Public</span>
                                <span>
                                  (Anyone can see who's in the group and what they
                                  post)
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
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
                            this.handleSelectChange(
                              this.state.privacy,
                              'privacy'
                            )
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
                                  {` (Anyone can see who's in the group and what
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
                              this.handleSelectChange(
                                privacy_an_value,
                                'privacy'
                              )
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
                                    {`(Anyone can see who's in the group and
                                      what they post)`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="d-block">Private</span>
                                  <span>
                                    {`(Only members can see who's in the group
                                      and what they post)`}
                                  </span>
                                </>
                              )}
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="form-group">
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
                            aria-expanded="false" onClick={() => this.handleDisplayChange('visible')}
                          >
                            <div className="inline-block mr-2">
                              <i className="fa fa-eye"></i>
                            </div>
                            <div className="inline-block">
                              <span className="d-block">Visible</span>
                              <span>(Anyone can find this group)</span>
                            </div>
                          </button>
                          <div className="dropdown-menu w-100"
                            aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.handleDisplayChange('hidden')}>
                              <div className="inline-block mr-2">
                                <i className="fa fa-eye-slash"></i>
                              </div>
                              <div className="inline-block">
                                <span className="d-block">Hidden</span>
                                <span>(Groups will be saved in draft)</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      </div> */}

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
                            this.handleSelectChange(
                              this.state.display,
                              'display'
                            )
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
                              this.handleSelectChange(
                                display_an_value,
                                'display'
                              )
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
                </div>
                {this.props.match.params.id ? (
                  <div className="">
                    <Button
                      variant="primary"
                      className="primaryBtn"
                      onClick={(e) => this.submit(e, 0)}
                      size="compact m-2 float-right"
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <div className="">
                    <Button
                      variant="primary"
                      className="primaryBtn"
                      onClick={(e) => this.submit(e, 0)}
                      size="compact m-2 float-right"
                      disabled={this.state.errormsg.length > 0}
                    >
                      Create
                    </Button>
                  </div>
                )}
              </form>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNewGroup;
