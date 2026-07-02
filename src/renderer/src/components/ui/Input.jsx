function Input({ type = 'text', placeholder = '', value, onChange, className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full
        rounded-lg
        border
        border-slate-300
        px-4
        py-2
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-200
        ${className}
      `}
    />
  )
}

export default Input
