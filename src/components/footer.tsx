import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Facebook, Twitter } from "lucide-react"

import { Database } from "@/types/database"

import { Input } from "./ui/input"

const Footer = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <footer className="text-sm">
      <div className="my-8 flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-32">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold">Newsletter</h1>
            <p>
              Subscribe to our newsletter to get the latest news and updates.
            </p>
          </div>
          <Input placeholder="Email" />
        </div>
        <div className="grid grid-cols-2 gap-8 ">
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold">Account</h1>
            {user ? (
              <div className="flex flex-col">
                <Link className="hover:underline" href="/user/settings">
                  Settings
                </Link>
                <Link className="hover:underline" href="/">
                  Log out
                </Link>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link className="hover:underline" href="/auth/sign-in">
                  Login
                </Link>
                <Link className="hover:underline" href="/auth/sign-up">
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold">Neatreads</h1>
            <div className="flex flex-col">
              <Link className="hover:underline" href="/">
                Home
              </Link>
              <Link className="hover:underline" href="/">
                About us
              </Link>
              <Link className="hover:underline" href="/">
                Careers
              </Link>
              <Link className="hover:underline" href="/">
                Blog
              </Link>
              <Link className="hover:underline" href="/">
                Privacy policy
              </Link>
              <Link className="hover:underline" href="/">
                Cookie policy
              </Link>
              <Link className="hover:underline" href="/">
                Contact us
              </Link>
              <Link className="hover:underline" href="/">
                API
              </Link>
              <Link className="hover:underline" href="/">
                Help center
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t py-4  text-muted-foreground">
        <div className="flex justify-between">
          <p>© 2023, Neatreads</p>
          <div className="flex gap-4">
            <Link href="/">
              <Facebook size={18} />
            </Link>
            <Link href="/">
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
