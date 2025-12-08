export function Input({ label, type = "text", value, onChange, placeholder }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}