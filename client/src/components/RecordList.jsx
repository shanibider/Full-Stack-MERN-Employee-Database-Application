// Frontend makes API requests to the endpoints defined in backend (e.g., fetch('/record')).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import process from 'process';

// Displaying a table of employee records fetched from an API.
// Each record can be edited/deleted.

const API_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5050';

// Record component receives a single record as a prop and displays its details (name, position, level).
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


// Prop types for the Record component.
Record.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};


// Functional component - displays a list of employee records fetched from an API.
export default function RecordList() {
  const [records, setRecords] = useState([]); // State variable (array) to store records

  // useEffect hook to fetch records from the API.
  // Every time the records array changes, the effect is triggered.
  useEffect(() => {
    async function getRecords() {
      try {
        // Fetch records from the server
        const response = await fetch(`${API_URL}/record/`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        // Parse the JSON response
        const records = await response.json();
        setRecords(records); // Update the records state

        console.log("Fetched records:", records); // Log the fetched records
      } catch (error) {console.error("Failed to fetch records:", error);}
    }
    getRecords(); // Call the async function
  }, [records.length]);



  // Function to delete a record by id.
  async function deleteRecord(id) {
    try {
      // Send a DELETE request to the server
      await fetch(`${API_URL}/record/${id}`, {
        method: "DELETE",
      });
      // Filter out the deleted record from the records array
      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords); // Update the records state
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  }



  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
           
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"> {/* table row */}
                
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">  {/* table head */}
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
             {/* Map over records array and render 'Record' component, with
             record, deleteRecord, and key prop. */}
              {records.map((record) => (
                <Record
                  record={record}
                  deleteRecord={deleteRecord}
                  key={record._id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
