import {type Story, useDeleteStoryMutation, useGetStoryQuery, useUpdateStoryMutation} from "./api.ts";
import Typography from "../../components/Typography.tsx";
import { formatToHour} from "../../utils/date.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import {useEffect, useState} from "react";
import { MoreVertical } from "lucide-react";
import PrimaryButton from "../../components/PrimaryButton.tsx";
import DialogBox from "../../components/DialogBox.tsx";
import TextField from "../../components/TextField.tsx";
import SecondaryButton from "../../components/SecondaryButton.tsx";
import {toast} from "sonner";
import {parseHashtagsToLinks} from "../../utils/hashtags.ts";

interface Props {
    story: Story;
    profile_picture: string;
}

const StoryView = ({ story, profile_picture }: Props) => {
    const { data: storyDetail, isLoading, error } = useGetStoryQuery({ id: story.id });
    const [deleteStory] = useDeleteStoryMutation();
    const [updateStory] = useUpdateStoryMutation()
    const user = localStorage.getItem("user");
    const [author, setAuthor] = useState(false)
    const [more, setMore] = useState(false);
    const [option, setOption] = useState<"update" | "delete" | "">("")
    const [updatedCaption, setUpdatedCaption] = useState<string | null>(null)

    useEffect(() => {
        if (user){
            const parsedUser = JSON.parse(user);
            if (parsedUser.id == story.author.id){
                setAuthor(true);
            }
        }
    }, [story.author.id, user]);

    if (isLoading) return <div>Loading story...</div>;
    if (error) return <div>Error loading story</div>;
    if (!storyDetail) return <div>Story not found</div>;

    const handleUpdate = async () => {
        if (updatedCaption) {
            const result = await updateStory({id: story.id, caption: updatedCaption});
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
                toast.success("Story updated successfully.");
            }
        }
    }

    const handleDelete = async () => {
        const result = await deleteStory({id: story.id})
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
            toast.success("Story deleted successfully.");
        }
    }

    return (
        <div className="max-w-md relative mx-auto bg-[var(--paper-custom)] rounded-lg p-4 text-[var(--primary-text)] shadow-lg">
            {author &&
                <button
                    aria-label="Menu"
                    className="absolute top-4 z-100 right-4 p-2 rounded hover:bg-[var(--primary-hover)] transition-colors"
                    onClick={() => setMore(prevState => !prevState)}
                >
                    <MoreVertical  size={24} color="var(--primary-text)" />
                </button>
            }
            <div className="mb-4 flex items-center gap-3">
                <ProfilePicture src={profile_picture} alt="Author" size={50} />
                {storyDetail.expires_at &&
                    <Typography  className="text-[var(--text-tertiary)]">
                        {formatToHour(new Date(storyDetail.expires_at).toISOString())}
                    </Typography>
                }
            </div>

            <img
                src={storyDetail.image}
                alt={storyDetail.caption}
                className="w-full rounded-md mb-4 object-cover max-h-96"
            />
            <br />
            <div className="flex text-left gap-2">
                <Typography
                    dangerouslySetInnerHTML={{ __html: parseHashtagsToLinks(storyDetail.caption) }}
                />
            </div>
            {more &&
                <div className={'flex flex-col gap-2 absolute top-15 right-0 bg-[var(--background)] p-4 rounded-2xl w-40'}>
                    <PrimaryButton onClick={() => {
                        setOption("update")
                        setUpdatedCaption(story.caption)
                    }} className={'w-full'}>Update</PrimaryButton>
                    <PrimaryButton onClick={() => setOption("delete")} className={'w-full'}>Delete</PrimaryButton>
                </div>
            }
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
    );
};

export default StoryView;
