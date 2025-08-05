import {useProfile} from "./hooks/useProfile.ts";
import Typography from "../../components/Typography.tsx";
import Spinner from "../../components/Spinner.tsx";
import getErrorMessage from "../../utils/error.ts";
import {toast} from "sonner";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import PostGrid from "../../components/PostGrid.tsx";

interface Props {
    id: string;
}

const Profile = ({id}: Props) => {
    const { profile, loading, error } = useProfile(id);


    if (loading) return <Spinner></Spinner>
    if (error) toast.error(getErrorMessage(error));
    return (
        <div>
            <div className="flex gap-5 mt-5 w-100">
                <ProfilePicture size={70} src={profile.profilePicture}></ProfilePicture>
                <div className="text-left">
                    <div>
                        <Typography variant={'p'}>{profile.fullName}</Typography>
                        <Typography variant={'label'}>@{profile.username}</Typography>
                    </div>
                    <div className={'flex gap-5 mt-3'}>
                        <div className={'flex gap-2'}>
                            <Typography variant={'p'}>{profile.postCount}</Typography>
                            <Typography variant={'p'}>Posts</Typography>
                        </div>
                        <div className={'flex gap-2'}>
                            <Typography variant={'p'}>{profile.followersCount}</Typography>
                            <Typography variant={'p'}>Followers</Typography>
                        </div>
                        <div className={'flex gap-2'}>
                            <Typography variant={'p'}>{profile.followingCount}</Typography>
                            <Typography variant={'p'}>Following</Typography>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 mt-8 ">
                <PostGrid posts={profile.posts}></PostGrid>
            </div>
        </div>
    )
}
export default Profile
