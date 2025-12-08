export function Button({ children, onClick, type = "button", variant = "primary" }) {
    const base = "px-4 py-2 rounded font-medium transition active:scale-95";
    const styles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };


    return (
        <button type={type} onClick={onClick} className={`${base} ${styles[variant]}`}>
            {children}
        </button>
    );
}