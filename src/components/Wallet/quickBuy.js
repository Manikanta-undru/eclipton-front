import React, { useState, useEffect } from 'react';
import A from '../A';
import Button from '../Button';
import './styles.scss';
import Spinner from '../Spinner';
import { getTradePairs } from '../../http/wallet-calls';
import { ticker } from '../../hooks/socket';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import { connect } from 'react-redux';

function QuickBuy(props) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    allPairs();
    setLoading(false);
  }, []);

  const allPairs = () => {
    getTradePairs().then(
      async (resp) => {
        setCoins(resp);
        setError('');
        setLoading(false);
        listenSocket(resp);
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

  const listenSocket = (da) => {
    ticker(`liquiditypairdetails`, (data) => {
      if (data != undefined && data != null && data != '') {
        const el = document.getElementById(`mp${data.pair}`);

        if (el != null) {
          el.innerText = data.marketPrice?.toFixed(2);
        }
      }
    });
  };

  return (
    <div
      className={`cardBody widget balanceWidget quickBuy ${
        props.variant != null && ` ${props.variant}`
      }`}
    >
      <div className="col">
        <ul className="list-group w-100">
          <li className="widgetTitle">
            <i className="fa fa-bitcoin" /> <span>Buy Cryptocurrency</span>
          </li>
        </ul>
        <div className="widgetBody open" id="walletWidgetBody">
          <div className="balances">
            {loading ? (
              <Spinner />
            ) : (
              coins.length > 0 &&
              coins.map((e, i) =>
                e.toCurrency == null ? null : e.toCurrency.currencySymbol ==
                  'EUR' ? (
                  <div className="row itemrow" key={i}>
                    <div className="col">
                      <div className="item balancePoint_left">
                        <div className="pair">{`${e.pair}`}</div>
                        <div className="marketPrice" id={`mp${e.pair}`}>
                          {e.marketPrice?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {props.samsubStatus == 'Accept' && (
                      <div className="col">
                        <div className="right float-end balancePoint_right">
                          <A href={`/wallet/trading/${e.pair}`}>
                            <Button variant="lightGreen_btn" size="small">
                              Buy
                            </Button>
                          </A>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(mapCommonStateToProps)(QuickBuy);
