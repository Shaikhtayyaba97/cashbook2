"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useToast } from '@/hooks/use-toast';
import Link from "next/link";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Email and password are required.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
          title: 'Success!',
          description: 'Account created successfully. Please log in.',
      });
      router.push('/login');
    } catch (error: any) {
        console.error("Signup error", error.code, error.message);
        let description = 'An unknown error occurred. Please try again.';
        switch(error.code) {
            case 'auth/email-already-in-use':
                description = 'This email address is already in use.';
                break;
            case 'auth/invalid-email':
                description = 'The email address is not valid.';
                break;
            case 'auth/weak-password':
                description = 'The password is too weak. It must be at least 6 characters long.';
                break;
            case 'auth/network-request-failed':
                description = 'Network error. Please check your connection.';
                break;
             case 'auth/operation-not-allowed':
                description = 'Email/Password sign-up is not enabled. Please contact support.';
                break;
            default:
                description = 'An error occurred during sign up. Please try again.';
        }
        toast({
            title: 'Sign Up Failed',
            description: description,
            variant: 'destructive'
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
       <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create a new account to start managing your cash flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="me@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup} disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
           <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
