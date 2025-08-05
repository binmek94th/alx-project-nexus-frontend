import SuggestedToFollow from "../features/follow/SuggestedToFollow.tsx";
import Typography  from "../components/Typography.tsx";

const UserToFollowForNewUser = () => {
    return (
        <div className={'flex flex-col items-center justify-center'}>
            <Typography className={'mt-5'} variant={'h2'}>Suggested Users </Typography>
            <SuggestedToFollow></SuggestedToFollow>
        </div>
    )
}
export default UserToFollowForNewUser
