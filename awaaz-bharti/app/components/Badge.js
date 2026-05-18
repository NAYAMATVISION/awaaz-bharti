const badgeStyles = {
  breaking: "bg-red-700 text-white",
  live: "bg-red-600 text-white animate-pulse",
  politics: "bg-indigo-50 text-indigo-800",
  business: "bg-green-50 text-green-800",
  tech: "bg-blue-50 text-blue-800",
  sports: "bg-orange-50 text-orange-800",
  entertainment: "bg-pink-50 text-pink-800",
  health: "bg-teal-50 text-teal-800",
};

export default function Badge({ label, type = "breaking" }) {
  return (
    <span
      className={`inline-block text-[9px] font-bold px-2.5 py-[3px] rounded uppercase tracking-wide ${badgeStyles[type] || badgeStyles.breaking}`}
    >
      {type === "live" && "● "}
      {label}
    </span>
  );
}
