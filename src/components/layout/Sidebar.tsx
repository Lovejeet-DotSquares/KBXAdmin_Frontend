import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MenuConfig } from "../../config/menu.config";
import { getIcon } from "../../utils/iconLibrary";
import { useAuth } from "../../hooks/useAuth";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
interface MenuOpenState {
    [key: string]: boolean;
}

const Sidebar: React.FC<{ mobileOpen: boolean; onCloseMobile: () => void }> = ({
    mobileOpen,
    onCloseMobile,
}) => {
    const { role } = useAuth();

    const [collapsed, setCollapsed] = useState<boolean>(() => {
        return localStorage.getItem("sidebarCollapsed") === "true";
    });

    const [openGroups, setOpenGroups] = useState<MenuOpenState>({});

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", String(collapsed));
    }, [collapsed]);

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const visibleMenu = MenuConfig.filter((item) =>
        item.roles.includes(role || "")
    );

    const width = collapsed ? 70 : 240;

    return (
        <>
            <div
                className={`sidebar bg-light border-end d-flex flex-column p-2
                ${mobileOpen ? "sidebar-mobile-open" : ""}`}
                style={{
                    width,
                    minHeight: "100vh",
                    transition: "width 0.25s ease",
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center px-2 mb-3">
                    {!collapsed && <img
                        src="/Arkenlogo.png"
                        alt="Logo"
                        onClick={() => setCollapsed((c) => !c)}
                        style={{
                            cursor: "pointer",
                            height: collapsed ? 35 : 40,
                            width: "auto",
                            transition: "0.3s",
                            marginRight: collapsed ? 0 : 8,
                            objectFit: "contain",
                        }}
                    />}

                    {collapsed && <img
                        src="/arken-tab-logo.png"
                        alt="Logo"
                        onClick={() => setCollapsed((c) => !c)}
                        style={{
                            height: collapsed ? 35 : 40,
                            width: "auto",
                            transition: "0.3s",
                            marginRight: collapsed ? 0 : 8,
                            objectFit: "contain",
                        }}
                    />}

                </div>

                {/* Menu */}
                <ul className="nav flex-column small">
                    {visibleMenu.map((item) => {
                        const isGroup = !!item.children;

                        if (!isGroup) {
                            return (
                                <li key={item.path} className="nav-item mb-1">
                                    <NavLink
                                        to={item.path!}
                                        className={({ isActive }) =>
                                            `nav-link d-flex align-items-center gap-2 
                                            ${isActive ? "active bg-primary text-white" : "text-dark"}`
                                        }
                                        onClick={onCloseMobile}
                                    >
                                        <span style={{ fontSize: 18 }}>{getIcon(item.icon)}</span>
                                        {!collapsed && <span>{item.title}</span>}
                                    </NavLink>
                                </li>
                            );
                        }

                        // GROUP (Collapsible)
                        return (
                            <li key={item.title} className="nav-item mb-1">
                                <button
                                    className="btn w-100 text-start d-flex align-items-center gap-2"
                                    onClick={() => toggleGroup(item.title)}
                                >
                                    <span style={{ fontSize: 18 }}>{getIcon(item.icon)}</span>
                                    {!collapsed && (
                                        <>
                                            <span>{item.title}</span>
                                            <span className="ms-auto">
                                                {openGroups[item.title] ? <FiChevronDown /> : <FiChevronRight />}
                                            </span>
                                        </>
                                    )}
                                </button>

                                {/* Collapsible Children */}
                                {!collapsed && openGroups[item.title] && (
                                    <ul className="nav flex-column ms-4 mt-1">
                                        {item.children
                                            ?.filter((c) => c.roles.includes(role || ""))
                                            .map((child) => (
                                                <li key={child.path} className="nav-item mb-1">
                                                    <NavLink
                                                        to={child.path!}
                                                        className={({ isActive }) =>
                                                            `nav-link d-flex align-items-center gap-2 
                                                            ${isActive ? "active bg-primary text-white" : "text-dark"}`
                                                        }
                                                        onClick={onCloseMobile}
                                                    >
                                                        {getIcon(child.icon)}
                                                        <span>{child.title}</span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile background overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={onCloseMobile}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 900,
                    }}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
