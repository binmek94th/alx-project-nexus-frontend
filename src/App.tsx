import { Routes, Route, useNavigate } from "react-router-dom";
import LoginForm from "./features/auth/Login.tsx";
import SignupForm from "./features/auth/Signup.tsx";
import VerifyEmail from "./features/auth/VerifyEmail.tsx";
import { Toaster } from "sonner";
import VerifyEmailPage from "./features/auth/VerifyEmailPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ChangePassword from "./features/auth/ChangePassword.tsx";
import UserToFollowForNewUser from "./pages/UserToFollowForNewUser.tsx";
import HomePage from "./pages/HomePage.tsx";
import Profile from "./features/profile/Profile.tsx";
import Notification from "./features/notification/Notification.tsx";
import {setNavigate} from "./utils/router.ts";
import {useEffect} from "react";
import {checkLogin} from "./utils/checkLogin.ts";
import Search from "./features/search/Search.tsx";
import Create from "./features/post/Create.tsx";
import NetworkError from "./pages/NetworkError.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    useEffect(() => {
        checkLogin()
    }, []);

    return (
        <div>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/network-error" element={<NetworkError />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path={'/verify_email'} element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ChangePassword />} />
                <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                <Route path={'/suggested_to_follow'} element={<UserToFollowForNewUser />} />
                <Route path={'/'} element={<Dashboard />}>
                    <Route path={'/'} element={<HomePage />} />
                    <Route path={'/profile'} element={<Profile />}></Route>
                    <Route path={'/notifications'} element={<Notification />}></Route>
                    <Route path={'/search'} element={<Search />}></Route>
                    <Route path={'/create'} element={<Create />}></Route>
                </Route>
            </Routes>
        </div>
    );
};

export default App;
