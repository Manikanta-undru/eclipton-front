import React from 'react';
import { history } from '../../store';
import './styles.scss';

function WalletMenu(props) {
  const changeMenu = (e) => {
    const val = e.target.value;

    if (val.indexOf('http') != -1) {
      window.open(val);
    } else {
      history.push(val);
    }
  };
  return (
    <div className="cardBody SocialMenus mobileMenu mb-2">
      <div className="">
        <div className="row">
          <ul className="list-group w-100 mb-0">
            <li className="list-group-item d-flex justify-content-between align-items-center header-drak widgetTitle text-white">
              Wallet Menu
            </li>
          </ul>
          <div className="p-4 ">
            <select
              className=" form-select dropdownBoxMenu"
              onChange={(e) => changeMenu(e)}
            >
              <option value="/wallet/deposit">Deposit</option>
              <option
                value={`${
                  process.env.REACT_APP_P2PBASE
                }?token=${localStorage.getItem('walletToken')}`}
              >
                P2P
              </option>
              <option value="/wallet/transfer">Send / Transfer</option>
              <option value="/wallet/BuyCryptoOrders">Buy Crypto Orders</option>
              <option value="/wallet/transactions">Transactions</option>
              <option value="/wallet/verification">Verification</option>
              <option value="/wallet/tfa">TFA</option>
              <option value="/wallet/address/BTC">Address Book</option>
              <option value="/wallet/trading">Trading</option>
              <option value="/wallet/withdraw">Withdraw</option>
              {/* <option value="/wallet/api">
                    API Keys
                </option> */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletMenu;
