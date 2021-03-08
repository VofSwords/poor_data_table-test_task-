import React from 'react';
import {
    NavLink,
    Switch,
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import Page from './page';
import Search from "./search";

/*
TO DO:
add search to links
*/

class Table extends React.Component {
    constructor(props) {
      super(props);
      const startPage = window.location.pathname.replace(new RegExp(`${process.env.REACT_APP_TABLE_BASE}/?`, "i"), "");
      this.state = {
        currentPage: (!startPage || isNaN(startPage))  ? 1 : startPage,
        search: "",
        sort: {
          enabled: false,
          ascending: false,
          field: ""
        },
        fields: props.fields || Object.keys(props.data[0] || {}).reduce((acc, key) => (acc[key] = key, acc), {})
      };
    };
    
    createPage(num, data) {
      return (
        <Page
            fields={this.state.fields}
            data={data.slice(num * 50, 50 * (num + 1))}
            sort={(...args) => this.handleSort(...args)}
        />
      )
    };
    
    createLinks(pageCount, currentPage) {
      if (pageCount === 0) return [];
      const forwardPageNum = Math.min((currentPage + 1), pageCount);
      const backwardPageNum = (currentPage - 1) || 1;
      const buttonBackward = this.createLink(backwardPageNum, 0, "<", () => false);
      const buttonForward = this.createLink(forwardPageNum, -1, ">", () => false);
      const firstLink = this.createLink(1, 1, 1, (match, location) => location.pathname === "/" || location.pathname === "/1");
      
      let before = [];
      let after = [];
      let length = pageCount - 1;
      let startIndex = 2;
      
      if (pageCount > 9) {
        const lastLink = this.createLink(pageCount);
        const placeHolder1 = <li key={-2}><span>...</span></li>;
        const placeHolder2 = <li key={-3}><span>...</span></li>;
        if (currentPage < 6) {
          length = 6;
          startIndex = 2;
          after = [
            placeHolder2,
            lastLink
          ];
        } else if (pageCount - currentPage < 5) {
          length = 6;
          startIndex = pageCount - 6;
          before = [placeHolder1];
          after = [lastLink];
        } else {
          length = 5;
          startIndex = currentPage - 2;
          before = [placeHolder1];
          after = [
            placeHolder2,
            lastLink
          ];
        };
      };
      
      return [
        buttonBackward,
        firstLink,
        ...before,
        ...Array.from({
          length
        }, (_, i) => this.createLink(startIndex + i)),
        ...after,
        buttonForward
      ];
    };
    
    createLink(num, key = num, name = num, isActive) {
      return (
        <li key={key}>
          <NavLink
            to={`/${num}`}
            isActive={isActive}
            onClick={() => this.setState({
            currentPage: num
          })}
            activeClassName="current"
          >
            {name}
          </NavLink>
        </li>
      );
    };

    filterSearch(element) {
        const search = this.state.search;
        return Object.keys(this.state.fields)
            .some(field => RegExp(search, "i").test(element[field]))
    };

    sortData(elem1, elem2) {
        const {enabled, ascending, field} = this.state.sort;
        if (enabled) {
            return ascending ? elem1[field] > elem2[field] : elem1[field] < elem2[field];
        } else return -1;
    }
    
    handleSearch(search) {
      this.setState({
        search,
        currentPage: 1
      });
    };
    
    handleSort(field, event) {
      let {enabled, ascending, field: oldField} = this.state.sort;
      let className;
      if (field === oldField) {
        if (ascending) {
          className = "sort-descending";
          ascending = false;
        } else {
          field = "";
          enabled = false;
          className = "";
        };
      } else {
        ascending = true;
        enabled = true;
        className = "sort-ascending";
      };

      Array.from(document.querySelectorAll("#table tr span")).forEach(element => element.classList.remove("sort-ascending", "sort-descending"));
      event.target.className = className;
      
      this.setState({
        sort: {
            enabled,
            ascending,
            field
        }
      });
    };
    
    render() {
      if (this.props.data.length === 0)
        return "Nothing to display";
        const data = this.props.data.slice()
            .filter(elem => this.filterSearch(elem))
            .sort((elem1, elem2) => this.sortData(elem1, elem2));
      const pageCount = Math.ceil(data.length/50)
      const pageLinks = this.createLinks(pageCount, this.state.currentPage);
      const pages = pageCount > 0 ? Array.from({
        length: pageCount
      }, (_, i) => (
        <Route path={`/${i + 1}`} key={i + 1}>
          {this.createPage(i, data)}
        </Route>
      )) : <Route path="*"> No matches for {this.state.search} </Route>;
      return (
        <div id="table">
        <div>
          <Router basename={process.env.REACT_APP_TABLE_BASE}>
            <div id="nav">
              <nav>
                <ul>
                  {pageLinks}
                </ul>
              </nav>
            </div>
            <Search handleSearch={(search) => this.handleSearch(search)} />
            <Switch>
              {pages}
              <Route exact path="/">
                {this.createPage(0, data)}
              </Route>
              <Route>
                Nothing to display
              </Route>
            </Switch>
          </Router>
        </div>
        </div>
      );
      
    };
  };

  export default Table;