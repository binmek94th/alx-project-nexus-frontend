import {type Story, usePostStoryMutation, useGetStoriesQuery} from "./api.ts";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import {useState} from "react";
import StoryView from "./StoryView.tsx";
import DialogBox from "../../components/DialogBox.tsx";
import {Plus} from "lucide-react"
import CreateStory from "./CreateStory.tsx";
import {toast} from "sonner";

const StoryComponent = () => {
    const { data: stories, isLoading } = useGetStoriesQuery();
    const [postStory] = usePostStoryMutation();
    const [story, setStory] = useState<Story | null>(null)
    const [createStory, setCreateStory] = useState(false)

    if (isLoading)
        return <div>Loading...</div>;

    if (!stories?.results?.length)
        return <div className="text-gray-500">No stories available</div>;

    const handleCreateStory = async (story: { image: File; caption: string }) => {
        const result = await postStory(story);
        if ('error' in result) {
            if ('error' in result) {
                const err = result.error;
                if (err && 'data' in err && typeof err.data === 'object')
                    toast.error("Upload failed: " + (err.data as any)[0]);
                else toast.error("Upload failed: Unknown error");
            }
        }
        else {
            toast.success("Story created successfully.");
        }
    };

    return (
        <div className="flex gap-4 overflow-x-auto p-4">
            <div
                onClick={() => setCreateStory(true)}
                className="flex-shrink-0 cursor-pointer w-[70px] h-[70px] flex items-center justify-center
                border-2 rounded-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white
                transition-colors duration-200"
                title="Create Story"
            >
                <Plus size={32} />
            </div>

            {stories.results.map((story) => (
                <div
                    onClick={() => setStory(story)}
                    key={story.id}
                    className={`flex-shrink-0 cursor-pointer 
                        ${story.viewed ? "opacity-50" : "opacity-100"}`}
                >
                    <ProfilePicture
                        src={story.author.profile_picture}
                        alt={story.author.username}
                        size={70}
                        className={`border-2 rounded-full 
                            ${story.viewed ? "border-gray-300" : "border-blue-500"}`}
                    />
                </div>
            ))}
            {story &&
                <DialogBox style={{ width: "600px" }} onClose={() => setStory(null)}>
                    <StoryView story={story} profile_picture={story.author.profile_picture}></StoryView>
                </DialogBox>
            }
            {createStory &&
            <DialogBox style={{ width: "600px"}} onClose={() => setCreateStory(false)}>
                <CreateStory onSubmit={handleCreateStory}></CreateStory>
            </DialogBox>
            }
        </div>
    );
};

export default StoryComponent;
