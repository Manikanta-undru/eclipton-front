import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { getUser } from '../../../../http/product-calls';

require('./faq.scss');

class Faq extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
    };
    this.state = {
      userinfo: {},
      ...initialState,
    };
  }

  componentDidMount() {
    getUser({ userid: this.state.products.userid }).then(
      async (resp) => {
        this.setState({
          userinfo: resp,
        });
      },
      (error) => {}
    );
  }

  render() {
    return (
      <div className="faq-holder">
        <div className="faq-top">
          <h2 className="title">
            {' '}
            {`FAQ's `}({this.state.products.faqs.length}){' '}
          </h2>
          {/* <p className="login-or-register">
                            <Link to="/"> Login </Link>
                            Or
                            <Link to="/"> Register </Link> to ask questions
                        </p>
                        <p> Other questions answered by Sony Electronics (32) </p> */}
        </div>
        <div className="faq-box">
          <ul className="faq">
            {/* BEGIN :: FAQ LIST */}
            {this.state.products.faqs.map((data, key) => (
              <li key={key}>
                {data.question}
                <span className="by-posted-on">
                  {' '}
                  {this.state.userinfo.name}. -{' '}
                  <TimeAgo date={this.state.products.createdAt} />{' '}
                </span>
                <li>
                  {data.answer}
                  <span className="by-posted-on">
                    {' '}
                    {this.state.userinfo.name}. -{' '}
                    <TimeAgo date={this.state.products.createdAt} />{' '}
                  </span>
                </li>
              </li>
            ))}
            {/* END :: FAQ LIST */}
          </ul>
        </div>
        {/* <div className="load-more">
                        <Link to="/" class="button primary-outline big undefined"> Load more </Link>
                    </div> */}
      </div>
    );
  }
}

export default Faq;
