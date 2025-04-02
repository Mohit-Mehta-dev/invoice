"use server";

import { cookies } from "next/headers";

interface CreateAuthCookieProps {
  data: string;
}

export const createAuthCookie = async ({ data }: CreateAuthCookieProps) => {
  cookies().set("userAuth", data, { secure: true });
};

export const deleteAuthCookie = async () => {
  cookies().delete("userAuth");
};
