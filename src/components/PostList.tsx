import { useState, useEffect, useCallback } from "react";
import { ImageOff, Heart, MessageCircle } from "lucide-react";
import { type Post, useGetPostsQuery } from "../features/post/api.ts";

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const { data, isLoading, isFetching, isError } = useGetPostsQuery({ cursor: cursor ?? '' });

    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (data?.results) {
            setPosts((prevPosts) => [...prevPosts, ...data.results]);
            setLoadingMore(false);
        }
    }, [data]);

    const handleScroll = useCallback(() => {
        if (loadingMore || isFetching) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 300;

        if (scrollPosition >= threshold && data?.next) {
            setLoadingMore(true);
            const nextCursor = new URL(data.next).searchParams.get("cursor");
            setCursor(nextCursor);
        }
    }, [loadingMore, isFetching, data]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    if (isLoading && posts.length === 0) {
        return (
            <div
                className="min-h-screen flex justify-center items-center"
                style={{ backgroundColor: "var(--primary-bg)" }}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div
                            className="w-16 h-16 border-4 rounded-full"
                            style={{ borderColor: "var(--primary)/0.2" }}
                        ></div>
                        <div
                            className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: "var(--primary)" }}
                        ></div>
                    </div>
                    <p
                        className="font-medium"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Loading posts...
                    </p>
                </div>
            </div>
        );
    }

    if (isError && posts.length === 0) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center text-center p-4"
                style={{ backgroundColor: "var(--primary-bg)", color: "var(--text-tertiary)" }}
            >
                <div
                    className="rounded-2xl p-12 shadow-lg border max-w-md mx-auto"
                    style={{ backgroundColor: "var(--primary-bg)", borderColor: "var(--text-tertiary)" }}
                >
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ backgroundColor: "var(--text-secondary)" }}
                    >
                        <ImageOff
                            className="w-10 h-10"
                            style={{ color: "var(--text-tertiary)" }}
                        />
                    </div>
                    <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: "var(--primary-text)" }}
                    >
                        No posts found
                    </h3>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Check your connection and try again
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--primary-bg)", minHeight: "100vh" }}>
            <div
                className="sticky top-0 z-10 border-b"
                style={{
                    backgroundColor: "var(--primary-bg)",
                    backdropFilter: "blur(12px)",
                    borderColor: "var(--text-tertiary)",
                }}
            >
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary-text)" }}
                    >
                        Feed
                    </h1>
                </div>
            </div>

            {/* Posts Container */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <article
                            key={post.id}
                            className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300"
                            style={{
                                borderColor: "var(--text-tertiary)",
                                backgroundColor: "var(--primary-bg)",
                                animationDelay: `${index * 100}ms`,
                                animation: "fadeInUp 0.6s ease-out forwards",
                            }}
                        >
                            <div className="flex items-center justify-between p-4 pb-3">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                        style={{ background: "linear-gradient(to bottom right, var(--primary), var(--primary-hover))" }}
                                    >
                                        <span
                                            className="text-white font-semibold text-sm"
                                        >
                                            {post.author?.username?.[0]?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <h3
                                            className="font-semibold text-sm"
                                            style={{ color: "var(--primary-text)" }}
                                        >
                                            {post.author?.username || "Anonymous"}
                                        </h3>
                                        <p
                                            className="text-xs"
                                            style={{ color: "var(--text-tertiary)" }}
                                        >
                                            {post.created_at
                                                ? new Date(post.created_at).toLocaleDateString()
                                                : "Recently"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 rounded-full transition-colors duration-200 hover:bg-[var(--text-secondary)]"
                                >
                                </button>
                            </div>

                            <div className="relative">
                                {post.image ? (
                                    <div className="relative group">
                                        <img
                                            src={post.image}
                                            alt={post.caption || "Post image"}
                                            className="w-full h-70 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-center h-80"
                                        style={{
                                            background: "linear-gradient(to bottom right, var(--text-tertiary), var(--primary-bg))",
                                        }}
                                    >
                                        <div className="text-center">
                                            <ImageOff
                                                className="w-16 h-16 mx-auto mb-3"
                                                style={{ color: "var(--text-tertiary)" }}
                                            />
                                            <p
                                                className="font-medium"
                                                style={{ color: "var(--text-tertiary)" }}
                                            >
                                                No image
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="px-4 py-3">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-2 group">
                                            <div
                                                className="p-2 rounded-full transition-colors duration-200 group-hover:bg-red-50"
                                            >
                                                <Heart
                                                    className="w-6 h-6 transition-colors duration-200"
                                                    style={{
                                                        color: "var(--text-tertiary)",
                                                    }}
                                                />
                                            </div>
                                        </button>
                                        <button className="flex items-center space-x-2 group">
                                            <div
                                                className="p-2 rounded-full transition-colors duration-200 group-hover:bg-blue-50"
                                            >
                                                <MessageCircle
                                                    className="w-6 h-6 transition-colors duration-200"
                                                    style={{
                                                        color: "var(--text-tertiary)",
                                                    }}
                                                />
                                            </div>
                                        </button>
                                        <button className="flex items-center space-x-2 group">
                                            <div
                                                className="p-2 rounded-full transition-colors duration-200 group-hover:bg-green-50"
                                            >
                                            </div>
                                        </button>
                                    </div>
                                    <button className="group">
                                        <div
                                            className="p-2 rounded-full transition-colors duration-200 group-hover:bg-yellow-50"
                                        >

                                        </div>
                                    </button>
                                </div>

                                {/* Post Caption */}
                                {post.caption && (
                                    <div className="space-y-2">
                                        <p
                                            style={{ color: "var(--primary-text)" }}
                                            className="leading-relaxed"
                                        >
                                            <span className="font-semibold mr-2">
                                                {post.author?.username || "Anonymous"}
                                            </span>
                                            {post.caption}
                                        </p>
                                    </div>
                                )}

                                <div
                                    className="flex items-center space-x-4 mt-3 pt-3 border-t"
                                    style={{ borderColor: "var(--text-tertiary)" }}
                                >
                                    <span
                                        className="text-sm"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {post.likes_count || 0} likes
                                    </span>
                                    <span
                                        className="text-sm"
                                        style={{ color: "var(--text-tertiary)" }}
                                    >
                                        {post.comments_count || 0} comments
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Loading More Indicator */}
                {(isFetching || loadingMore) && (
                    <div className="flex justify-center py-8">
                        <div
                            className="flex items-center space-x-3 px-6 py-3 rounded-full shadow-sm border"
                            style={{
                                backgroundColor: "var(--primary-bg)",
                                borderColor: "var(--text-tertiary)",
                            }}
                        >
                            <div className="relative">
                                <div
                                    className="w-5 h-5 border-2 rounded-full"
                                    style={{ borderColor: "var(--primary)/0.2" }}
                                ></div>
                                <div
                                    className="absolute top-0 left-0 w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                                    style={{ borderColor: "var(--primary)" }}
                                ></div>
                            </div>
                            <span
                                className="font-medium"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                Loading more posts...
                            </span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default PostList;
