import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import SecurityAlert from "./context/security.alert.context";
import { isON } from "./configuration/security.config";
import { ToastProvider, ToastViewport } from "./components/atoms/toast";

// ✅ Import styles as URLs instead of direct imports
import appStylesHref from "./app.css?url";
import leafletStylesHref from "leaflet/dist/leaflet.css?url";

export const links: LinksFunction = () => [
  // Google Fonts
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },

  // ✅ App and Leaflet CSS (client-side only)
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: leafletStylesHref },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <SecurityAlert isOn={isON}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Outlet />
          <ToastViewport />
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SecurityAlert>
  );
}
