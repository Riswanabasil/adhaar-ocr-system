

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

// import React, { useId } from "react";

// interface UploadCardProps {
//   label: string;
//   file: File | null;
//   setFile: (file: File | null) => void;
// }

// const UploadCard: React.FC<UploadCardProps> = ({ label, file, setFile }) => {
//   // unique id to link <label> and <input>
//   const inputId = useId();

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f) setFile(f);
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-xl border p-4">
//       <p className="font-semibold text-gray-700 mb-3">{label}</p>

//       {/* The whole card below is clickable because it's a <label> for the hidden input */}
//       <label
//         htmlFor={inputId}
//         className="block cursor-pointer border-2 border-dashed rounded-lg h-40
//                    flex items-center justify-center text-gray-400 hover:border-blue-500
//                    transition"
//       >
//         {file ? (
//           <img
//             src={URL.createObjectURL(file)}
//             alt="preview"
//             className="w-full h-40 object-cover rounded-lg"
//           />
//         ) : (
//           <span>Click to upload image</span>
//         )}
//       </label>

//       {/* Hidden file input that the label triggers */}
//       <input
//         id={inputId}
//         type="file"
//         accept="image/*"
//         onChange={onChange}
//         className="sr-only"
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
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <p className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        {label}
      </p>

      {/* The whole card below is clickable because it's a <label> for the hidden input */}
      <label
        htmlFor={inputId}
        className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl h-48
                   flex items-center justify-center text-gray-400 hover:border-blue-500
                   hover:bg-blue-50 transition-all duration-300 relative overflow-hidden
                   group"
      >
        {file ? (
          <div className="relative w-full h-full">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click to change
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300 group-hover:text-blue-500 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
              Click to upload image
            </span>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG</p>
          </div>
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
