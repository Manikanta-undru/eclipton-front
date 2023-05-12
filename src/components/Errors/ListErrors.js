import React from 'react';

class ListErrors extends React.Component {
  render() {
    const { errors } = this.props;
    if (errors) {
      return (
        <ul className="error-messages">
          {Object.keys(errors).map((key, i) => (
            <li key={i}>
              {key} {errors[key]}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }
}

export default ListErrors;
