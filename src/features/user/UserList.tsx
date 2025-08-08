import ProfilePicture from "../../components/ProfilePicture.tsx";
import Typography from "../../components/Typography.tsx";
import DialogBox from "../../components/DialogBox.tsx";
import Profile from "../profile/Profile.tsx";
import {useState} from "react";
import type {User} from "./api.ts";

interface Props {
    users: User[];
}

const UserList = ({users}: Props) => {
    const [profileId, setProfileId] = useState("")

    const handleRowClick = (id: string) => {
        setProfileId(id);
    }
    return (
        <div>
            {users?.map((user: any) => {
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
                        </div>
                        <p className="text-sm text-gray-600">{user.bio}</p>
                        {user.postInteractionScore && (
                            <p className="text-sm">Post Score: {user.postInteractionScore}</p>
                        )}
                    </div>
                );
            })}
            <div className={'flex justify-between'}>
            </div>
            {profileId &&
                <DialogBox title={"Profile"} onClose={() => setProfileId('')}>
                    <Profile id={profileId}></Profile>
                </DialogBox>
            }
        </div>
    )
}
export default UserList
