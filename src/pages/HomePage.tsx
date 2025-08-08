import PostList from "../components/PostList.tsx";
import StoryComponent from "../features/story/StoryComponent.tsx";

const HomePage = () => {
    return (
        <div className={'flex justify-center w-[180%]'} style={{ maxWidth: "90vw"}}>
            <div className={'flex flex-col'}>
                <StoryComponent></StoryComponent>
                <div className="w-150">
                    <PostList />
                </div>
            </div>
        </div>
    )
}
export default HomePage
