"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/Card";

export default function LoginButtons() {
  return (
    <Card className="w-90">
      <CardHeader>
        <CardTitle className="text-center">AI Assistant</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button onClick={() => signIn("google")}>
          Sign in with Google
        </Button>

        <Button variant="outline" onClick={() => signIn("github")}>
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
