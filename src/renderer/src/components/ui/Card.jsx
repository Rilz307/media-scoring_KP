function Card({ children, className = '' }) {
  return (
    <div
      className={`
        rounded-xl
        bg-white
        shadow
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card