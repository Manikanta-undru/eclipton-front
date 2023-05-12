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
import Button from '../../components/Button';
import { alertBox } from '../../commonRedux';
import { createGroup, particularGroups } from '../../http/group-calls';

import './style/addgroup.scss';

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

class GroupPurchasedPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paid_checked: false,
      free_checked: true,
      category: 'General',
      any_post: false,
      admin_post: false,
      group_approval_any: false,
      group_approval_admin: false,
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

  handleChangeamount = (event) => {
    this.setState({
      amount: event.target.value,
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];

    if (this.state.paid_checked == true && this.state.amount == '') {
      err.push('Amount is required');
    }

    if (this.state.paid_checked == true && this.state.currency == '') {
      err.push('Currency is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('group_name', this.state.group_name);
      formData.append('tags', this.state.tags);
      formData.append('description', this.state.description);
      formData.append('category', this.state.category);
      formData.append('privacy', this.state.privacy);
      formData.append('hidegroup', this.state.display);
      formData.append('banner', this.state.banner);
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
      if (this.props.group_id != 'undefined') {
        formData.append('edit_id', this.props.group_id);
      }
      createGroup(formData).then(
        async (resp) => {
          console.log(resp);
          if (resp.message == 'error') {
            alertBox(true, resp.errors);
          } else if (
            resp.message == 'update success' ||
            resp.message == 'create success'
          ) {
            alertBox(true, 'Group Purchase update Successfully!', 'success');
            setTimeout(() => {
              window.location.href = `/settings/${this.props.group_id}`;
            }, 3000);
          } else {
            alertBox(true, 'Error update Plan!');
          }
        },
        (error) => {
          alertBox(true, 'Error update Plan!');
        }
      );
    }
  };

  componentDidMount() {
    //  EDIT GROUP
    const grop_id = this.props.group_id;
    const d = {};
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

    // IF wallet error
    if (this.state.coins == '') {
      this.setState({ coins });
    }
  }

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
        <div className="col-sm empty-container-with-out-border center-column">
          <form onSubmit={(e) => this.submit(e, 1)} method="post">
            <div className="create-group">
              <h3>Group Plan Settings</h3>

              <div className="form-group purchase-plan">
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
                      handleChangesubscription={this.handleChangesubscription}
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
            </div>
            <div className="">
              <Button
                variant="primary"
                onClick={(e) => this.submit(e, 0)}
                size="compact m-2 float-right"
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default GroupPurchasedPlan;
