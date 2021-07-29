import { ReactNode } from "react";
import { usePermitions } from "../hooks/usePermitions";

export interface CanProps {

    children: ReactNode;
    permitions?: string[];
    roles?: string[];

}

const Can: React.FC<CanProps> = ({ children, permitions, roles }: CanProps) => {

    const userCanSeeComponent = usePermitions({ permitions, roles })

    if (!userCanSeeComponent) {
        return null
    }
    return (

        <>
            {children}
        </>
    );
}

export default Can;