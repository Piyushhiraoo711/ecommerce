import React from "react";

const CustomSelect = ({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  className = "",
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>

      <div className="mt-2">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full rounded-md px-3 py-1.5 text-base bg-black text-white outline outline-1 outline-gray-300 placeholder:text-gray-400 
            focus:outline-2 focus:outline-indigo-600 sm:text-sm 
             dark:focus:outline-indigo-500${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomSelect;
