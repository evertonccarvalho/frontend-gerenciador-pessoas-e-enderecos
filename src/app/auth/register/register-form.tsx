"use client";

import type * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { FormSuccess } from "../_components/form-success";
import { FormError } from "../_components/form-error";
import { RegisterSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import authService from "@/services/authService";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await authService.register(values);
      if (response.status === 201) {
        setSuccess("Conta criada com sucesso!");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Erro ao tentar criar conta");
    }
    console.log(values);
    setIsSubmitting(false);

  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  Criar Conta
                </span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
