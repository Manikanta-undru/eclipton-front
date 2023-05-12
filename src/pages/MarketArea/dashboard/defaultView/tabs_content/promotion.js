import moment from 'moment';
import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';

import '../styles.scss';

require('../../../_styles/market-area.scss');
require('../../dashboard.scss');

class PromotionContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promotions: this.props.promotions,
    };
  }

  render() {
    const user = this.props.currentUser;
    const { promotions } = this.props;
    return (
      <table className="table mt-1">
        <thead className="thead-light">
          <tr>
            <th> Image </th>
            <th> Title </th>
            <th> Price </th>
            <th> Status </th>
            <th />
          </tr>
        </thead>
        {promotions !== undefined && promotions.length > 0 ? (
          promotions.map((promotions, i) => (
            <tbody key={i}>
              <tr>
                <td>
                  {promotions.attachment !== undefined &&
                    promotions.attachment !== null &&
                    Object.keys(promotions.attachment).length > 0 && (
                      <img
                        src={
                          promotions.attachment[
                            Object.keys(promotions.attachment)[0]
                          ].src
                        }
                        height="15%"
                        width="15%"
                      />
                    )}
                </td>
                <td>
                  {promotions.title}
                  <p>
                    {' '}
                    {moment(promotions.start_date).format(
                      'MMM DD, YYYY'
                    )} - {moment(promotions.end_date).format('MMM DD, YYYY')} |{' '}
                    {promotions.start_time} - {promotions.end_time}{' '}
                  </p>
                </td>
                <td> ${promotions.amount} </td>
                <td> {promotions.status} </td>
                <td />
              </tr>
            </tbody>
          ))
        ) : (
          <p>No results found!</p>
        )}
      </table>
    );
  }
}
export default PromotionContent;
