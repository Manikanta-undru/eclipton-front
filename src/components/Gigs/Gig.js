import React from 'react';
import Button from '../Button';
import { postReport, postUnReport } from '../../http/http-calls';
import { removeGig } from '../../http/gig-calls';
import { alertBox } from '../../commonRedux';
import TopThumbCard from '../Cards/TopThumbCard';
import Modal from '../Popup';
import GigReportModal from '../Report/gig';
import { removeReport } from '../../http/wallet-calls';

class Gig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false,
      reported: props.post.reported,
      gig: props.post,
      category: '',
      reason: '',
      reportModal: false,
      lastData: null,
      lastI: null,
      lastType: null,
      isGigReport: false,
      filter: props.data,
    };
  }

  reportModal = () => {
    this.setState({
      isGigReport: true,
    });
    // this.setState({reportModal: !this.state.reportModal}) // true/false toggle
  };

  report = () => {
    const link = `gigonomy/gig/${this.state.gig._id}`;
    postReport({
      id: this.state.gig._id,
      type: 'gig',
      link,
      category: this.state.category,
      reason: this.state.reason,
    }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.setState({ reportModal: false, reported: true });
      },
      (error) => {
        alertBox(true, error.data.message);
        this.setState({ reportModal: false });
      }
    );
  };

  unReport = () => {
    const con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id: this.state.gig._id }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          removeReport({ item_id: this.state.gig._id }).then(
            async (resp) => {},
            (error) => {
              alertBox(true, 'Something went wrong!');
            }
          );
          this.setState({ reportModal: false, reported: false });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
  };

  confirm = (on = true) => {
    if (on) {
      this.setState({ modal: !this.state.modal });
    } else {
      this.setState({ moda: false }, this.removePost());
    }
  };

  removePost = () => {
    removeGig({ id: this.state.gig._id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        this.props.parentCallback({ removed: true });
        this.setState({ removed: true });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  componentDidMount() {
    // this.setState({ gig: this.props.post})
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.post !== this.props.post) {
      this.setState({ gig: this.props.post });
    }
    if (previousProps.data !== this.props.data) {
      this.setState({ filter: this.props.data });
    }
  }

  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isGigReport: data.isGigReport,
        reported: true,
      });
    } else {
      this.setState({
        isGigReport: data.isGigReport,
      });
    }
  };

  render() {
    const { gig } = this.state;
    return (
      <React.Fragment key={this.state.gig._id}>
        {this.state.removed ? null : (
          <div className="" key={this.state.gig._id}>
            <Modal displayModal={this.state.modal} closeModal={this.confirm}>
              <i className="fa-solid fa-trash-can" />
              <p className="p-2">Are you sure about deleting this?</p>
              <div>
                <Button
                  variant="secondaryBtn me-2"
                  size="compact"
                  onClick={this.confirm}
                >
                  No
                </Button>
                <Button
                  variant="primaryBtn"
                  size="compact"
                  onClick={() => this.confirm(false)}
                >
                  Yes
                </Button>
              </div>
            </Modal>
            <Modal
              displayModal={this.state.reportModal}
              closeModal={this.reportModal}
            >
              <div>
                <div className="form-group">
                  <select
                    className="form-control"
                    value={this.state.category}
                    onChange={(e) =>
                      this.setState({ category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    <option>Violence</option>
                    <option>Racism / Hatespeech</option>
                    <option>Pornographic</option>
                    <option>Spam</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    type="text"
                    placeholder="Reason"
                    className="form-control"
                    onChange={(e) => this.setState({ reason: e.target.value })}
                    value={this.state.reason}
                  />
                </div>
              </div>
              <div className="">
                <Button
                  variant="primary"
                  size="compact m-2"
                  onClick={() => this.report()}
                >
                  Report
                </Button>
                <Button
                  variant="secondary"
                  size="compact m-2"
                  onClick={this.reportModal}
                >
                  Cancel
                </Button>
              </div>
            </Modal>
            <TopThumbCard
              mine={this.props.mine}
              reported={this.state.reported}
              report={() => this.reportModal()}
              // onClick={(e) => this.handleReport(e, this.state.gig._id)}
              unReport={() => this.unReport()}
              url={`/passionomy/gig/${gig.slug}`}
              currentUser={this.props.currentUser}
              post={gig}
              removePost={this.confirm}
              base="/passionomy/gig/edit/"
              filterdata={this.state.filter}
              filter={this.props.filter}
            />

            {this.state.isGigReport && (
              <GigReportModal
                parentCallback={this.handleCallbackReport}
                isGigReport={this.state.isGigReport}
                gigId={this.state.gig._id}
              />
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Gig;
