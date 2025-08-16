"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthTransition } from "./auth-transition";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  role: z.enum(["student", "teacher", "admin"]),
}).refine((data) => {
  // For signup, name is required
  if (typeof window !== 'undefined' && window.location.pathname === '/signup') {
    return data.name && data.name.length >= 2
  }
  return true
}, {
  message: "Name is required for signup",
  path: ["name"]
});

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading?: boolean;
}

export function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <motion.form 
        onSubmit={(e) => {
           e.preventDefault();
          console.log('Form submit event triggered') // Debug log
          form.handleSubmit((values) => {
            console.log('Form validation passed, calling onSubmit with:', values) // Debug log
            return onSubmit(values)
          })(e)
        }} 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {type === "signup" && (
          <AuthTransition>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="h-10"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AuthTransition>
        )}

        <AuthTransition>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="h-10"
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AuthTransition>

        <AuthTransition>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="h-10"
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AuthTransition>

        <AuthTransition>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </motion.div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </AuthTransition>

        <AuthTransition>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isLoading}
            >
              {(form.formState.isSubmitting || isLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : type === "login" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </motion.div>
        </AuthTransition>
      </motion.form>
    </Form>
  );
}
