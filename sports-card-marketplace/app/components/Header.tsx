import Link from "next/link"
import Notifications from "./Notifications"
import { useSession } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SplatBrats Cards
          </Link>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link href="/forum">Forum</Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <Notifications />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/register">Register</Link>
                </li>
                <li>
                  <Link href="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

