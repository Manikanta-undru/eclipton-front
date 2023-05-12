import React, { useState, useEffect } from 'react';
import { getAllBalance } from '../../http/wallet-calls';
import { getMonthlyBalance } from '../../http/trans-calls';
import './styles.scss';

function InlineBalance(props) {
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
    allBalance();

    // walletCheck().then(resp=>{
    //   console.log(resp,"resp")
    //   window.localStorage.setItem("kycStatus", resp.data.status);
    //   setLoading(false);
    //   setStatus((resp.data.status == undefined) ? '' : resp.data.status);
    //   // allBalance();
    // }, err => {
    //   setStatus('');
    //   setLoading(false);
    //   setError("Authentication Error!");
    // })
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
        console.log(resp.data, 'checkresp');
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

  return <span className="balance">${balance?.toFixed(6)}</span>;
}

export default InlineBalance;
