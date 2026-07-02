function Select({ options = [], value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        rounded-lg
        border
        border-slate-300
        px-4
        py-2
        bg-white
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-200
      "
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
