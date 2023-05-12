import React, { useState } from 'react';
import { connect } from 'react-redux';
import { alertBox } from '../../commonRedux';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import A from '../A';
import './styles.scss';

function WalletMenu(props) {
  const [p2pload, setp2pload] = useState('');
  const [epayload, setepayload] = useState('');

  const { samsubStatus } = props;

  const p2p = () => {
    if (samsubStatus === 'Accept') {
      setp2pload('active');
      window.open(
        `${process.env.REACT_APP_P2PBASE}?token=${localStorage.getItem('jwt')}`
      );
    } else if (samsubStatus === 'pending') {
      setp2pload('inactive');
      alertBox(true, 'You need to approve KYC to use P2P');
      props.history.push('/wallet/verification');
    } else {
      setp2pload('inactive');
      alertBox(true, 'You need to finish KYC to use P2P');
      props.history.push('/wallet/verification');
    }
  };

  const epay = () => {
    if (samsubStatus === 'Accept') {
      setepayload('active');
      window.open(
        `${process.env.REACT_APP_EPAYBASE}?token=${localStorage.getItem('jwt')}`
      );
    } else if (samsubStatus === 'pending') {
      setepayload('inactive');
      alertBox(true, 'You need to approve KYC to use Epay');
      props.history.push('/wallet/verification');
    } else {
      setepayload('inactive');
      alertBox(true, 'You need to finish KYC to use Epay');
      props.history.push('/wallet/verification');
    }
  };
  return (
    <div className="widget cardBody SocialMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="list-group-item d-flex align-items-center header-drak widgetTitle">
              <i className="fa fa-bars" aria-hidden="true" /> Menu
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/wallet/deposit' &&
                p2pload == '' &&
                'current'
              }`}
            >
              <A href="/wallet/deposit" className="align-items-center d-flex">
                <span className="aicon fa fa-bank" /> Deposit
              </A>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center ">
              <A
                href="/buy-crypto-credit-card"
                className="align-items-center d-flex pointer"
              >
                <span className="aicon fa fa-bitcoin" /> Buy Crypto
              </A>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center ">
              <A
                href="/wallet/BuyCryptoOrders"
                className="align-items-center d-flex pointer"
              >
                <span className="aicon fa-solid fa-clock-rotate-left" /> Buy
                Crypto History
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                p2pload == 'active' && 'current'
              }`}
            >
              <span onClick={p2p} className="align-items-center d-flex pointer">
                <span className="aicon fa fa-retweet" /> P2P
              </span>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/wallet/transfer' && 'current'
              }`}
            >
              <A href="/wallet/transfer" className="align-items-center d-flex">
                <span className="aicon fa fa-angle-double-right" /> Send /
                Transfer
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/wallet/transactions' && 'current'
              }`}
            >
              <A
                href="/wallet/transactions"
                className="align-items-center d-flex"
              >
                <span className="aicon fa fa-exchange " /> Transactions
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/wallet/verification' && 'current'
              }`}
            >
              <A
                href="/wallet/verification"
                className="align-items-center d-flex"
              >
                <span className="aicon fa fa-check" /> Verification
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path == '/wallet/tfa' && 'current'
              }`}
            >
              <A href="/wallet/tfa" className="align-items-center d-flex">
                <span className="aicon fa fa-shield" /> TFA
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path.indexOf('/wallet/address/') != -1 && 'current'
              }`}
            >
              <A
                href="/wallet/address/BTC"
                className="align-items-center d-flex"
              >
                <span className="aicon fa fa-book" /> Address Book
              </A>
            </li>

            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path.indexOf('/wallet/trading/') != -1 && 'current'
              }`}
            >
              <A href="/wallet/trading" className="align-items-center d-flex">
                <span className="aicon fa fa-line-chart" /> Trade
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.match.path.indexOf('/wallet/withdraw/') != -1 && 'current'
              }`}
            >
              <A href="/wallet/withdraw" className="align-items-center d-flex">
                <span className="aicon fa fa-angle-double-down" /> Withdraw
              </A>
            </li>
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(epayload == 'active' && 'current')}>
                <span onClick={epay}  className="align-items-center d-flex pointer"><span className="aicon fa fa-retweet"></span> Epay</span>
              </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default connect(mapCommonStateToProps)(WalletMenu);
