import {navigateTo} from "./router.ts";
import { showToast } from "./toastUtils.tsx";

export const handleError = (result: any) => {
    if (result.error) {
        if (result.error.status === 'FETCH_ERROR') {
            navigateTo('/network-error');
            return result;
        }
        if (result.error.status === 404) {
            navigateTo('/not-found');
            return result;
        }
        if (result.error.status === 401){
            navigateTo('/login')
        }
        if (result.error.status === 403) {
            if (result.error.data?.detail === "Token has expired.") {
                showToast("error", "Login Expired redirecting to login in 5 seconds.");
                setTimeout(() => navigateTo('/login'), 3000);
                return result;
            }
            navigateTo('/forbidden');
            return result;
        }
    }
}