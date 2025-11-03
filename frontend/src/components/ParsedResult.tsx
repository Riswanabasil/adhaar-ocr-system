// interface ParsedResultProps {
//   data: any;
//   raw: any;
// }

// const ParsedResult: React.FC<ParsedResultProps> = ({ data, raw }) => {
//   if (!data) return <p>No data yet.</p>;

//   return (
//     <div>
//       <h2 className="font-semibold text-lg mb-2">Parsed Data</h2>
//       <div className="grid grid-cols-2 gap-4 text-sm">
//         <p><strong>Name:</strong> {data.name || "N/A"}</p>
//         <p><strong>Gender:</strong> {data.gender || "N/A"}</p>
//         <p><strong>Aadhaar:</strong> {data.aadhaarNumber || "N/A"}</p>
//         <p><strong>DOB:</strong> {data.dob || "N/A"}</p>
//         <p><strong>Pincode:</strong> {data.pincode || "N/A"}</p>
//         <p className="col-span-2"><strong>Address:</strong> {data.address || "N/A"}</p>
//       </div>

//       <h2 className="font-semibold text-lg mt-4 mb-2">Raw OCR Response</h2>
//       <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
//         {JSON.stringify({ data, raw }, null, 2)}
//       </pre>
//     </div>
//   );
// };

// export default ParsedResult;
interface ParsedResultProps {
  data: any;
  raw: any;
}

const ParsedResult: React.FC<ParsedResultProps> = ({ data, raw }) => {
  if (!data) {
    return <p className="text-gray-500">⚠ Upload and parse to see results</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Extracted Details</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <p><strong>Name:</strong> {data.name || "N/A"}</p>
        <p><strong>Gender:</strong> {data.gender || "N/A"}</p>
        <p><strong>Aadhaar:</strong> {data.aadhaarNumber || "N/A"}</p>
        <p><strong>DOB:</strong> {data.dob || "N/A"}</p>
        <p><strong>Pincode:</strong> {data.pincode || "N/A"}</p>
      </div>

      <p className="mt-3"><strong>Address:</strong> {data.address || "N/A"}</p>

      <h3 className="text-md font-semibold mt-5 mb-2">Raw OCR Output</h3>
      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
        {JSON.stringify(raw, null, 2)}
      </pre>
    </div>
  );
};

export default ParsedResult;
