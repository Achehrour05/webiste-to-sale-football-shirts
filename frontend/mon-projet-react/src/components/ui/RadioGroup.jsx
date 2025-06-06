import React from "react";
const RadioGroup = ({ label, value, onValueChange, children }) => {
  return (
    <div className="flex flex-col gap-3">
      {label && <label className="font-medium">{label}</label>}
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
};

const Radio = ({ value, checked, onChange, children }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      {children}
    </label>
  );
};

export { RadioGroup, Radio };