'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { register } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }).trim(),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự, có chữ hoa, ký tự đặc biệt và chữ số' })
      .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ hoa' })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt' })
      .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một chữ số' })
      .trim(),
    confirmPassword: z.string().min(6, { message: 'Vui lòng xác nhận mật khẩu' }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null)
    setLoading(true)

    try {
      await register(data.email, data.password)
      router.push('/login')
    } catch (err: any) {
      setFormError(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900">Đăng ký</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập thông tin của bạn để tạo tài khoản mới.
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập lại mật khẩu của bạn"
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
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}