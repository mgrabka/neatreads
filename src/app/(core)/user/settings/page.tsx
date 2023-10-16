"use client"

import { fontHeader } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import NavigationBackButton from "@/components/navigation-back-button"

import ChangePasswordForm from "./change-password-form"
import ChangeUsernameForm from "./change-username-form"
import DeleteUserDialog from "./delete-user-dialog"

const UserSettingsPage = () => {
  return (
    <div>
      <NavigationBackButton />
      <div className={cn("my-8 text-4xl", fontHeader.className)}>
        Account Settings
      </div>
      <div className="grid gap-8 ">
        <div className="grid gap-4">
          <ChangeUsernameForm />
          <ChangePasswordForm />
        </div>
        <Separator />
        <DeleteUserDialog />
      </div>
    </div>
  )
}

export default UserSettingsPage
