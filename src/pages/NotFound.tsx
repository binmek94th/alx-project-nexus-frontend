const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--primary-text)] p-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-2">Page Not Found</p>
            <p className="text-[var(--text-secondary)] max-w-md text-center">
                Sorry, the page you are looking for does not exist.
            </p>
        </div>
    );
};

export default NotFoundPage;
