"use client";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof LoginSchema>) {
    setIsSubmitting(true);
    signIn(formData)
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Esqueceu sua senha?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        </div>

        <Button disabled={isSubmitting} type="submit" className="w-full text-white">

          {isSubmitting ? (
            <>
              <span className="hidden">Submitting...</span>
              <Loader2 className="animate-spin w-5 h-5 mr-3" />{' '}
            </>
          ) : (
            <>
              <span className="group-hover:-traslate-y-[120%] group-hover:opacity-0 transition-all duration-500 ">
                Login
              </span>

            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
