import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { confirmCancelWhitelist, updateTFA } from '../../http/wallet-calls';
import './styles.scss';

class WalletConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
    };
  }

  componentDidMount() {
    try {
      const { type } = this.props.match.params;
      this.setState(
        {
          type,
        },
        () => {
          if (type == 'address') {
            this.confirmAddress();
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.type != this.props.match.params.type) {
      try {
        const { type } = this.props.match.params;
        this.setState(
          {
            type,
          },
          () => {
            if (type == 'address') {
              this.confirmAddress();
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  confirmAddress = () => {
    let l = this.props.location.search;
    l = l.replace('?', '');

    confirmCancelWhitelist({
      reqUrl: l,
    }).then(
      async (resp) => {
        if (resp.status == true) {
          alertBox(true, resp.message, 'success');
          this.props.history.push(`/wallet/address/${resp.data.currency}`);
        } else {
          alertBox(true, resp.message);
          this.props.history.push(`/wallet/address/${resp.data.currency}`);
        }
      },
      (err) => {
        alertBox(true, 'Something went wrong');
        this.props.history.push('/wallet/address/BTC');
      }
    );
  };

  submit = (e) => {
    e.preventDefault();
    if (this.state.code == null || this.state.code == '') {
      alertBox(true, 'Please enter the code');
    } else {
      switchLoader('Updating...');
      const data = {
        tfa_code: this.state.code,
      };

      updateTFA(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              alertBox(true, resp.message, 'success');
              this.setState({
                code: '',
              });
              window.location.reload();
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

          <div className="col-sm empty-container-with-border center-column text-center">
            <WalletMenuMobile {...this.props} />
            {this.state.type == null ? (
              <div className="p-4">This link has been expired</div>
            ) : (
              <Spinner />
            )}
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

export default WalletConfirm;
