import React from 'react';
import DebouncedInput from '../../components/DebouncedInput/DebouncedInput';
import SearchMenu from '../../components/Menu/SearchMenu';
import BlogPosts from '../../components/Post/BlogPosts';
import GlobalGigs from '../../components/Post/Gigs';
import GlobalPosts from '../../components/Post/GlobalPosts';
// import SearchPosts from '../../components/Search/Posts';
import SearchUsers from '../../components/User/Users';
import { queryParse } from '../../hooks/querystring';
import { history } from '../../store';

import Loading from '../../components/Loading/Loading';

import { alertBox } from '../../commonRedux';

require('./styles.scss');

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latestpost: {},
      latestpost2: {},
      isLoading: false,
      page: 1,
      count: 20,
      filter: 'all',
      result: [],
      searchQuery: '',
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    const query = queryParse(this.props.location.search);

    const decodedString = decodeURIComponent(query.q.replace(/\+/g, ' '));

    if (query.q) {
      this.setState({
        searchQuery: query.q,
        filter: query.filter ? query.filter : 'all',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search != prevProps.location.search) {
      const query = queryParse(this.props.location.search);

      const decodedString = decodeURIComponent(query.q.replace(/\+/g, ' '));

      this.setState({
        searchQuery: query.q,
        filter: query.filter ? query.filter : 'all',
      });
    }
    if (this.props.location.pathname != '/search') {
      this.setState({
        searchQuery: '',
        filter: 'all',
      });
    }
  }

  handleInput = (val) => {
    this.setState({ searchQuery: val });
    if (val.length > 30 || val.length < 4) {
      alertBox(true, 'Search is required with in 4 to 30 charecters mnmnmn');
    }
  };

  redirecthome = () => {
    this.setState({
      searchQuery: '',
      filter: 'all',
    });
    window.location.href = '/home';
  };

  setFilter = (value) => {
    localStorage.setItem('filter', value);
    this.props.history.push(
      `/search?q=${this.state.searchQuery}&filter=${value}`
    );
  };

  handleSearch = (e) => {
    e.preventDefault();
    const query = queryParse(this.props.location.search);
    history.push(
      `/search?q=${this.state.searchQuery}${
        query.filter != null &&
        typeof query.filter !== 'undefined' &&
        query.filter != ''
          ? `&filter=${query.filter}`
          : ''
      }`
    );
    if (
      this.state.searchQuery.length > 30 ||
      this.state.searchQuery.length < 4
    ) {
      alertBox(true, 'Search is required with in 4 to 30 charecters ');
    }
  };

  render() {
    const { result } = this.state;
    return (
      // <!-- Wall container -->
      <div className="container my-wall-container">
        <div className="row mt-2">
          <div className="col-sm col-md-4 empty-container-with-out-border left-column">
            <div className="col-sm empty-container-with-out-border left-column">
              {/* <BlogFilter /> */}
            </div>
          </div>
          <div className="col-sm empty-container-with-out-border center-column">
            <form
              className="form-inline my-2 my-lg-0 searchBox sm-show mb-4 "
              onSubmit={this.handleSearch}
            >
              <div className="input-group m-0">
                <DebouncedInput
                  type="text"
                  className="form-control border-l-1"
                  placeholder="Search"
                  value={this.state.searchQuery}
                  onChange={this.handleInput}
                />
              </div>
            </form>
            {/* <div className="searchFilters">
                <a className={this.state.filter == "all" ? "active" : ""} onClick={(e) => this.setFilter("all")}>All</a>
                <a className={this.state.filter == "users" ? "active" : ""} onClick={(e) => this.setFilter("users")}>People</a>
                <a className={this.state.filter == "posts" ? "active" : ""} onClick={(e) => this.setFilter("posts")}>Posts</a> 
              </div> */}
            {this.state.searchQuery == '' ? (
              <p>Type something to search</p>
            ) : this.state.isLoading ? (
              <Loading />
            ) : (
              <div>
                {this.state.filter == 'all' || this.state.filter == 'users' ? (
                  <div className="col empty-container-with-out-border p-0 center-column-full m-0 SearchWindowWidth searchResult">
                    <h3 className="subtitle">Users</h3>
                    {/* {
                      (this.state.filter != 'users') ? 
                      <SearchUsers {...this.props} query={this.state.searchQuery} search={true} loadMore={false} />
                      : */}
                    <SearchUsers
                      setState={this.setStateFunc}
                      latestpost={this.state.latestpost2}
                      {...this.props}
                      query={this.state.searchQuery}
                      search
                      limit={5}
                      loadMore={this.state.filter == 'users'}
                    />
                    {/* } */}
                  </div>
                ) : null}

                {this.state.filter == 'all' || this.state.filter == 'gigs' ? (
                  <div className="col empty-container-with-out-border p-0 center-column-full m-0 mt-3 SearchWindowWidth searchResult">
                    <h3 className="subtitle">Gigs</h3>
                    <GlobalGigs
                      {...this.props}
                      query={this.state.searchQuery}
                      search
                      limit={3}
                      loadMore={this.state.filter == 'posts'}
                    />
                  </div>
                ) : null}
                {this.state.filter == 'all' || this.state.filter == 'blogs' ? (
                  <div className="col empty-container-with-out-border p-0 center-column-full m-0 mt-3 SearchWindowWidth searchResult">
                    <h3 className="subtitle">Blogs</h3>
                    <BlogPosts
                      setState={this.setStateFunc}
                      latestpost={this.state.latestpost}
                      {...this.props}
                      query={this.state.searchQuery}
                      search
                      limit={3}
                      loadMore={this.state.filter == 'blogs'}
                    />
                  </div>
                ) : null}

                {this.state.filter == 'all' || this.state.filter == 'posts' ? (
                  <div className="col empty-container-with-out-border p-0 center-column-full m-0 mt-3 SearchWindowWidth searchResult">
                    <h3 className="subtitle">Posts</h3>
                    <GlobalPosts
                      setState={this.setStateFunc}
                      latestpost={this.state.latestpost}
                      {...this.props}
                      query={this.state.searchQuery}
                      search
                      limit={3}
                      loadMore={this.state.filter == 'posts'}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="col-sm empty-container-with-out-border right-column">
            <SearchMenu
              onClick={this.setFilter}
              current={this.state.filter}
              homeRedirect={this.redirecthome}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResult;
