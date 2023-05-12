import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '../../components/Button';

import { alertBox } from '../../commonRedux';
import { getAllBalance } from '../../http/wallet-calls';
import { particularGroups, Purchasegroup } from '../../http/group-calls';

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

class PaymentGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paid_checked: false,
      free_checked: true,
      auto_payment_on: false,
      auto_payment_off: true,
      group_name: '',
      subscription: '1time',
      recurrence: 'Monthly',
      coins: [],
      currency: '',
      amount: '',
    };
  }

  handlePost = (event) => {
    this.setState((prevState) => ({
      auto_payment_off: !prevState.auto_payment_off,
      auto_payment_on: !prevState.auto_payment_on,
    }));
  };

  submit = async (e, t) => {
    e.preventDefault();
    const d = {};
    d.group_id = this.props.group_id;
    d.amount = this.state.amount;
    d.currency = this.state.currency;
    Purchasegroup(d).then((res) => {
      if (res.message != 'error') {
        alertBox(true, 'Payment Suceessfully!', 'success');
      } else {
        console.log(res.data);
        alertBox(true, 'Payment Error!', 'error');
      }
    });
  };

  componentDidMount() {
    const grop_id = this.props.group_id;
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          group_name: res.name,
          amount: res.amount != undefined ? res.amount : '',
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

    getAllBalance().then(async (resp) => {
      this.setState({ coins: resp.data });
    });
    // IF wallet error
    if (this.state.coins == '') {
      this.setState({ coins });
    }
  }

  render() {
    return (
      <div className="registerUser">
        <form onSubmit={(e) => this.submit(e, 1)} method="post">
          <div className="create-group">
            <h3>Group Payment</h3>

            <div className="form-group">
              <label>Group name</label>
              <p>{this.state.group_name}</p>
            </div>

            <div className="form-group">
              <label>Payment Type</label>
              {this.state.subscription == '1time' ? (
                <p>One time Payment</p>
              ) : (
                <p>{this.state.recurrence} Payment</p>
              )}
            </div>

            <div className="form-group">
              <label>Payment Amount</label>
              <p>
                {this.state.amount} - {this.state.currency}
              </p>
            </div>

            <div className="form-group">
              <label>Auto Payment</label>
              <br />
              <FormControlLabel
                aria-label="On"
                control={<Radio name="auto_payment" id="auto_payment" />}
                label="On"
                value="0"
                onClick={this.handlePost}
                checked={this.state.auto_payment_on}
              />
              <FormControlLabel
                aria-label="Off"
                control={<Radio name="auto_payment" id="auto_payment" />}
                label="Off"
                value="1"
                onClick={this.handlePost}
                checked={this.state.auto_payment_off}
              />
            </div>
            <div className="form-group">
              <Button
                variant="primary"
                onClick={(e) => this.submit(e, 0)}
                size="compact float-left"
              >
                Payment
              </Button>
            </div>
            <br />
            <br />
          </div>
        </form>
      </div>
    );
  }
}

export default PaymentGroup;
