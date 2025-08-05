import {Outlet} from "react-router-dom";
import SideBar from "./SideBar.tsx";

const Dashboard = () => {
    return (
        <div className="flex gap-2">
            <SideBar></SideBar>
            <div className="lg:ml-64 p-4 min-w-0">
                <Outlet />
            </div>
        </div>
    )
}
export default Dashboard
