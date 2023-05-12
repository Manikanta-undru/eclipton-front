import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner/index';
import { getAllPairs } from '../../http/wallet-calls';
import './styles.scss';
import DebouncedInput from '../DebouncedInput/DebouncedInput';

function CoinSelector(props) {
  const [coins, setCoins] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const [currentCoin, setCurrent] = useState(props.selected);

  const selectCoin = (val, i) => {
    setCurrent(val.currencySymbol);
    props.selectCoin(val);
  };

  useEffect(() => {
    getCoins();
  }, []);

  // useEffect(() => {
  //     if(props.selected != undefined && props.selected != null && props.selected != ''){
  //     setCurrent(props.selected);
  //     }
  // }, [props.selected]);

  const getCoins = () => {
    // var allPairs = window.localStorage.getItem("allPairs");
    // if(allPairs != null){
    //     allPairs = JSON.parse(allPairs);
    //     setCoins(allPairs);
    // }
    getAllPairs().then(
      async (resp) => {
        setCoins(resp.data);
      },
      (error) => {
        setCoins(null);
      }
    );
  };

  const search = (val) => {
    let i = 1;
    if (val == '') {
      setFiltered(null);
    } else {
      val = val.toLowerCase();
      i += 1;
      const temp = coins;
      const selected = [];
      coins.forEach((element) => {
        if (
          element.currencyName.toLowerCase().indexOf(val) != -1 ||
          element.currencySymbol.toLowerCase().indexOf(val) != -1
        ) {
          selected.push(element);
        }
      });
      setFiltered(selected);
    }
  };

  return (
    <div className="coinSelector">
      {/* <input type="text" placeholder="Search" onChange={search} /> */}
      <DebouncedInput type="text" placeholder="Search" onChange={search} />
      <div className="bottom-border-list">
        {coins == null ? (
          <Spinner />
        ) : filtered == null ? (
          coins.map((e, i) =>
            e.curnType == 1 || e.currencySymbol == 'BLCK' ? null : (
              <div
                className={`list-item pointer ${
                  e.currencySymbol == currentCoin ? 'active' : ''
                }`}
                onClick={() => {
                  selectCoin(e, i);
                }}
                key={i}
              >
                {`${e.currencyName} (${e.currencySymbol})`}{' '}
                <span className="fa fa-chevron-right" />
              </div>
            )
          )
        ) : (
          filtered.map((e, i) =>
            e.curnType == 1 || e.currencySymbol == 'BLCK' ? null : (
              <div
                className={`list-item pointer ${
                  e.currencySymbol == currentCoin ? 'active' : ''
                }`}
                onClick={() => {
                  selectCoin(e, i);
                }}
                key={i}
              >
                {`${e.currencyName} (${e.currencySymbol})`}{' '}
                <span className="fa fa-chevron-right" />
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default CoinSelector;
