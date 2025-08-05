import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginForm from "./features/auth/Login.tsx";
import SignupForm from "./features/auth/Signup.tsx";
import VerifyEmail from "./features/auth/VerifyEmail.tsx";
import { Toaster } from "sonner";
import VerifyEmailPage from "./features/auth/VerifyEmailPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ChangePassword from "./features/auth/ChangePassword.tsx";
import UserToFollowForNewUser from "./pages/UserToFollowForNewUser.tsx";
import HomePage from "./pages/HomePage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path={'/verify_email'} element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ChangePassword />} />
                <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                <Route path={'/suggested_to_follow'} element={<UserToFollowForNewUser />} />
                <Route path={'/'} element={<Dashboard />}>
                    <Route path={'/'} element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
