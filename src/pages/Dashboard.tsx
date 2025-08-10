import {Outlet, useNavigate} from "react-router-dom";
import SideBar from "./SideBar.tsx";
import {useEffect} from "react";
import {checkLogin} from "../utils/checkLogin.ts";

interface Props {
    newMessage: boolean;
}

const Dashboard = ({newMessage}: Props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const navigateNoLogin = () => {
            if (!checkLogin()) navigate("/login");
        }
        navigateNoLogin();
    }, [navigate]);
    return (
        <div className="flex gap-2">
            <SideBar newMessage={newMessage}></SideBar>
            <div className="lg:ml-64 p-4 min-w-0">
                <Outlet />
            </div>
        </div>
    )
}
export default Dashboard
