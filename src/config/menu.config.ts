export interface MenuItem {
  title: string;
  path?: string; // path only for leaf items
  icon: string;
  roles: string[];
  children?: MenuItem[]; // nested menu
}

export const MenuConfig: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: "home",
    roles: ["Admin", "User", "Reviewer"],
  },
  {
    title: "Forms",
    icon: "layers",
    path: "/forms",
    roles: ["Admin"],
  },
  {
    title: "Question Bank",
    icon: "layers",
    path: "/question-bank",
    roles: ["Admin"],
  },
  {
    title: "Management",
    icon: "layers",
    roles: ["Admin"],
    children: [
      {
        title: "Users",
        path: "/users",
        icon: "users",
        roles: ["Admin"],
      },
      {
        title: "Reports",
        path: "/reports",
        icon: "file-text",
        roles: ["Admin", "Reviewer"],
      },
    ],
  },

  {
    title: "Settings",
    icon: "settings",
    roles: ["Admin"],
    children: [
      {
        title: "Profile",
        path: "/profile",
        icon: "user",
        roles: ["Admin", "User", "Reviewer"],
      },
    ],
  },
];
