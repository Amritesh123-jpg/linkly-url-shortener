"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { isAuthenticated, isLoading,updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  console.log("isLoading:", isLoading);
  console.log("isAuthenticated:", isAuthenticated);
  
    useEffect(() => {
  if (isLoading || !isAuthenticated) return;

  const fetchProfile = async () => {
    console.log("Calling getProfile...");
    try {
      const user = await apiService.getProfile();

      setName(user.name);
      setEmail(user.email);
    } catch (err) {
      console.error(err);
    }
  };
  fetchProfile();
}, [isLoading, isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      setIsSaving(true);

      try {
        const updatedUser = await apiService.updateProfile(name);

        setName(updatedUser.name);
        updateUser(updatedUser);

        toast.success("Profile updated successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Email address cannot be changed.
          </p>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}