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
import { useAuth } from "@/providers/AuthContext";
import { Loader2 } from "lucide-react";
import { FormError } from "../_components/form-error";
import { FormSuccess } from "../_components/form-success";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await authService.login(values);
      console.log(response.data.message);
      if (response.status === 200) {
        setSuccess("Logado com sucesso!");
        router.push("/dashboard")
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Erro ao fazer login");
    }

    setIsSubmitting(false);

  };

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
        <FormError message={error} />
        <FormSuccess message={success} />
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
