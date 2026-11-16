"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/lib/actions/auth";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    const result = await signupAction(data);
    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  };

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        Sign up to track orders and upload prescriptions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <Input {...register("name")} placeholder="Full name" />
          {errors.name && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone (optional)</label>
          <Input {...register("phone")} placeholder="+91 98765 43210" />
          {errors.phone && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input type="password" {...register("password")} placeholder="At least 8 characters" />
          {errors.password && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Confirm password</label>
          <Input type="password" {...register("confirmPassword")} placeholder="Re-enter password" />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-[color:var(--color-danger)]">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[color:var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[color:var(--color-primary)] hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}