import React from 'react';
import {useHistory} from 'react-router-dom';

function Search (props) {
const hist = useHistory();
  return (
    <input
      type="search"
      placeholder="Search"
      onChange={e => {
        hist.push("/");
        props.handleSearch(e.target.value);
      }}
      className="nav-search-inline"
    />
  );
};

export default Search;