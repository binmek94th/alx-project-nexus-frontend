import { ImageOff, Eye } from "lucide-react";
import { type Post } from "../features/post/api.ts";
import Typography from "./Typography.tsx";

interface Props {
    posts: Post[];
}

const PostGrid = ({posts}: Props) => {

    const formatViewCount = (count: number) => {
        if (!count) return
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };
    if (!posts.length) {
        return (
            <div className="flex min-w-110 justify-center">
                <div className="flex justify-center items-center bg-[var(--background)] min-h-50 w-full rounded-2xl">
                    <Typography>No Posts</Typography>
                </div>
            </div>
        );
    }

    const getUrl = (src: string) => {
        if (src) {
            if (src.startsWith("http://") || src.startsWith("https://")) {
                return src;
            } else {
                return (`${import.meta.env.VITE_API_URL}image/${src}`);
            }
        }
    }

    return (
        <div className=" bg-[var(--background)] min-h-50 min-w-100 rounded-2xl">
            <div className="sticky top-0 z-10 0 border-b border-[var(--paper-custom)]">
                <div className="max-w-7xl mx-auto px-4 py-4">
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="group relative aspect-square bg-[var(--paper-custom)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                        >
                            {post.image ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={getUrl(post.image)}
                                        alt={`Post ${post.id}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-[var(--primary)]/10">
                                    <div className="text-center">
                                        <ImageOff className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-2" />
                                        <p className="text-[var(--text-secondary)] text-sm font-medium">No image</p>
                                    </div>
                                </div>
                            )}

                            {/* View Count Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-1.5 bg-black/30 rounded-full backdrop-blur-sm">
                                            <Eye className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-white font-semibold text-sm">
                                            {formatViewCount(post?.viewCount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)] rounded-xl transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostGrid;