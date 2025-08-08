import {type TopUser, useRecommendedUsers} from "./hooks/useRecommendedUsers";
import Typography from "../../components/Typography";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import SecondaryButton from "../../components/SecondaryButton.tsx";
import {useFollowUserMutation} from "./api.ts";
import {decodeGlobalId} from "../../utils/graphql.ts";
import {toast} from "sonner";
import Spinner from "../../components/Spinner.tsx";
import {useState} from "react";
import PrimaryButton from "../../components/PrimaryButton.tsx";
import DialogBox from "../../components/DialogBox.tsx";
import Profile from "../profile/Profile.tsx";
import {useNavigate} from "react-router-dom";


const SuggestedToFollow = () => {
    const navigate = useNavigate();
    const { users, loading, error, loadMore, hasNextPage } = useRecommendedUsers();
    const [followUser] = useFollowUserMutation();
    const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(new Set());
    const [profileId, setProfileId] = useState('');

    if (loading && users.length === 0) return <Spinner></Spinner>;
    if (error) toast.error(error.message);

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
                toast.success(`You are now following ${users.find(user => user.id === id)?.username}`);
                const isFollowing = followedUserIds.has(id);

                setFollowedUserIds(prev => {
                    const newSet = new Set(prev);
                    if (isFollowing) newSet.delete(id);
                     else newSet.add(id);
                    return newSet;
                });            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            toast.error("Something went wrong!");
        }
    };

    const handleRowClick = (id: string) => {
        setProfileId(id);
    }

    const handleContinue = () => {
        navigate('/home')
    }

    return (
        <div className="space-y-2 w-100">
            <h2 className="text-xl font-bold">Who to follow</h2>
            {users.map((user: TopUser) => {
                const isFollowing = followedUserIds.has(user.id);

                return (
                    <div onClick={() => handleRowClick(user.id)} key={user.id} className="border border-[var(--paper-custom)] p-2 rounded shadow">
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-5">
                                <ProfilePicture className={'mt-3'} size={30} src={user.profilePicture} />
                                <div>
                                    <Typography variant={'p'}>{user.fullName}</Typography>
                                    <Typography variant="label" className="font-semibold">{user.username}</Typography>
                                </div>
                            </div>
                            <div>
                                { isFollowing ? (
                                    <PrimaryButton onClick={() => handleFollow(user.id)}>
                                        Unfollow
                                    </PrimaryButton>
                                ):
                                    <SecondaryButton onClick={() => handleFollow(user.id)}>
                                        Follow
                                    </SecondaryButton>
                                }
                            </div>

                        </div>
                        <p className="text-sm text-gray-600">{user.bio}</p>
                        {user.postInteractionScore && (
                            <p className="text-sm">Post Score: {user.postInteractionScore}</p>
                        )}
                    </div>
                );
            })}
            <div className={'flex justify-between'}>
                {hasNextPage && (
                    <button
                        onClick={(loadMore)}
                        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Load More
                    </button>
                )}
                <PrimaryButton className={'mt-4'} onClick={handleContinue}>Continue</PrimaryButton>
            </div>
            {profileId &&
                <DialogBox title={"Profile"} onClose={() => setProfileId('')}>
                    <Profile id={profileId}></Profile>
                </DialogBox>
            }
        </div>
    );
};

export default SuggestedToFollow;
