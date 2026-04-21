"use client";

export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
         px-4 py-3 rounded-lg
        font-medium
        transition-all duration-200

        ${
          disabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : `
              bg-orange-500 text-white
              hover:bg-orange-600
              hover:shadow-[0_0_15px_rgba(255,106,0,0.4)]
              active:scale-[0.97]
            `
        }
        ${variant === "outline" ? "bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}