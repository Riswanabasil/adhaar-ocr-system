// import  { useState } from "react";
// import UploadCard from "../components/UploadCard";
// import { parseAadhaar } from "../utils/api";
// import ParsedResult from "../components/ParsedResult";

// const Home = () => {
//   const [front, setFront] = useState<File | null>(null);
//   const [back, setBack] = useState<File | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [raw, setRaw] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const handleParse = async () => {
//     if (!front || !back) {
//       alert("Please upload both front and back images.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await parseAadhaar(front, back);
//       setResult(res.data.data);
//       setRaw(res.data.raw);
//     } catch (err) {
//       alert("Error during parsing.");
//     }
//     setLoading(false);
//   };

//   return (

//     <div className="p-6 grid grid-cols-2 gap-6">

//       {/* Left: Upload Section */}
//       <div>
//         <UploadCard label="Aadhaar Front" file={front} setFile={setFront} />
//         <UploadCard label="Aadhaar Back" file={back} setFile={setBack} />

//         <button
//           onClick={handleParse}
//           className="bg-blue-600 text-white mt-4 px-4 py-2 rounded w-full disabled:bg-gray-400"
//           disabled={loading}
//         >
//           {loading ? "Parsing..." : "PARSE AADHAAR"}
//         </button>
//       </div>

//       {/* Right: Result Section */}
//       <div>
//         <ParsedResult data={result} raw={raw} />
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useState } from "react";
import UploadCard from "../components/UploadCard";
import { parseAadhaar } from "../utils/api";
import ParsedResult from "../components/ParsedResult";

const Home = () => {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!front || !back) {
      alert("Please upload both images!");
      return;
    }
    setLoading(true);
    try {
      const res = await parseAadhaar(front, back);
      setResult(res.data.data);
      setRaw(res.data.raw);
    } catch (err) {
      alert("Error during parsing.");
    }
    setLoading(false);
  };

  const canParse = !!front && !!back && !loading;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Aadhaar OCR System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Upload Section */}
        <div className="space-y-4">
          <UploadCard label="Upload Aadhaar Front" file={front} setFile={setFront} />
          <UploadCard label="Upload Aadhaar Back" file={back} setFile={setBack} />


          <button
            onClick={handleParse}
            disabled={!front || !back || loading}
            className={`w-full py-3 font-semibold rounded-lg shadow-md transition
    ${canParse
                ? 'bg-blue-600 hover:bg-blue-700 text-black'
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
              }`}
          >
            {loading ? 'Processing...' : 'Parse Aadhaar'}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 overflow-auto">
          <ParsedResult data={result} raw={raw} />
        </div>
      </div>
    </div>
  );
};

export default Home;

