import React, { Component } from 'react';
import Reviews from '../reviews';
import Faq from '../faq';

class Tab1 extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
      description: this.props.description,
      publish: this.props.publish,
      product_size: [],
    };
    this.state = { ...initialState };
    this.button = React.createRef();
  }

  componentDidMount() {
    this.button.current.click();
  }

  handleClick = (event) => {
    const { value } = event.target;
    const temp = this.state.product_size;
    temp.push(value);
    this.props.dataChange({
      product_size: temp,
    });
    this.setState({
      product_size: temp,
    });
  };

  render() {
    return (
      <div className="tabs-holder effect-1">
        <input
          className="input-link"
          type="radio"
          id="tab-1"
          name="tab-effect-1"
        />
        <label ref={this.button} className="link-btn" htmlFor="tab-1">
          {' '}
          Description{' '}
        </label>
        {!this.state.publish && (
          <input
            className="input-link"
            type="radio"
            id="tab-2"
            name="tab-effect-1"
          />
        )}
        {!this.state.publish && (
          <label className="link-btn" htmlFor="tab-2">
            {' '}
            Reviews{' '}
          </label>
        )}
        {this.state.products.faqs !== undefined &&
          this.state.products.faqs.length > 0 &&
          this.state.products.faqs[0].question !== '' && (
            <input
              className="input-link"
              type="radio"
              id="tab-3"
              name="tab-effect-1"
            />
          )}
        {this.state.products.faqs !== undefined &&
          this.state.products.faqs.length > 0 &&
          this.state.products.faqs[0].question !== '' && (
            <label className="link-btn" htmlFor="tab-3">
              {`FAQ's`}
            </label>
          )}
        <div className="tab-content">
          <section id="tab-item-1">
            <div dangerouslySetInnerHTML={{ __html: this.state.description }} />
            <h5 className="title-2"> Product Condition </h5>
            <p> {this.state.products.condition} </p>
            <h5 className="title-2"> Size </h5>
            <ul className="style-1">
              {this.state.products.size.map((data, key) => (
                <li onChange={this.handleClick} key={key}>
                  {/* <input required type="checkbox" value={data} name="product_size" /> */}
                  <spam>{data} </spam>
                </li>
              ))}
            </ul>

            <h5 className="title-2"> Stock </h5>
            <p> {this.state.products.stock} </p>
          </section>
          {!this.state.publish && (
            <section id="tab-item-2">
              <Reviews products={this.state.products} />
            </section>
          )}
          {this.state.products.faqs !== undefined &&
            this.state.products.faqs.length > 0 &&
            this.state.products.faqs[0].question !== '' && (
              <section id="tab-item-3">
                <Faq products={this.state.products} />
              </section>
            )}
        </div>
      </div>
    );
  }
}

export default Tab1;
