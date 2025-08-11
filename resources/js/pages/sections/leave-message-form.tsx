"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Ensure this path is correct and the module exists
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
// import { Textarea } from "@/components/ui/textarea"; // Ensure this path is correct and the module exists

// Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Email must be valid.",
  })
    .optional(),
  message: z.string().min(10, {
    message: "Enter longer text.",
  }),
});

export function LeaveMessageForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // toast({
    //   title: "Message sent!",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    // Here you would typically make an API call
    console.log(values);
  }

  return (
    <div className="grid bg-amber-500 w-full">
      {/* Contact Form */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here..."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button variant={"outline"} className="w-full hover:bg-amber-200">
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
