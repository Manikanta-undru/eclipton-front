import React, { useState } from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import CoinSelector from '../../components/CoinSelector';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { formatDate } from '../../globalFunctions';
import {
  deleteWhitelist,
  getAllPairs,
  getUserDetails,
  getWithdrawAddresses,
  whitelistAddress,
} from '../../http/wallet-calls';
import './styles.scss';

class WithdrawAddresses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      loading: true,
      reset: false,
      tfa_status: null,
      with_pass: null,
      to: '',
      address: '',
      tag: '',
      name: '',
      withdrawals: null,
      amountCurrency: '',
      amount: '',
      usdCurrency: '',
      addresses: [],
      usd: '',
      tfa: '',
      note: '',
      fee: 0,
      estUsd: 0,
      agree: false,
      takeFee: false,
      status: null,
      currentCoin:
        this.props.match.params.coin == undefined
          ? ''
          : this.props.match.params.coin,
      coins: [],
      content: 'loading',
      currentTab: 0,
      coin: null,
    };
  }

  changeTab = (newValue) => {
    this.setState({
      currentTab: newValue,
    });
  };

  componentDidMount() {
    try {
      this.setState(
        {
          coin: this.props.match.params.coin,
          currentCoin: this.props.match.params.coin,
        },
        () => {
          this.allPairs(this.props.match.params.coin);
          this.getAddresses(this.props.match.params.coin);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.coin != this.props.match.params.coin) {
      try {
        this.setState(
          {
            coin: this.props.match.params.coin,
            currentCoin: this.props.match.params.coin,
          },
          () => {
            this.allPairs(this.props.match.params.coin);
            this.getAddresses(this.props.match.params.coin);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  allPairs = (coin) => {
    if (coin != null) {
      if (this.state.coins.length > 0) {
        /* empty */
      } else {
        getAllPairs().then(
          async (resp) => {
            const allPairs = resp.data;
            allPairs.forEach((element) => {
              if (element.currencySymbol == coin) {
                this.setState(
                  {
                    coins: allPairs,
                    error: '',
                  },
                  () => {
                    if (element != null) {
                      this.setState({
                        currentCoin: element,
                      });
                    }
                  }
                );
              }
            });
          },
          (error) => {}
        );
      }
    }
  };

  getAddresses = (symbol) => {
    getWithdrawAddresses({
      currency: symbol,
    }).then(
      async (resp) => {
        if (resp.status == true) {
          this.setState({
            addresses: resp.data,
          });
        } else {
          this.setState({
            addresses: [],
          });
        }
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  getDetails = () => {
    getUserDetails().then(
      async (resp) => {
        this.setState({
          loading: false,
          tfa_status: resp.data.tfa_status,
        });
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  delete = (el) => {
    deleteWhitelist({
      _id: el._id,
      currency: el.currency,
    }).then(
      async (resp) => {
        if (resp.status == true) {
          alertBox(true, resp.message, 'success');

          this.getAddresses(el.currency);
        } else {
          alertBox(true, resp.message);
        }
        switchLoader();
      },
      (err) => {
        alertBox(true, 'Something went wrong');
      }
    );
  };

  selectCurrency = (cur) => {
    this.setState({
      currentCoin: cur,
      address: '',
      tag: '',
      name: '',
    });
    this.props.history.push(`/wallet/address/${cur.currencySymbol}`);
  };

  inputChange = (e) => {
    const val = e.target.value;
    const input = e.target.getAttribute('name');
    this.setState({
      [input]: val,
      fields_enter: 1,
    });
  };

  submit = (e) => {
    e.preventDefault();

    const regex = /^[a-zA-Z]+$/;
    if (this.state.name.search(regex) === -1) {
      alertBox(true, 'Only alphabets are allowed for username');
    } else {
      const selectedCurrancy = this.state.coins.find(
        (x) => x.currencySymbol == this.props.match.params.coin
      );
      switchLoader('Submitting Request...');

      const data = {
        currency: selectedCurrancy.currencySymbol,
        currencyId: selectedCurrancy._id,
        address: this.state.address,
        status: 1,
        name: this.state.name,
        tag: this.state.tag,

        // "url": config.frontEnd+"wallet/confirm/address/",
        url: `${process.env.REACT_APP_FRONTEND}wallet/confirm/address/`,
        whitelistStatus: 1,
      };
      whitelistAddress(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              this.setState({
                address: '',
                name: '',
                tag: '',
              });

              alertBox(true, resp.message, 'success');
            } else {
              alertBox(true, resp.message);
            }
          } catch (error) {
            alertBox(true, error == undefined ? 'Error' : error.toString());
          }
          switchLoader();
        },
        (error) => {
          alertBox(true, error == undefined ? 'Error' : error.toString());
          switchLoader();
        }
      );
    }
  };

  render() {
    return (
      <div className="container my-wall-container depositPage">
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}

          <div className="col-sm empty-container-with-border center-column">
            <WalletMenuMobile {...this.props} />

            <div
              className={`tab row ${this.state.currentTab != 0 && 'd-none'}`}
              style={{ background: 'white' }}
            >
              <div className="col-md-5">
                <div className="bordered addBox_align">
                  <CoinSelector
                    selectCoin={this.selectCurrency}
                    selected={this.state.currentCoin}
                  />
                </div>
              </div>
              <div className="col-md-7">
                <div className="bordered ">
                  <form action="" method="POST" onSubmit={this.submit}>
                    <div className="form-group">
                      <label>Address User Name </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        value={this.state.name}
                        name="name"
                        onChange={this.inputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>To Address </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="To Address"
                        value={this.state.address}
                        name="address"
                        onChange={this.inputChange}
                      />
                    </div>
                    {this.state.currentCoin == 'XRP' && (
                      <div className="form-group">
                        {' '}
                        <label>Tag </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tag"
                          value={this.state.tag}
                          name="tag"
                          onChange={this.inputChange}
                        />
                      </div>
                    )}
                    <div className="form-group pull-right pt-2">
                      <Button className="primaryBtn">Add Address</Button>
                    </div>
                  </form>
                  <hr className="mt-5" />
                  <div className="mt-5">
                    <h3 className="subtitle">Address Book</h3>
                    {this.state.addresses.length == 0 && (
                      <p>No Address Found</p>
                    )}
                    {this.state.addresses.map((el, i) => (
                      <Accordion
                        title={el.name}
                        address={el.address}
                        remove={() => this.delete(el)}
                        date={formatDate(el.createddate)}
                        key={i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            <WalletAllBalance />
          </div>
        </div>
      </div>
    );
  }
}
function Accordion({ title, address, remove, date }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const copyAdd = () => {
    navigator.clipboard.writeText(address);
    alertBox(true, 'Address Copied!', 'success');
  };
  return (
    <div className="accordion-address">
      <div className="accordion-header">
        <h2 className="accordion-title">{title || 'Address'} </h2>

        <div className="accordion-action">
          <div className="angle" onClick={toggleAccordion}>
            {!isOpen ? (
              <i className="fa-solid fa-angle-down" />
            ) : (
              <i className="fa-solid fa-angle-up" />
            )}
          </div>
          <div className="clipboard" onClick={copyAdd}>
            <i className="fa-regular fa-clipboard" />
          </div>
          <div className="close" onClick={remove}>
            <i className="fa-solid fa-xmark" />
          </div>
        </div>
      </div>
      <div
        className="accordion-content"
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? '1' : '0',
          transition: 'max-height 0.3s ease-out, opacity 0.2s ease-out',
        }}
      >
        <div>
          <p>{address}</p>
          <span>{date} </span>
        </div>
      </div>
    </div>
  );
}
export default WithdrawAddresses;
