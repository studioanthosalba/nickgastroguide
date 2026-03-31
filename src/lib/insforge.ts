import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  projectId: process.env.NEXT_PUBLIC_INSFORGE_PROJECT_ID!,
  apiKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

export const createAuthenticatedClient = (token: string) => {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_INSFORGE_PROJECT_ID!,
    apiKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    token,
  });
};
