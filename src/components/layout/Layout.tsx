import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Topbar from "./Topbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="d-flex">
            <Sidebar
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />


            <div className="flex-grow-1">

                <Topbar />
                <div className="p-3">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
