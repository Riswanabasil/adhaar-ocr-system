

// import React from "react";

// interface UploadCardProps {
//   label: string;
//   file: File | null;
//   setFile: (file: File | null) => void;
// }

// const UploadCard: React.FC<UploadCardProps> = ({ label, file, setFile }) => {
//   return (
//     <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all p-4 rounded-lg bg-white shadow-sm">
//       <p className="font-medium text-gray-600 mb-2">{label}</p>

//       {file ? (
//         <img
//           src={URL.createObjectURL(file)}
//           alt="preview"
//           className="w-full h-40 object-cover rounded-lg shadow-sm"
//         />
//       ) : (
//         <div className="h-40 flex items-center justify-center text-gray-400">
//           <span>Click to upload image</span>
//         </div>
//       )}

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         className="mt-3 w-full text-sm"
//       />
//     </div>
//   );
// };

// export default UploadCard;

import React, { useId } from "react";

interface UploadCardProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ label, file, setFile }) => {
  // unique id to link <label> and <input>
  const inputId = useId();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border p-4">
      <p className="font-semibold text-gray-700 mb-3">{label}</p>

      {/* The whole card below is clickable because it's a <label> for the hidden input */}
      <label
        htmlFor={inputId}
        className="block cursor-pointer border-2 border-dashed rounded-lg h-40
                   flex items-center justify-center text-gray-400 hover:border-blue-500
                   transition"
      >
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        ) : (
          <span>Click to upload image</span>
        )}
      </label>

      {/* Hidden file input that the label triggers */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="sr-only"
      />
    </div>
  );
};

export default UploadCard;
