import {useGetFollowersQuery} from "./api.ts";
import UserList from "./UserList.tsx";
import Spinner from "../../components/Spinner.tsx";
import {toast} from "sonner";

interface Props {
    user?: string;
}

const Followers = ({user}: Props) => {
    const { data: users, error, isLoading } = useGetFollowersQuery(user);

    if (isLoading) return <Spinner></Spinner>
    if (!users) return null

    if (error && "data" in error) {
        const errorMessage =
            "message" in error
                ? error.message as string
                : typeof error.data === "string"
                    ? error.data as string
                    : JSON.stringify(error.data) as string

        toast.error(errorMessage);
        return null;
    }

    return (
        <div>
            <UserList users={users.results}></UserList>
        </div>
    )
}
export default Followers
