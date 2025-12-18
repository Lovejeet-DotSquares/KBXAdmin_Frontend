export const setPageTitle = (title: string, role: string) => {
  document.title = title
    ? `${title} | KBX ${role === "Admin" ? "ADMIN" : "USER"}`
    : "KBX APPLICATION";
};
