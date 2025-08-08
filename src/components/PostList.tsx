import { useState, useEffect, useCallback } from "react";
import {ImageOff, Heart, MessageCircle, HeartIcon, MoreVertical} from "lucide-react";
import {
    type Post, useDeletePostMutation,
    useGetPostsQuery,
    useLikePostMutation,
    useUnLikePostMutation, useUpdatePostMutation
} from "../features/post/api.ts";
import ProfilePicture from "./ProfilePicture.tsx";
import Typography from "./Typography.tsx";
import {formatRelativeTime} from "../utils/date.ts";
import PrimaryButton from "./PrimaryButton.tsx";
import {decodeGlobalId} from "../utils/graphql.ts";
import {toast} from "sonner";
import {useFollowUserMutation} from "../features/follow/api.ts";
import LineTextField from "./LineTextField.tsx";
import DialogBox from "./DialogBox.tsx";
import {useAddCommentMutation} from "../features/comment/api.ts";
import CommentList from "../features/comment/CommentList.tsx";
import Profile from "../features/profile/Profile.tsx";
import {parseHashtagsToLinks} from "../utils/hashtags.ts";
import SecondaryButton from "./SecondaryButton.tsx";
import TextField from "./TextField.tsx";

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [followUser] = useFollowUserMutation();
    const [cursor, setCursor] = useState<string | null>(null);
    const { data, isLoading, isFetching, isError } = useGetPostsQuery({ cursor });
    const [likePost] = useLikePostMutation();
    const user = localStorage.getItem("user");
    const [unLikePost] = useUnLikePostMutation()
    const [addComment] = useAddCommentMutation();
    const [deletePost] = useDeletePostMutation();
    const [updatePost] = useUpdatePostMutation();
    const [loadingMore, setLoadingMore] = useState(false);
    const [commentData, setCommentData] = useState<{post: string, comment?: string, content: string} | null>(null)
    const [post, setPost] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [more, setMore] = useState(false);
    const [author, setAuthor] = useState("");
    const [option, setOption] = useState<"update" | "delete" | "">("")
    const [updatedCaption, setUpdatedCaption] = useState<string | null>(null)
    const [postId, setPostId] = useState<string>("")

    useEffect(() => {
        if (user){
            const parsedUser = JSON.parse(user);
            setAuthor(parsedUser.id)
        }
    }, [posts, user]);


    useEffect(() => {
        if (data?.results) {
            setPosts((prevPosts) => {
                const existingIds = new Set(prevPosts.map((p) => p.id));
                const newPosts = data.results.filter((post: any) => !existingIds.has(post.id));
                return [...prevPosts, ...newPosts];
            });
            setLoadingMore(false);
        }
    }, [data]);


    const handleScroll = useCallback(() => {
        if (loadingMore || isFetching || !data?.nextCursor) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 300;

        if (scrollPosition >= threshold) {
            setLoadingMore(true);
            setCursor(data.nextCursor);
        }
    }, [loadingMore, isFetching, data]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleFollow = async (id: string) => {
        const decoded_id = decodeGlobalId(id);
        try {
            const result = await followUser(decoded_id);

            if ('error' in result) {
                if ('error' in result) {
                    const err = result.error;
                    if (err && 'data' in err && typeof err.data === 'object')
                        toast.error("Follow failed: " + (err.data as any)[0]);
                    else toast.error("Follow failed: Unknown error");
                }
            } else {
                const post = posts.find((p) => p.id === id)
                if (post) {
                    setPosts((prevPosts) =>
                        prevPosts.map(p =>
                            p.id === post.id ? { ...post, isFollowingAuthor: true } : p
                        )
                    );
                    toast.success(`You are now following ${post?.author?.username}`);
                }
            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            toast.error("Something went wrong!");
        }
    };

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

    const handleLike = async (id: string) => {
        const result = await likePost(decodeGlobalId(id))
        if ('error' in result)
            return
        const post = posts.find((p) => p.id === id)
        if (post) {
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === post.id
                        ? { ...post, liked: true, likeCount: post.likeCount + 1 }
                        : p
                )
            );
        }
    }

    const handleUnLike =async (id: string) => {
        const result = await unLikePost(decodeGlobalId(id))
        if ('error' in result)
            return
        const post = posts.find((p) => p.id === id)
        if (post) {
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === post.id
                        ? { ...post, liked: false, likeCount: post.likeCount - 1 }
                        : p
                )
            );
        }
    }

    const handleComment = async () => {
        if (!commentData) return;

        const res = await addComment({
            id: decodeGlobalId(commentData.post),
            content: commentData.content,
            comment: commentData.comment && decodeGlobalId(commentData.comment),
        });

        if (res.error) {
            console.error(res.error);
            return;
        } else
            toast.success("Comment Saved.");

        const post = posts.find((p) => p.id === commentData.post);
        if (post) {
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === post.id
                        ? { ...post, commentCount: post.commentCount + 1 }
                        : p
                )
            );
        }
        setCommentData(null);
    };

    const handleUpdate = async () => {
        if (updatedCaption && postId) {
            const result = await updatePost({id: postId, caption: updatedCaption});
            if ('error' in result) {
                if ('error' in result) {
                    const err = result.error;
                    if (err && 'data' in err && typeof err.data === 'object')
                        toast.error("Update failed: " + (err.data as any)[0]);
                    else toast.error("Update failed: Unknown error");
                }
            }
            else {
                setMore(false)
                setUpdatedCaption(null)
                setOption("")
                toast.success("Post updated successfully.");
            }
        }
    }

    const handleDelete = async () => {
        if (!postId) return null
        const result = await deletePost({id: postId})
        if ('error' in result) {
            if ('error' in result) {
                const err = result.error;
                if (err && 'data' in err && typeof err.data === 'object')
                    toast.error("Delete failed: " + (err.data as any)[0]);
                else toast.error("Delete failed: Unknown error");
            }
        }
        else {
            setMore(false)
            setOption("")
            toast.success("Post deleted successfully.");
        }
    }

    return (
        <div style={{ backgroundColor: "var(--primary-bg)", maxWidth: "90vw", minHeight: "100vh" }}>
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

            <div className="max-w-lg px-2 sm:mx-auto sm:px-4 py-6">
                <div className="space-y-6">
                    {posts.map((post, index) => (
                        <article
                            key={post.id}
                            className=" shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300"
                            style={{
                                borderColor: "var(--text-tertiary)",
                                backgroundColor: "var(--primary-bg)",
                                animationDelay: `${index * 100}ms`,
                                animation: "fadeInUp 0.6s ease-out forwards",
                            }}
                        >
                            <div className="flex items-center justify-between p-4 pb-3">
                                {decodeGlobalId(post.author.id) === author &&
                                    <button
                                        aria-label="Menu"
                                        className="absolute top-4 z-100 right-0 p-2 rounded hover:bg-[var(--primary-hover)] transition-colors"
                                        onClick={() => setMore(prevState => !prevState)}
                                    >
                                        <MoreVertical  size={24} color="var(--primary-text)" />
                                    </button>
                                }

                                <div className={'flex w-full justify-between'}>
                                    <div onClick={()=> setProfileId(post.author.id)} className="flex items-center space-x-3">
                                       <ProfilePicture  className={'ml-[-15px]'} src={post.author.profilePicture}></ProfilePicture>
                                        <div className={'flex gap-3 items-center '}>
                                            <Typography variant={'h3'}>{post.author.username} </Typography>
                                            <p
                                                className="text-xs"
                                                style={{ color: "var(--text-tertiary)" }}
                                            >
                                                {post.createdAt
                                                    ? formatRelativeTime(new Date(post.createdAt).toLocaleDateString())
                                                    : "Recently"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        { post.isFollowingAuthor ?
                                            <PrimaryButton>Unfollow</PrimaryButton> :
                                            <PrimaryButton onClick={() => handleFollow(post.author.id)}>Follow</PrimaryButton>
                                        }
                                    </div>
                                </div>
                                <button
                                    className="p-2 rounded-full transition-colors duration-200 hover:bg-[var(--text-secondary)]"
                                >
                                </button>
                            </div>
                            <div className={'border border-[var(--primary)]'}>
                                <div className="relative">
                                    {post.image ? (
                                        <div className="relative group">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}image/${post.image}`}
                                                alt={post.caption || "Post image"}
                                                className="w-full h-120 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
                                <div className="px-4 py-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-4">
                                            <button className="flex items-center space-x-2 group">
                                                <div className="p-2 flex gap-4 rounded-full transition-colors duration-200">
                                                    <Typography>{post.likeCount || 0}</Typography>
                                                    {post.liked ?
                                                        <HeartIcon onClick={() => handleUnLike(post.id)} className={'w-6 h-6 cursor-pointer text-red-500 fill-red-500 transition-colors duration-200'} /> :
                                                        <Heart onClick={()=> handleLike(post.id)}
                                                            className="w-6 h-6 transition-colors duration-200 text-[var(--text-tertiary)] hover:text-red-500 cursor-pointer"
                                                        />
                                                    }
                                                </div>
                                            </button>
                                            <button className="flex items-center space-x-2 group">
                                                <div
                                                    onClick={() => setPost(post.id)}
                                                    className="p-2 flex gap-4 rounded-full transition-colors hover:bg-[var(--paper-custom)] duration-200 "
                                                >
                                                    <Typography>{post.commentCount || 0}</Typography>

                                                    <MessageCircle
                                                        className="w-6 h-6 "
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

                                    {post.caption && (
                                        <div className="space-y-2">
                                            <p
                                                style={{ color: "var(--primary-text)" }}
                                                className="leading-relaxed"
                                            >
                                                <Typography
                                                    dangerouslySetInnerHTML={{ __html: parseHashtagsToLinks(post.caption) }}
                                                />
                                            </p>
                                        </div>
                                    )}
                                    {commentData ?
                                        <div className="flex w-full align-center gap-2">
                                            <LineTextField className={'w-full'}
                                                handleChange={(value: string) =>
                                                    setCommentData(prev =>
                                                        prev ? { ...prev, content: value } : { post: post.id, content: value }
                                                    )
                                                }
                                            />
                                            <PrimaryButton onClick={handleComment} className={'h-10 w-20 mt-4'}>Comment</PrimaryButton>
                                        </div>
                                            :
                                        <Typography className="hover:underline cursor-pointer" onClick={()=> setCommentData({ content: '', post: post.id})} variant={'label'}>add a comment</Typography>
                                    }
                                </div>
                            </div>
                            {more &&
                                <div className={'flex flex-col gap-2 absolute top-15 right-0 bg-[var(--background)] p-4 rounded-2xl w-40'}>
                                    <PrimaryButton onClick={() => {
                                        setOption("update")
                                        setUpdatedCaption(post?.caption)
                                        setPostId(decodeGlobalId(post.id))
                                    }} className={'w-full'}>Update</PrimaryButton>
                                    <PrimaryButton onClick={() => {
                                        setOption("delete")
                                        setPostId(decodeGlobalId(post.id))
                                    }} className={'w-full'}>Delete</PrimaryButton>
                                </div>
                            }
                        </article>

                    ))}
                </div>
                {post &&
                    <div className={'w-100'}>
                        <DialogBox style={{ width: "400px" }} title={'Comment'} onClose={() => setPost(null)}>
                            <CommentList post={decodeGlobalId(post)}></CommentList>
                        </DialogBox>
                    </div>
                }

                {profileId &&
                    <div className={'w-50'}>
                        <DialogBox style={{ width: "600px" }} title={"Profile"} onClose={() => setProfileId('')}>
                            <Profile id={profileId}></Profile>
                        </DialogBox>
                    </div>
                }

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
                {option === "delete" &&
                    <div>
                        <DialogBox style={{ width: "500px"}} onClose={() => {
                            setOption("")
                            setMore(false);
                        }}>
                            <Typography>Are you sure you want to delete this story?</Typography>
                            <div className={'text-right '}>
                                <div className={'flex justify-end w-full gap-2 mt-4'}>
                                    <PrimaryButton onClick={() => {
                                        setOption("")
                                        setMore(false)
                                    }} className={'h-8'}>Cancel</PrimaryButton>
                                    <SecondaryButton onClick={handleDelete} className={'w-15'}>Delete</SecondaryButton>
                                </div>
                            </div>
                        </DialogBox>
                    </div>
                }
                {option === "update" && updatedCaption &&
                    <div>
                        <DialogBox style={{ width: "500px"}} onClose={() => {
                            setOption("")
                            setMore(false);
                        }}>
                            <TextField handleChange={(value) => setUpdatedCaption(value)} className={'mt-[-10px]'} title={"Caption"} value={updatedCaption}></TextField>
                            <div className={'flex justify-end w-full gap-2 mt-4'}>
                                <PrimaryButton onClick={() => {
                                    setOption("")
                                    setMore(false)
                                }} className={'h-8'}>Cancel</PrimaryButton>
                                <SecondaryButton className={'w-15'} onClick={handleUpdate}>Update</SecondaryButton>
                            </div>
                        </DialogBox>
                    </div>
                }
            </div>

        </div>
    );
};

export default PostList;
