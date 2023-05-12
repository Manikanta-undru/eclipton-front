import React from 'react';
import Collapsible from 'react-collapsible';
import './styles.scss';

export function AccordionOne(props) {
  function AccordionTrigger(props) {
    return (
      <div className="trigger">
        <p>
          Transferred from <span>{props.from}</span> to <span>{props.to}</span>
        </p>
        <div className="extra">
          <span>Amount</span>
          <p>
            {props.amount} {props.currency}
          </p>
        </div>
      </div>
    );
  }
  return (
    <Collapsible
      trigger={
        <AccordionTrigger
          from={props.from}
          to={props.to}
          amount={props.amount}
          currency={props.currency}
        />
      }
    >
      <div className="transDetails">
        <div>
          {/* <span>Note</span>
          <p>{props.note}</p> */}
        </div>
        <div>
          <span>Transferred at</span>
          <p>
            <small>{props.at}</small>
          </p>
        </div>
      </div>
    </Collapsible>
  );
}

export function AccordionTwo(props) {
  function AccordionTrigger(props) {
    return (
      <div className="trigger">
        <div className="details">
          <span>{props.type}</span>
          <p>{props.email}</p>
        </div>
        <div className="extra">
          <span>Amount</span>
          <p>
            {props.currency} {props.amount}
          </p>
        </div>
      </div>
    );
  }
  return (
    <Collapsible
      trigger={
        <AccordionTrigger
          type={props.type}
          amount={props.amount}
          email={props.email}
          currency={props.currency}
        />
      }
    >
      <div className="transDetails">
        <div>
          <span>Note</span>
          <p>{props.note}</p>
        </div>
        <div>
          <span>Transferred at</span>
          <p>
            <small>{props.at}</small>
          </p>
        </div>
      </div>
    </Collapsible>
  );
}
export function AccordionThree(props) {
  function AccordionTrigger(props) {
    return (
      <div className="trigger">
        <div className="details">
          <span>{props.type}</span>
          <p>{props.email}</p>
        </div>
        <div className="extra">
          <span>Amount</span>
          <p>
            {props.currency} {props.amount}
          </p>
        </div>
      </div>
    );
  }
  return (
    <Collapsible
      trigger={
        <AccordionTrigger
          type={props.type}
          amount={props.amount}
          email={props.email}
          currency={props.currency}
        />
      }
    >
      <div className="transDetails">
        <div>
          <span>Type</span>
          <p>{props.transType}</p>
        </div>
        <div>
          <span>Transferred at</span>
          <p>
            <small>{props.at}</small>
          </p>
        </div>
      </div>
      <div className="transDetails">
        <div>
          <span>Tx hash</span>
          <p>{props.hash}</p>
        </div>
      </div>
    </Collapsible>
  );
}
