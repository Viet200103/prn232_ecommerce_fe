'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
  email: z.email({ message: "Địa chỉ email không hợp lệ" }).trim(),
  password: z.string()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setFormError(null);
    login(data.email, data.password)
      .then((result) => {
        if (result.token) {
          localStorage.setItem('accessToken', result.token);
        }
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        setFormError('Email hoặc mật khẩu không đúng.')
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900">Đăng nhập</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập email và mật khẩu để truy cập tài khoản của bạn.
          </CardDescription>
          {formError && (
            <p className="text-sm text-red-500 text-center mt-2">{formError}</p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email của bạn"
                        type="email"
                        {...field}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mật khẩu của bạn"
                        type="password"
                        {...field}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Đăng nhập
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}