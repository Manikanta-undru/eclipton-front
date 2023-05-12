import React from 'react';

class SearchPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.data,
    };
  }

  render() {
    const { posts } = this.state;

    return <div />;
  }
}

export default SearchPosts;
