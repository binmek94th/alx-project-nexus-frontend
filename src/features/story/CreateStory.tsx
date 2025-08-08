import React, { useState, type ChangeEvent, type FormEvent } from "react";
import TextField from "../../components/TextField.tsx";

interface Props {
    onSubmit: (data: { image: File; caption: string }) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const StoryUpload: React.FC<Props> = ({ onSubmit, onCancel, isLoading }) => {
    const [caption, setCaption] = useState("");
    const [captionError, setCaptionError] = useState<string | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!caption) {
            setCaptionError("Please enter a caption");
            return
        }
        if (!imageFile) {
            alert("Please select an image");
            return;
        }
        onSubmit({ image: imageFile, caption });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4 bg-[var(--paper-custom)] rounded-md w-full max-w-md text-[var(--primary-text)]"
        >
            <label
                htmlFor="image-upload"
                className="relative cursor-pointer border-2 border-dashed border-[var(--primary)] rounded-md h-48 flex items-center justify-center bg-[var(--background)] hover:bg-[var(--paper-custom)] transition-colors duration-200"
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-md"
                    />
                ) : (
                    <div className="flex flex-col items-center text-[var(--primary-text)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 mb-2 text-[var(--primary)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4m0 0l-4 4m4-4v12"
                            />
                        </svg>
                        <span>Click or drag image here to upload</span>
                    </div>
                )}
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    disabled={isLoading}
                />
            </label>

            <TextField
                value={caption}
                handleChange={(value: string) => setCaption(value)}
                placeholder="Write a caption..."
                className="p-2 rounded text-[var(--primary-text)] resize-none"
                error={captionError}
            />

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-semibold"
                    disabled={isLoading}
                >
                    {isLoading ? "Uploading..." : "Upload Story"}
                </button>
            </div>
        </form>
    );
};

export default StoryUpload;
