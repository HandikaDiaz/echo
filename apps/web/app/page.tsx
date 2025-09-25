"use client"
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany)

  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <p>App/web</p>
          <UserButton />
          <div>
            {JSON.stringify(users, null, 2)}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>
          Must be signed in
        </p>
        <SignInButton />
      </Unauthenticated>
    </>
  )
}
