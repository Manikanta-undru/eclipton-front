import React, { Component } from 'react';
import TopThumbCard from '../../components/Cards/TopThumbCard';
import { getGigs } from '../../http/gig-calls';
import { history } from '../../store';

class ProductDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 20,
      page: 1,
      gigs: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.cid != prevProps.cid) {
      this.getData();
    }
  }

  getData = () => {
    getGigs({
      page: this.state.page,
      limit: this.state.limit,
      category: this.props.cid,
    }).then(
      (resp) => {
        this.setState({
          gigs: resp.post,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  productDetailsHandler = (id) => {
    history.push(`/passionomy/gig/${id}`);
  };

  render() {
    return (
      <div className="row-1">
        {this.state.gigs.length == 0 ? (
          <p className="no-found">No Gigs Found</p>
        ) : (
          this.state.gigs.map((gig, i) => (
            <TopThumbCard
              report={this.reportModal}
              unReport={() => this.unReport(gig)}
              url={`/passionomy/gig/${gig.slug}`}
              currentUser={this.props.currentUser}
              post={gig}
              removePost={this.removePost}
              base="/passionomy/gig/edit/"
              key={i}
            />
          ))
        )}
      </div>
    );
  }
}

export default ProductDetailsCard;
