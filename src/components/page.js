import React from 'react';

class Page extends React.Component {
    render() {
      const fields = Object.keys(this.props.fields);
      const headers = fields.map((key, i) => (
        <th key={i}>
          <span onClick={() => this.props.sort(key)}>
            {this.props.fields[key]}
          </span>
        </th>
      ));
      const rows = this.props.data.map((row, i) => (
        <tr key={i}>
      {fields.map((field, j) => (
        <td key={j}>
          {row[field]}
        </td>
      ))}
          </tr>
      ))
      return (
        <table>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    };
  };

  export default Page;