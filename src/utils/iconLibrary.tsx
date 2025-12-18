import type { JSX } from "react";
import {
    FiHome,
    FiUsers,
    FiFileText,
    FiLayers,
    FiSettings,
    FiUser
} from "react-icons/fi";

export const iconMap: Record<string, JSX.Element> = {
    home: <FiHome />,
    users: <FiUsers />,
    "file-text": <FiFileText />,
    layers: <FiLayers />,
    settings: <FiSettings />,
    user: <FiUser />
};

export const getIcon = (name: string): JSX.Element => {
    return iconMap[name] || <FiHome />;
};
