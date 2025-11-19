"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

// Define the form schema for editing profile
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

export default function ProfilePage() {
  // Placeholder user data (could come from context/API later)
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatarUrl: "https://github.com/shadcn.png", // Example avatar
  });

  const [isEditing, setIsEditing] = useState(false);

  // Define the edit profile form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  // Watch form values to update user state optimistically or on successful save
  // For simplicity, we'll update on successful save in this example

  // Define a submit handler for profile edit
  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log("Updating profile:", values);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      setUser((prevUser) => ({ ...prevUser, name: values.name, email: values.email }));
      toast.success("Profile updated successfully!");
      setIsEditing(false); // Close the dialog/form on success
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  }

  // Mock logout function
  const handleLogout = () => {
    console.log("Logging out...");
    // In a real app, clear auth tokens, redirect to login
    toast.info("You have been logged out.");
    // Simulate redirect or state change
    // router.push('/login'); // If using Next.js router
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Edit Profile Dialog */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
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
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full" onClick={() => toast.info("Settings page not implemented yet.")}>Settings</Button>

          {/* Logout Confirmation Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">Log Out</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log Out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                 </DialogClose>
                 <DialogClose asChild>
                    <Button type="button" variant="destructive" onClick={handleLogout}>Log Out</Button>
                 </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
