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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Aadhaar OCR System
          </h1>
          <p className="text-gray-600 text-lg">
            Upload both sides of your Aadhaar card to extract information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Upload Section */}
        <div className="space-y-6">
          <UploadCard label="Upload Aadhaar Front" file={front} setFile={setFront} />
          <UploadCard label="Upload Aadhaar Back" file={back} setFile={setBack} />

          <button
            onClick={handleParse}
            disabled={!canParse}
            className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform
              ${canParse
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Parse Aadhaar
              </span>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 overflow-auto border border-gray-200">
          <ParsedResult data={result} raw={raw} />
        </div>
      </div>
    </div>
  );
};

export default Home;