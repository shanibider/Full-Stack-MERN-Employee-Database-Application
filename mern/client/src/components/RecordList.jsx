// Responsible for displaying a table of employee records fetched from an API.
// Each record can be edited or deleted using corresponding buttons.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import process from 'process'; // Import the 'process' object from the 'process' module

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';


// 'Record' is a functional component inside 'RecordList.jsx' 
// Represents a *row* in the records table, displayed in the RecordList component.
// It receives a single record as a prop and displays its details (name, position, level).
// It also provides edit and delete functionality for each record.
const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

// Prop Validation - using PropTypes.shape to specify that the record prop should be an object with specific properties. 
Record.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};






export default function RecordList() {
  // records is initialized using the useState hook as an empty array.
  const [records, setRecords] = useState([]);



  //useEffect Hook
  // Fetches the list of employee records from the API when the component mounts or when records.length changes.
  // Fetching Records: Makes a GET request to fetch all employee records.
  // Error Handling: Logs an error message if the fetch request fails.
  // Updating State: Sets the fetched records to the records state variable.
  useEffect(() => {

    async function getRecords() {
      const response = await fetch(`${API_URL}/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }      
      const records = await response.json();
      setRecords(records);
    }

    getRecords();

    return;
  }, [records.length]);




  // deleteRecord Function
  // Deletes a record from the database and updates the state to remove the deleted record.
  // API Request: Makes a DELETE request to delete the record with the specified id.
  // Updating State: Filters out the deleted record from the records array.
  async function deleteRecord(id) {
    await fetch(`${API_URL}/record/${id}`, {
      method: "DELETE",
    });
    // Create a new array of records that does not include the deleted record.
    // (if id from records don't matches the id to be deleted, keep it in the array, else remove it)
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }



  // Maps through the records array and renders a Record component for each record.
  // Passes the record data and deleteRecord function as props to each Record component.
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }




  // Table Rendering
  // Renders the base table to display the list of employee records.
  // Table Header: Displays column headers for "Name", "Position", "Level", and "Action".
  // Table Body: Calls recordList() to render the rows for each employee record using the Record component.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
