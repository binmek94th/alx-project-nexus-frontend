import { Loader2 } from "lucide-react";

const SmallSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
);

export default SmallSpinner;