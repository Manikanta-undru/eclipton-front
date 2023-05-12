import md5 from 'md5';
import QRCode from 'qrcode.react';
import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { formatDate } from '../../globalFunctions';
import {
  addAPIKey,
  deleteAPIKey,
  getAPIKeys,
  updateAPIKey,
} from '../../http/settings-calls';
import { getUserDetails } from '../../http/wallet-calls';
import './styles.scss';

class APIKeys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editKey: '',
      expanded: 0,
      loading: true,
      perms: {
        trading: true,
        withdraw: false,
        transfer: false,
      },
      newKey: '',
      keys: [],
    };
  }

  componentDidMount() {
    this.getAPIs();
  }

  getAPIs = (symbol) => {
    getAPIKeys().then(
      async (resp) => {
        this.setState({
          keys: resp,
          loading: false,
        });
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

  selectCurrency = (cur) => {
    this.props.history.push(`/wallet/address/${cur.currencySymbol}`);
    this.setState({
      currentCoin: cur,
    });
  };

  makeid = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  addNew = () => {
    const time = Math.floor(Date.now() / 1000);
    let key = this.makeid(10);
    key = `${md5(key)}-${md5(time)}`;
    this.setState({
      newKey: key,
    });
  };

  check = (e) => {
    const val = e.target.value;
    const { perms } = this.state;
    perms[val] = !perms[val];
    this.setState({
      perms,
    });
  };

  cancel = (e) => {
    this.setState({
      newKey: '',
      editKey: '',
      perms: {
        trading: true,
        withdraw: false,
        transfer: false,
      },
    });
  };

  save = (e) => {
    e.preventDefault();

    switchLoader('Submitting Request...');
    const data = {
      key: this.state.newKey,
      perms: this.state.perms,
    };

    addAPIKey(data).then(
      async (resp) => {
        alertBox(true, 'API Key has been saved', 'success');
        switchLoader();
        this.getAPIs();
        this.cancel();
      },
      (error) => {
        alertBox(true, error == undefined ? 'Error' : error.data.message);
        switchLoader();
      }
    );
  };

  update = (e) => {
    e.preventDefault();

    switchLoader('Submitting Request...');
    const data = {
      id: this.state.editId,
      key: this.state.editKey,
      perms: this.state.perms,
    };

    updateAPIKey(data).then(
      async (resp) => {
        alertBox(true, 'API Key has been updated', 'success');
        switchLoader();
        this.getAPIs();
        this.cancel();
      },
      (error) => {
        alertBox(true, error == undefined ? 'Error' : error.data.message);
        switchLoader();
      }
    );
  };

  delete = (id) => {
    switchLoader('Submitting Request...');
    const data = {
      id,
    };

    deleteAPIKey(data).then(
      async (resp) => {
        alertBox(true, 'API Key has been deleted', 'success');
        switchLoader();
        this.getAPIs();
        this.cancel();
      },
      (error) => {
        alertBox(true, error == undefined ? 'Error' : error.data.message);
        switchLoader();
      }
    );
  };

  expand = (id) => {
    if (this.state.expanded == id) {
      this.setState({
        expanded: 0,
      });
    } else {
      this.setState({
        expanded: id,
      });
    }
  };

  edit = (el) => {
    this.setState({
      editId: el._id,
      editKey: el.key,
      perms: el.permissions,
    });
  };

  render() {
    return (
      <div className="container my-wall-container apiPage">
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}

          <div className="col-sm empty-container-with-out-border center-column">
            <WalletMenuMobile {...this.props} />

            <div className="tab row ">
              <div className="col-md-12 p-1">
                <div className="bordered p-3">
                  <div className="form-group">
                    <Button onClick={this.addNew}>
                      <i className="fa fa-plus" /> Add Key
                    </Button>
                  </div>
                  <hr />
                  {this.state.newKey !== '' ? (
                    <div className="mt-4">
                      <div className="key">{this.state.newKey}</div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.trading}
                          value="trading"
                          onChange={this.check}
                        />{' '}
                        Trading
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.withdraw}
                          value="withdraw"
                          onChange={this.check}
                        />{' '}
                        Withdraw
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.transfer}
                          value="transfer"
                          onChange={this.check}
                        />{' '}
                        Transfer
                      </div>
                      <div className="mt-3">
                        <Button onClick={this.save}>Save</Button>{' '}
                        <Button variant="primary-outline" onClick={this.cancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : this.state.editKey !== '' ? (
                    <div className="mt-4">
                      <div className="key">{this.state.editKey}</div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.trading}
                          value="trading"
                          onChange={this.check}
                        />{' '}
                        Trading
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.withdraw}
                          value="withdraw"
                          onChange={this.check}
                        />{' '}
                        Withdraw
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={this.state.perms.transfer}
                          value="transfer"
                          onChange={this.check}
                        />{' '}
                        Transfer
                      </div>
                      <div className="mt-3">
                        <Button onClick={this.update}>Update</Button>{' '}
                        <Button variant="primary-outline" onClick={this.cancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h3 className="subtitle">API Keys</h3>
                      {this.state.keys.length == 0 && <p>No Keys Found</p>}
                      {this.state.keys.map((el, i) => (
                        <div className="key-item" key={i}>
                          <div
                            className="flex-row-between"
                            onClick={() => this.expand(el._id)}
                          >
                            <div>
                              <strong className="text-big">{el.key}</strong>
                              <div className="text-small">
                                {formatDate(el.createdAt)}
                              </div>
                            </div>
                            {el._id == this.state.expanded ? (
                              <i className="fa fa-chevron-up" />
                            ) : (
                              <i className="fa fa-chevron-down" />
                            )}
                          </div>
                          {el._id == this.state.expanded && (
                            <div className="expanded">
                              <QRCode value={el.key} className="qrImg" />
                              <div className="key-perms">
                                <ul>
                                  {el.permissions.trading && <li>Trading</li>}
                                  {el.permissions.withdraw && <li>Withdraw</li>}
                                  {el.permissions.transfer && <li>Transfer</li>}
                                </ul>
                              </div>
                              <div className="key-actions">
                                <div>
                                  <Button onClick={() => this.edit(el)}>
                                    Edit
                                  </Button>
                                </div>
                                <div>
                                  <Button
                                    variant="primary-outline"
                                    onClick={() => this.delete(el._id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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

export default APIKeys;
