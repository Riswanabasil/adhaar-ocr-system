
import type { ParsedResultProps } from "../types/Aadhaar.types";

const ParsedResult: React.FC<ParsedResultProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400 flex items-center gap-2">
          <span className="text-2xl">⚠</span>
          <span>Upload and parse to see results</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-3">
        Extracted Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 font-semibold mb-1">NAME</p>
          <p className="text-gray-800 font-medium">{data.name || "N/A"}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-600 font-semibold mb-1">GENDER</p>
          <p className="text-gray-800 font-medium">{data.gender || "N/A"}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-600 font-semibold mb-1">AADHAAR</p>
          <p className="text-gray-800 font-medium tracking-wide">{data.aadhaarNumber || "N/A"}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-xs text-orange-600 font-semibold mb-1">DATE OF BIRTH</p>
          <p className="text-gray-800 font-medium">{data.dob || "N/A"}</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
          <p className="text-xs text-pink-600 font-semibold mb-1">PINCODE</p>
          <p className="text-gray-800 font-medium">{data.pincode || "N/A"}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
        <p className="text-xs text-indigo-600 font-semibold mb-2">ADDRESS</p>
        <p className="text-gray-800 leading-relaxed">{data.address || "N/A"}</p>
      </div>

      {/* <h3 className="text-md font-semibold mt-5 mb-2">Raw OCR Output</h3>
      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
        {JSON.stringify(raw, null, 2)}
      </pre> */}
    </div>
  );
};

export default ParsedResult;