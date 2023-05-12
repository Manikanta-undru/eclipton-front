import React, { useState } from 'react';
import A from '../A';
import Button from '../Button';
import './style.scss';
import Spinner from '../Spinner';
import { GetAssetImage } from '../../globalFunctions';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import { connect } from 'react-redux';

function RewardsWidget(props) {
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={`cardBody widget rewardsWidget ${
        props.variant != null && ` ${props.variant}`
      }`}
    >
      <div className="col">
        <ul className="list-group w-100">
          <li className="widgetTitle">
            <img src={GetAssetImage('icon-material-royalty.svg')} />{' '}
            <span>Rewards</span>
          </li>
        </ul>
        <div className="widgetBody">
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex-row">
              <img
                src={GetAssetImage('icon-material-stars.svg')}
                className="icon-star"
              />

              {props.samsubStatus === 'Accept' ? (
                <div>
                  <p>
                    Congrats! You have earned <strong>400 Points</strong> on
                    your KYC.
                  </p>
                  <p>
                    Refer your friend and earn <strong>500 Points</strong>.
                  </p>
                  <A href="/wallet/verification">
                    <Button variant="secondaryBtn" size="big">
                      Earn Points
                    </Button>
                  </A>
                </div>
              ) : (
                <div>
                  <p>
                    Congrats! You have earned <strong>100 Points</strong> on
                    your Registration.
                  </p>
                  <p>
                    Complete your KYC and earn <strong>400 Points</strong>.
                  </p>
                  <A href="/wallet/verification">
                    <Button variant="secondaryBtn" size="big">
                      Earn Points
                    </Button>
                  </A>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default connect(mapCommonStateToProps)(RewardsWidget);
