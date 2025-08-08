import { useAddCommentMutation, useGetCommentsQuery } from "./api.ts";
import Spinner from "../../components/Spinner.tsx";
import { formatDistanceToNow } from "date-fns";
import Typography from "../../components/Typography.tsx";
import { useState } from "react";
import LineTextField from "../../components/LineTextField.tsx";
import PrimaryButton from "../../components/PrimaryButton.tsx";
import { toast } from "sonner";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import DialogBox from "../../components/DialogBox.tsx";
import Profile from "../profile/Profile.tsx";
import { encodeGlobalId } from "../../utils/graphql.ts";

interface Props {
    post: string;
}

const CommentItem = ({ post, comment, level = 1 }: { comment: any; level?: number; post: string }) => {
    const [newComment, setNewComment] = useState<string>("");
    const [addComment] = useAddCommentMutation();
    const [profileId, setProfileId] = useState<string | null>(null);

    const handleComment = async () => {
        if (!newComment?.trim()) return;

        const res = await addComment({
            id: post,
            content: newComment,
            comment: comment.id,
        });

        if (res.error) {
            console.error(res.error);
            return;
        }

        toast.success("Comment Saved.");
        setNewComment("");
    };

    return (
        <div className={`pl-${level * 2} mb-4 border-l text-left border-gray-200`}>
            <div className="flex items-start gap-3">
                <div onClick={() => setProfileId(encodeGlobalId(comment.user.id))} className="cursor-pointer">
                    <ProfilePicture className="ml-2" size={30} src={comment.user.profile_picture} />
                </div>

                <div className="flex-1">
                    <div className={'flex justify-between'}>
                        <div>
                            <div className="text-sm text-[var(--text-primary)]">{comment.content}</div>
                            <div className="text-xs text-gray-500">
                                {comment.user?.username || "Anonymous"} ·{" "}
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </div>
                        </div>

                        {!newComment && (
                            <Typography className="cursor-pointer mt-1" variant="label" onClick={() => setNewComment(" ")}>
                                Reply
                            </Typography>
                        )}
                    </div>

                    {newComment !== "" && (
                        <div className="flex items-center mt-2 gap-2">
                            <LineTextField value={newComment} handleChange={(value) => setNewComment(value)} />
                            <PrimaryButton onClick={handleComment} className="h-8 w-20 mt-1">
                                Comment
                            </PrimaryButton>
                        </div>
                    )}

                    {comment.children?.length > 0 && (
                        <div className="mt-2">
                            {comment.children.map((child: any) => (
                                <CommentItem key={child.id} comment={child} level={level + 1} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {profileId && (
                <DialogBox style={{ width: "600px" }} title="Profile" onClose={() => setProfileId(null)}>
                    <Profile id={profileId} />
                </DialogBox>
            )}
        </div>
    );
};

const CommentList = ({ post }: Props) => {
    const { data: comments, isLoading, error } = useGetCommentsQuery({ post });

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-red-500">Failed to load comments.</div>;

    return (
        <div className="mt-4 w-full">
            {comments?.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
                comments?.map((comment: any) => (
                    <CommentItem key={comment.id} comment={comment} post={post} />
                ))
            )}
        </div>
    );
};

export default CommentList;
