import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    {/* <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
    </div> */}
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* rest of your app, e.g. <Login /> */}
      <Toaster position="top-center" richColors={true} />
      <Outlet />
    </ThemeProvider>

    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
