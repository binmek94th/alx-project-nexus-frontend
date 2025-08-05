import { Loader2 } from "lucide-react";
import {cn} from "../utils/utils.ts";

interface Props {
    className?: string;
}

const Spinner = ({className}: Props) => (
    <div className={cn(className, "flex justify-center items-center h-full")}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
);

export default Spinner;