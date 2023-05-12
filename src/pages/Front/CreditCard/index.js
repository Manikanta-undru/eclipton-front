import React, { useEffect, useRef, useState } from 'react';

import { GetAssetImage } from '../../../globalFunctions';
import {
  getEstimatedRates,
  getCurrenciesList,
  getUserCryptoAddress,
  Createpreparedorder,
} from '../../../http/wallet-calls';
import {
  getSumsubToken,
  displayApplicantDataForFe,
} from '../../../http/http-calls';
import '../style.scss';
import './style.scss';
import logo from '../images/logo-dark.png';
import 'react-phone-number-input/style.css';
import A from '../../../components/A';

import { alertBox } from '../../../commonRedux';

function CreditCard(props) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setUser] = useState(props.currentUser);

  const [buyCoin, setBuyCoin] = useState('BTC');
  const [buyCoinName, setBuyCoinName] = useState('Bitcoin');
  const [payCoin, setPayCoin] = useState('EUR');
  const [payCoinName, setPayCoinName] = useState('Euro');
  const [minValid, setMin] = useState();
  const [maxValid, setMax] = useState();
  const [buyAmt, setBuyAmt] = useState();
  const [payAmt, setPayAmt] = useState(100);
  const [currency, setCurrency] = useState([]);
  const [FiatCurrency, setFiatCurrency] = useState([]);
  const [token, setToken] = useState([]);
  const [phonenumber, setPhonenumber] = useState('');
  const [Usermail, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [kycstatus, setKycstatus] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [fee, setFee] = useState();
  const [rate, setRate] = useState();
  const [feecurrency, setFeecurrency] = useState();
  const [side, setSide] = useState('from');
  const [page, setPage] = useState('Rates');
  const swipeluxRef = useRef(null);

  useEffect(() => {
    if (accessToken != '') {
      if (!document.getElementById('swipelux-sdk-script')) {
        const script = document.createElement('script');
        script.src = 'https://app.dev.swipelux.com/sdk.js';
        script.async = true;
        script.defer = true;
        script.id = 'swipelux-sdk-script';
        document.body.appendChild(script);
        script.onload = () => {
          const widget = new window.SwipeluxWidget(swipeluxRef.current, {
            apiKey: '75685a4a-ea2d-4154-8611-5bc9d1cccf0b',
            orderToken: accessToken,
          });
          widget.init();
        };
      }
    }
    estimateRates();

    const interval = setInterval(() => {
      console.log(payAmt, 'payAmt');

      estimateRates();
    }, 7000);
    return () => clearInterval(interval);
  }, [buyAmt, payAmt, side, payCoin, buyCoin, accessToken]);

  useEffect(() => {
    const {
      walletDetails: { cognito_id },
    } = props.currentUser;
    getSumsubToken({ cognitoUserId: cognito_id }).then((result) => {
      if (result) {
        setToken(result.token);
      }
    });

    getAddresses(buyCoin);

    displayApplicantDataForFe({ cognitoUserId: cognito_id }).then((res) => {
      const samStatus = res?.data?.applicantStatus || res?.data?.status;

      if (samStatus == 'Accept') {
        console.log('set the status');
        setKycstatus(samStatus);
        const getphone = res?.data?.phone;
        if (getphone) {
          setPhonenumber(getphone);
        }
        const getemail = res?.data?.email;
        if (getemail) {
          setEmail(getemail);
        }

        CurrenciesList(payCoin);
        estimateRates();
      }
    });
  }, []);

  const CurrenciesList = (paycoinName) => {
    getCurrenciesList().then((resp) => {
      const items = resp.data;
      const grouparray = [];
      const array = [];
      const i = 0;
      for (const element of items) {
        array.push(element.fiat.code);
        if (!grouparray[element.fiat.code]) grouparray[element.fiat.code] = [];
        grouparray[element.fiat.code].push(element.crypto.code);
      }

      setFiatCurrency(Array.from(new Set(array)));

      setCurrency(grouparray[paycoinName]);
    });
  };

  const getAddresses = (coin) => {
    getUserCryptoAddress().then((resp) => {
      if (resp.status == true) {
        resp.data.map((item, index) => {
          if (item.currency_symbol == coin) {
            setAddress(item.address);
          }
        });
      }
    });
  };

  const estimateRates = () => {
    // setSide(newside)

    const data = {
      from_currency: payCoin,
      to_currency: buyCoin,
      pay_amount: payAmt,
      side,
      buy_amount: buyAmt,
    };

    getEstimatedRates(data).then(
      (resp) => {
        if (resp.status == true) {
          const response = resp.data;
          if (response.amounts) {
            const { amounts } = response;

            if (side == 'from') {
              setBuyAmt(amounts.to.amount);
            } else {
              setPayAmt(amounts.from.amount);
            }
            setBuyCoinName(amounts.to.currency.name);
            setPayCoinName(amounts.from.currency.name);
            setMin(amounts.from.currency.minimum);
            setMax(amounts.from.currency.maximum);

            if (response.fee.details.length != 0) {
              const fee = response.fee.details[0].amount;
              const feeCurr = response.fee.details[0].currency;
              setRate(response.rate);
              setFee(fee);
              setFeecurrency(feeCurr);
            } else {
              const fee = 0;
              const feeCurr = buyCoin;
              setFee(fee);
              setFeecurrency(feeCurr);
            }
          }
        } else {
          setBuyAmt('');
          setFee('');
          setMin('');
          setMax('');
        }
      },
      (err) => {
        setLoading(false);
      }
    );
  };

  const buyChange = (e) => {
    setBuyCoin(e.target.value);
    getAddresses(e.target.value);
  };

  const payChange = (e) => {
    setPayCoin(e.target.value);
    CurrenciesList(e.target.value);
  };

  const buyAmtChange = (e) => {
    if (e.target.value != '') {
      setBuyAmt(e.target.value);

      setSide('to');
      if (side == 'to') {
        // estimateRates('to');
      }
    }
  };

  const payAmtChange = (e) => {
    if (e.target.value != '') {
      setPayAmt(e.target.value);

      setSide('from');
      if (side == 'from') {
        //  estimateRates('from');
      }
    }
  };
  const goBack = () => {
    setPage('Rates');
  };

  const submit = () => {
    if (buyAmt == null || payAmt == '' || buyCoin == '' || payCoin == '') {
      alertBox(true, 'Please fill all required fields');
    } else if (maxValid == '' || minValid == '') {
      alertBox(true, 'Something went wrong');
    } else if (Number(payAmt) < Number(minValid)) {
      alertBox(true, `Minimum transaction is ${minValid}`);
    } else if (Number(payAmt) > Number(maxValid)) {
      alertBox(true, `Maximum transaction is ${maxValid}`);
    } else if (address == '') {
      alertBox(true, 'Please generate the wallet address');
    } else if (token == '') {
      alertBox(true, 'Please verify kyc status');
    } else if (phonenumber == '' || Usermail == '') {
      alertBox(true, 'Please fill up the profile details');
    } else {
      const data = {
        from_currency: payCoin,
        to_currency: buyCoin,
        pay_amount: payAmt,
        side,
        buy_amount: buyAmt,
        token,
        address,
        phone: phonenumber,
        email: Usermail,
      };

      Createpreparedorder(data).then((resp) => {
        if (resp.status == true) {
          setPage('widget');
          setAccessToken(resp.data.accessToken);
        } else if (resp.Message) {
          alertBox(true, resp.Message);
        } else {
          alertBox(true, 'Something Went Wrong');
        }
      });
    }
  };

  return (
    <div className="creditCardPage">
      <div className="row">
        <div className="col-md-12">
          <nav>
            <div className="logo">
              <a href={`${process.env.REACT_APP_FRONTEND}home`}>
                <img src={GetAssetImage('landing-logo.png')} alt="" />
              </a>
            </div>
            <div className="dropdown_login">
              <ul className="nav">
                <a href={`${process.env.REACT_APP_FRONTEND}login`}>
                  <li>Social Wall</li>
                </a>
                <a href={`${process.env.REACT_APP_TRADEBASE}trade/BTC_USD`}>
                  <li>Exchange</li>
                </a>
                <li className="dropdown">
                  <span className="dropdown-toggle">Buy Crypto</span>
                  <ul className="dropdown-menu">
                    <a href="/buy-crypto-credit-card">
                      <li>Credit Card</li>
                    </a>
                  </ul>
                </li>
                <a href={`${process.env.REACT_APP_FRONTEND}contact-us`}>
                  <li>Contact Us</li>
                </a>
              </ul>
              {currentUser == null ? (
                <a href={`${process.env.REACT_APP_FRONTEND}login/`}>
                  <button className="login-btn">Login</button>
                </a>
              ) : (
                <a href={`${process.env.REACT_APP_FRONTEND}home/`}>
                  <button className="login-btn">Home</button>
                </a>
              )}
            </div>
          </nav>
        </div>

        <div className="col-md-12 ">
          {kycstatus != 'Accept' ? (
            <div className="swipelux-screen">
              <div className="col-sm">
                <p className="text-danger text-center mt-4">
                  Finish KYC to use this feature
                </p>
                <div className="text-center">
                  <A href="/wallet/verification">
                    <button className="btn btn-main">Go to Verification</button>
                  </A>
                </div>
              </div>
            </div>
          ) : Usermail == '' ? (
            <div className="swipelux-screen">
              <div className="col-sm">
                <p className="text-danger text-center mt-4">
                  Add Email id in your profile
                </p>
                <div className="text-center">
                  <A href="/profile">
                    <button className="btn btn-main">Go to Profile</button>
                  </A>
                </div>
              </div>
            </div>
          ) : phonenumber == '' ? (
            <div className="swipelux-screen">
              <div className="col-sm">
                <p className="text-danger text-center mt-4">
                  Add Phone Number in your profile
                </p>
                <div className="text-center">
                  <A href="/profile">
                    <button className="btn btn-main">Go to Profile</button>
                  </A>
                </div>
              </div>
            </div>
          ) : address == '' ? (
            <div className="swipelux-screen">
              <div className="col-sm">
                <p className="text-danger text-center mt-4">
                  Generate your wallet address{' '}
                </p>
                <div className="text-center">
                  <A href="/wallet/deposit">
                    <button className="btn btn-main">Go to Wallet</button>
                  </A>
                </div>{' '}
              </div>
            </div>
          ) : (
            page === 'Rates' && (
              <div className="swipelux-screen">
                {' '}
                <div className="inner-container">
                  <img src={logo} alt="logo" className="logo" />
                  <h2>Top up your BTC Wallet</h2>
                  <div className="input-row">
                    <div className="swipelux-input-group">
                      <label htmlFor>I Pay</label>
                      <input
                        className="form-control"
                        pattern="[0-9]+([,\.][0-9]+)?"
                        placeholder="Pay Amount"
                        name="pay_amount"
                        value={payAmt}
                        onChange={payAmtChange}
                        required
                        type="number"
                      />
                    </div>
                    <div className="swipelux-input-group-small">
                      <label htmlFor>{payCoinName}</label>
                      <select
                        className=" form-control"
                        name="from_currency"
                        value={payCoin}
                        onChange={payChange}
                      >
                        {FiatCurrency.map((curr, key) => (
                          <option value={curr} key={key}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="swipelux-input-group">
                      <label htmlFor>I Receive</label>
                      <input
                        className="form-control"
                        type="number"
                        pattern="[0-9]+([,\.][0-9]+)?"
                        placeholder="Receive Amount"
                        name="receive_amount"
                        value={buyAmt}
                        onChange={buyAmtChange}
                        required
                      />
                    </div>
                    <div className="swipelux-input-group-small">
                      <label htmlFor>{buyCoinName}</label>
                      <select
                        className=" form-control"
                        name="to_currency"
                        onChange={buyChange}
                      >
                        {currency.map((curr, key) => (
                          <option
                            value={curr}
                            selected={curr == 'BTC'}
                            key={key}
                          >
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="fee-row" />
                  <div className="btn-group">
                    <button className=" long" onClick={submit} type="button">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {page === 'widget' && (
            <div className="swipelux-screen-widget">
              <div className="inner-container">
                <div id="swipelux-widget" ref={swipeluxRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
