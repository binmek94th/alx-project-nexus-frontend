import {Outlet} from "react-router-dom";
import SideBar from "./SideBar.tsx";

const Dashboard = () => {
    return (
        <div>
            <SideBar></SideBar>
            <div className="flex-1 p-4 min-w-0">
                <Outlet />
            </div>
        </div>
    )
}
export default Dashboard
