import PostList from "../components/PostList.tsx";

const HomePage = () => {
    return (
        <div className={'flex justify-center w-[180%]'} style={{ maxWidth: "90vw"}}>
            <div className="w-150 mt-8">
                <PostList />
            </div>
        </div>
    )
}
export default HomePage
