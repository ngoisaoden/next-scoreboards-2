import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/auth.actions";
import { getUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Scoreboards",
  description: "Track players, rounds, and card game leaderboards."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <header className="border-b bg-card">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-semibold tracking-normal">
              Card Scoreboards
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <Link className="text-muted-foreground hover:text-foreground" href="/scoreboards">
                    Scoreboards
                  </Link>
                  <form action={logout}>
                    <button className="text-muted-foreground hover:text-foreground" type="submit">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link className="text-muted-foreground hover:text-foreground" href="/login">
                  Log in
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
