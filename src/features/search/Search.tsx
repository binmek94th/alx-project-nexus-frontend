import {type Post, useLazySearchQuery} from "../post/api.ts";
import TextField from "../../components/TextField.tsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import Typography from "../../components/Typography.tsx";
import PostGrid from "../../components/PostGrid.tsx";
import {useSearchParams} from "react-router-dom";

const Search = () => {
    const [searchParams] = useSearchParams()
    const rawQuery = searchParams.toString();
    const [searchQuery, setSearchQuery] = useState<string | null>(null)
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [debouncedQuery, setDebouncedQuery] = useState<string>("");
    const [trigger] = useLazySearchQuery()

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery)
            setDebouncedQuery(searchQuery);
            else if (rawQuery)
                setDebouncedQuery(rawQuery.replace(/=$/, "").trim());
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, rawQuery]);

    useEffect(() => {
        const search = async () => {
            if (!debouncedQuery.trim()) {
                setPosts(null);
                return;
            }
            const result = await trigger({ search_string: debouncedQuery });
            if ("error" in result) {
                const err = result.error;
                if (err && "data" in err && typeof err.data === "object") {
                    toast.error("Search failed: " + (err.data as any)[0]);
                } else {
                    toast.error("Search failed: Unknown error");
                }
            }
            setPosts(result.data?.results || []);
        };
        search();
    }, [debouncedQuery, trigger]);

    return (
        <div className={'w-[90vw] min-h-screen'}>
            <div className={"flex pl-10 w-full"}>
                <TextField className={'w-100'} placeholder={"Search Here"} handleChange={(value: string)=> setSearchQuery(value)}></TextField>
            </div>

            { posts?.length === 0 && (
                <div className={'flex flex-1 justify-center items-center'}>
                    <Typography>No post Found</Typography>
                </div>
            )}
            {posts?.length &&
                <PostGrid posts={posts}></PostGrid>
            }
        </div>
    )
}
export default Search
