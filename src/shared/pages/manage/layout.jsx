import { Outlet } from "react-router-dom";

const Index = () => {
    return(
        <>
            <h1>manage</h1>
            <div>
                <Outlet />
            </div>
        </>
    );
}

export default Index;