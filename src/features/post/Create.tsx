import  { useState, type ChangeEvent, type FormEvent } from "react";
import TextField from "../../components/TextField.tsx";
import {useCreatePostMutation} from "./api.ts";
import {toast} from "sonner";


const PostUpload = () => {
    const [caption, setCaption] = useState("");
    const [ createPost ] = useCreatePostMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [captionError, setCaptionError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        if (!caption) {
            setCaptionError("Please enter a caption");
            return
        }
        if (!imageFile) {
            alert("Please select an image");
            return;
        }
        const result = await createPost({ image: imageFile, caption });
        if ('error' in result) {
            if ('error' in result) {
                const err = result.error;
                if (err && 'data' in err && typeof err.data === 'object')
                    toast.error("Upload failed: " + (err.data as any)[0]);
                else toast.error("Upload failed: Unknown error");
            }
        }
        else {
            setImageFile(null);
            setCaption("")
            setCaptionError(undefined)
            toast.success("Post created successfully.");
        }
        setIsLoading(false);
    };

    return (
        <div className={'min-w-[70vw] ml-15'}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col min-w-[70vw] gap-4 p-4 bg-[var(--paper-custom)] rounded-md w-full max-w-md text-[var(--primary-text)]"
            >

                <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer  border-2 border-dashed border-[var(--primary)] rounded-md h-48 flex items-center justify-center bg-[var(--background)] hover:bg-[var(--paper-custom)] transition-colors duration-200"
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
                    disabled={isLoading}
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Uploading..." : "Upload Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostUpload;
