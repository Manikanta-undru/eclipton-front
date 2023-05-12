import React, { useState, useEffect } from 'react';
import A from '../A';
import Button from '../Button';
import { getAllBalance } from '../../http/wallet-calls';
import { getMonthlyBalance } from '../../http/trans-calls';
import walletCheck from '../../hooks/walletCheck';
import './styles.scss';

function WalletBalanceWidget(props) {
  const [coins, setCoins] = useState([]);
  const [balance, setBalance] = useState(0);
  const [monthlyBlance, setMonthlyBalance] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // var kycStatus = window.localStorage.getItem("kycStatus");
    // if(kycStatus != null){
    //     kycStatus = kycStatus;
    //     setLoading(false);
    //     setStatus(kycStatus);
    //     allBalance();
    // }
    walletCheck().then(
      (resp) => {
        window.localStorage.setItem('kycStatus', resp.data.status);
        setLoading(false);
        setStatus(resp.data.status == undefined ? '' : resp.data.status);
        allBalance();
      },
      (err) => {
        setStatus('');
        setLoading(false);
        setError('Authentication Error!');
      }
    );
  }, []);

  const getMonthly = (co = coins) => {
    const date = new Date();
    const firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).toISOString();
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).toISOString();

    getMonthlyBalance({ start: firstDay, end: lastDay }).then(
      (resp) => {
        if (resp.length > 0) {
          let balance = 0;
          resp.forEach((element) => {
            balance += element.amount * co[element.currency];
          });
          setMonthlyBalance(balance);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const allBalance = () => {
    // var allBalance = window.localStorage.getItem("allBalance");
    // if(allBalance != null){
    //     allBalance = JSON.parse(allBalance);
    //     setCoins(allBalance);
    //     setError('');
    //     var balance = 0;
    //       allBalance.forEach(element => {
    //         balance += element.balance*element.EstimatedUSD;
    //       });
    //       setBalance(balance);

    //     setLoading(false);
    // }
    getAllBalance().then(
      async (resp) => {
        setCoins(resp.data);
        let balance = 0;
        const len = resp.data.length;
        const co = {};
        resp.data.forEach((element, i) => {
          balance += element.balance / element.EstimatedUSD;
          co[element.currencySymbol] = element.EstimatedUSD;
          if (i == len - 1) {
            setBalance(balance);
            getMonthly(co);
            setError('');
            setLoading(false);
          }
        });
        window.localStorage.setItem('allBalance', JSON.stringify(resp.data));
      },
      (error) => {
        try {
          setStatus('');
          setLoading(false);
          setError(error.data.toString());
        } catch (error) {
          setStatus('');
          setLoading(false);
          setError('Error');
        }
      }
    );
  };

  const toggleBody = () => {
    const body = document.getElementById('walletWidgetBody');
    if (body != null) {
      if (body.classList.contains('open')) {
        body.classList.remove('open');
      } else {
        body.classList.add('open');
      }
    }
  };

  return (
    <div
      className={`row myCwallet cardBody widget balanceWidget m-0 ${
        props.variant != null && ` ${props.variant}`
      }`}
    >
      <div className="col">
        <div className="widgetTitle mb-0 pointer" onClick={toggleBody}>
          <div> My Crypto Wallet</div>
          {/* <i className="fa fa-chevron-down text-small" ></i> */}
        </div>
        {/* {
                  status == null ?
                  <div></div>
                  : 
                  status == 'Accept' ? */}
        <div className="widgetBody" id="walletWidgetBody">
          <h4 className="full-show">Balance</h4>
          <div className="balance">${balance?.toFixed(6)}</div>
          <h4 className="full-show">Earnings This Month</h4>
          <div className="balance full-show">${monthlyBlance?.toFixed(6)}</div>
          <div className="flex-row-between full-hide">
            <A href="/wallet/deposit">
              <Button variant="dark" size="small" className="secondaryBtn me-2">
                Receive
              </Button>
            </A>
            <A href="/wallet/transfer">
              <Button variant="dark" size="small" className="primaryBtn">
                Send
              </Button>
            </A>
          </div>
          {/* <div className="text-right full-show">
                    <A href="/wallet" className="see-more">Show More</A>
                  </div> */}
        </div>
        {/* :
                <div className="widgetBody open" id="walletWidgetBody">
                  <p>Your KYC verification is not yet done.</p>
                  <A href="/wallet/verification"><Button variant="dark" size="small" className="w-98">Verify Now</Button></A>
                </div>
                } */}
      </div>
    </div>
  );
}

export default WalletBalanceWidget;
