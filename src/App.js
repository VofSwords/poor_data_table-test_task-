import logo from './logo.svg';
import './App.css';
import DATA from "./utils/data.json";
import Table from "./components/table";

function App() {
  return (
    <Table data={DATA} fields={undefined} />
    /*
    The "fields" property determines the fields that will be displayed from the data array.
    "fields" is an object whose field names are the names of the objects' fields inside the "data" array, and their values are displayed names of the fields of aka column headers
    */
  );
}

export default App;
