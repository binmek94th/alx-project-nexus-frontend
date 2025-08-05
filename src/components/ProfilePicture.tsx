interface ProfilePictureProps {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
}

const ProfilePicture = ({
                            src,
                            alt = "Profile picture",
                            size = 48,
                            className = "",
                        }: ProfilePictureProps) => {
    return (
        <div
            className={`relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
            style={{ width: size, height: size }}
        >
            {src ? (
                <img
                    src={`${import.meta.env.VITE_API_URL}/image/${src}`}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <span className="select-none text-lg font-semibold">
                    ?
        </span>
            )}
        </div>
    );
};

export default ProfilePicture;
