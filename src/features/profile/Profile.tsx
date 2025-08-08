import {useProfile} from "../follow/hooks/useProfile.ts";
import Typography from "../../components/Typography.tsx";
import Spinner from "../../components/Spinner.tsx";
import getErrorMessage from "../../utils/error.ts";
import {toast} from "sonner";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import PostGrid from "../../components/PostGrid.tsx";
import {encodeGlobalId} from "../../utils/graphql.ts";
import {useState} from "react";
import DialogBox from "../../components/DialogBox.tsx";
import Followers from "../user/Followers.tsx";
import Following from "../user/Following.tsx";

interface Props {
    id?: string;
}

const Profile = ({id}: Props) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const [dialogBox, setDialogBox] = useState("")

    const userId = id ?? parsedUser?.id ?? "";

    const { profile, loading, error } = useProfile(encodeGlobalId(userId));

    if (loading) return <Spinner />;
    if (error) {
        toast.error(getErrorMessage(error));
        return null;
    }

    return (
        <div>
            <div className="flex gap-5 mt-5 w-100">
                <div className="w-5">
                    <ProfilePicture size={70} src={profile.profilePicture}></ProfilePicture>
                </div>
                <div className="ml-15 text-left">
                    <div>
                        <Typography variant={'p'}>{profile.fullName}</Typography>
                        <Typography variant={'label'}>@{profile.username}</Typography>
                    </div>
                    <div className={'flex gap-5 mt-3'}>
                        <div className={'flex gap-2 p-2'}>
                            <Typography variant={'p'}>{profile.postCount}</Typography>
                            <Typography variant={'p'}>Posts</Typography>
                        </div>
                        <div onClick={() => setDialogBox("follower")} className={'flex gap-2 hover:bg-[var(--paper-custom)] p-2 rounded-2xl'}>
                            <Typography variant={'p'}>{profile.followersCount}</Typography>
                            <Typography variant={'p'}>Followers</Typography>
                        </div>
                        <div onClick={() => setDialogBox("following")} className={'flex gap-2 hover:bg-[var(--paper-custom)] p-2 rounded-2xl '}>
                            <Typography variant={'p'}>{profile.followingCount}</Typography>
                            <Typography variant={'p'}>Following</Typography>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 mt-8 ">
                <PostGrid posts={profile.posts}></PostGrid>
            </div>
            {dialogBox === "follower" && profile.followersCount && (
                <DialogBox
                    onClose={() => setDialogBox("")}
                    title="Followers"
                    style={{ width: "600px" }}
                >
                    <Followers />
                </DialogBox>
            )}


            {dialogBox === "following" && profile.followingCount && (
                <DialogBox
                    onClose={() => setDialogBox("")}
                    title="Followings"
                    style={{ width: "500px" }} // custom width
                >
                    <Following />
                </DialogBox>
            )}

        </div>
    )
}
export default Profile
