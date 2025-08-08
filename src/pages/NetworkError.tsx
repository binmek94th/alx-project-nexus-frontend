
const NetworkErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--error)] p-4">
            <h1 className="text-5xl font-bold mb-4">Network Error</h1>
            <p className="text-lg mb-2">Unable to connect to the server.</p>
            <p className="text-[var(--text-tertiary)] max-w-md text-center">
                Please check your internet connection and try again.
            </p>
        </div>
    );
};

export default NetworkErrorPage;
