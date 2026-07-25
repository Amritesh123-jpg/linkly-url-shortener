"use client";

import { useState } from "react";
import { apiService } from "@/services/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      await apiService.updatePassword(
        currentPassword,
        newPassword,
        passwordConfirm
      );

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Change your account password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}