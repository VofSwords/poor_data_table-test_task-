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
      this.state = {
        currentPage: window.location.pathname.replace(new RegExp(`${process.env.REACT_APP_TABLE_BASE}\/?`, "i"), "") || 1,
        search: "",
        sort: {
          enabled: false,
          ascending: false,
          field: ""
        },
        fields: props.fields || Object.keys(props.data[0] || {}).reduce((acc, key) => (acc[key] = key, acc), {})
      };
      console.log(this.state.currentPage, process.env.REACT_APP_TABLE_BASE)
    };
    
    createPage(num, data) {
      return (
        <Page
            fields={this.state.fields}
            data={data.slice(num * 50, 50 * (num + 1))}
            sort={(field) => this.handleSort(field)}
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
        const placeHolder1 = <li key={-2}>...</li>;
        const placeHolder2 = <li key={-3}>...</li>;
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
    
    handleSort(field) {
      let {enabled, ascending, field: oldField} = this.state.sort;
      if (field === oldField) {
        if (ascending) {
          ascending = false;
        } else {
          field = "";
          enabled = false;
        };
      } else {
        ascending = true;
        enabled = true;
      };
      
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
          <Router basename={process.env.REACT_APP_TABLE_BASE}>
            <div id="nav">
              <nav>
                <ul>
                  {pageLinks}
                </ul>
              </nav>
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
            </div>
          </Router>
        </div>
      );
      
    };
  };

  export default Table;