export function runRedirectToAdminLogin() {
  if (typeof window !== "undefined") {
    // Optionally store current URL so you can redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("adminRedirectAfterLogin", currentPath);

    // Redirect to admin login
    window.location.href = "/admin/login";
  }
}
