import React, { useState, useEffect } from 'react';
import './styles.scss';
import Spinner from '../Spinner';
import { getAllBalance } from '../../http/wallet-calls';

function WalletAvailableBalance(props) {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // walletCheck().then(resp=>{
    //   window.localStorage.setItem("kycStatus", resp.data.status);
    //   setLoading(false);
    //   setStatus((resp.data.status == undefined) ? '' : resp.data.status);
    allBalance();
    // }, err => {
    //   setLoading(false);
    //   setError("Authentication Error!");
    // })
  }, []);

  const allBalance = () => {
    getAllBalance().then(
      async (resp) => {
        setCoins(resp.data);
        setError('');
        let balance = 0;
        resp.data.forEach((element) => {
          balance += element.balance / element.EstimatedUSD;
        });
        setBalance(balance);
        setLoading(false);
        // window.localStorage.setItem("allBalance", JSON.stringify(resp.data));
      },
      (error) => {
        try {
          setLoading(false);
          setError(error.data.toString());
        } catch (error) {
          setLoading(false);
          setError('Error');
        }
      }
    );
  };

  const toggleBody = () => {
    const body = document.getElementById('walletWidgetBody');
    if (body.classList.contains('open')) {
      body.classList.remove('open');
    } else {
      body.classList.add('open');
    }
  };

  return (
    console.log(coins, 'cois'),
    (
      <div
        className={`row empty-inner-container-with-out-border widget allBalance ${
          props.variant != null && ` ${props.variant}`
        }`}
      >
        <div className="col">
          <div className="widgetBody open" id="walletWidgetBody">
            <div className="balances">
              {loading ? (
                <Spinner />
              ) : (
                coins.length > 0 &&
                coins.map((e, i) =>
                  e.balance > 0 ? (
                    <div className="row itemrow" key={i}>
                      <div className="col-md-7">
                        <div className="item">
                          <img src={e.image} />
                          <div>
                            <h4 className="currency">{e.currencyName}</h4>
                            <div className="balance">
                              {e.balance?.toFixed(8)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="right">
                          <div className="usd">USD</div>
                          <div className="usd-balance">
                            {(e.balance / e.EstimatedUSD)?.toFixed(8)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default WalletAvailableBalance;
