import React from 'react';
import AddGigTab from './add';

require('./styles.scss');
const coins = require('./coins.json');

class AddGig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      currentTab: 0,
    };
  }

  componentDidMount() {
    try {
      this.setState({ id: this.props.match.params.id });
    } catch (error) {
      /* empty */
    }
  }

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  render() {
    return (
      <div className="AddGigPage">
        <div className="container">
          <div className="row mt-2">
            {/* <!-- left column --> */}

            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            {/* <TabsUI tabs={['Create Gig', 'Create Gig Request']} type="transactions" className="noBorder" currentTab={this.state.currentTab} changeTab={this.changeTab} />
                {this.state.currentTab == 0 && <div className={"tab mt-2"}> */}
            <div className="tab mt-2">
              <AddGigTab {...this.props} id={this.props.match.params.id} />{' '}
            </div>
            {/* </div>}
                {this.state.currentTab == 1 && <div className={"tab mt-2"}>
                  <GigRequestTab {...this.props} id={this.props.match.params.id}  />  
                  </div>} */}
          </div>
        </div>
      </div>
    );
  }
}

export default AddGig;
