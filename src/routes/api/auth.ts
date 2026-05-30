import { createFileRoute } from "@tanstack/react-router";
import { createUser, verifyUser } from "@/lib/user-store.server";

type Body = {
  action?: "login" | "signup";
  email?: string;
  password?: string;
  name?: string;
};

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;

        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response(JSON.stringify({ message: "Invalid JSON body." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const action = body.action;
        if (!action || (action !== "login" && action !== "signup")) {
          return new Response(JSON.stringify({ message: "Invalid action." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const email = body.email?.trim();
        const password = body.password?.trim();
        if (!email || !password) {
          return new Response(JSON.stringify({ message: "Please provide an email and password." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          if (action === "signup") {
            const user = createUser(email, password, body.name);
            return new Response(JSON.stringify({ user }), {
              status: 201,
              headers: { "content-type": "application/json" },
            });
          }

          const user = verifyUser(email, password);
          if (!user) {
            return new Response(JSON.stringify({ message: "Email or password is incorrect." }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ message: error instanceof Error ? error.message : "Unable to complete request." }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
