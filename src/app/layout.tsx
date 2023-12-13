import * as React from "react";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import { ToastProvider } from "@/utils/toast";
import { TrackContextProvider } from "@/lib/track.wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body suppressHydrationWarning={true}>
        {/*  casching data giúp chúng ta render phía server */}
        <ThemeRegistry>
          {/* share session giữa các layout */}
          <NextAuthWrapper>
            {/* bọc các toast Provider để có thể thông báo tin nhắn  */}
            <ToastProvider>
              <TrackContextProvider>{children}</TrackContextProvider>
            </ToastProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
