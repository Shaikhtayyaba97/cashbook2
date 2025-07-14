"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/logo";
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// We'll append a dummy domain to the phone number to use Firebase's Email/Password auth
const DUMMY_DOMAIN = "ledgerlite.phone";

const formatPhoneNumberAsEmail = (phone: string) => `${phone.replace(/\s+/g, '')}@${DUMMY_DOMAIN}`;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (action: 'signIn' | 'signUp') => {
    if (!phone || !password) {
      toast({ title: 'Error', description: 'Please enter both phone number and password.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    
    const email = formatPhoneNumberAsEmail(phone);

    try {
      if (action === 'signUp') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success!', description: 'Your account has been created. Please sign in.' });
        // Clear fields and switch to sign-in tab after successful sign-up
        setPhone('');
        setPassword('');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success!', description: 'Logged in successfully.' });
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error(`${action} Error:`, error);
      let description = 'An unknown error occurred. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          description = 'This phone number is already registered. Please sign in.';
          break;
        case 'auth/invalid-email':
          description = 'The phone number format is invalid.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          description = 'Invalid phone number or password.';
          break;
        case 'auth/weak-password':
          description = 'Password should be at least 6 characters long.';
          break;
        default:
          description = error.message;
      }
      toast({ title: `Error ${action === 'signIn' ? 'Signing In' : 'Signing Up'}`, description, variant: 'destructive' });
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
        <Tabs defaultValue="sign-in" className="w-full">
          <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
          </CardHeader>
          <TabsContent value="sign-in">
              <CardHeader className="pt-0">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>Enter your phone and password to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="phone-in">Phone Number</Label>
                      <Input id="phone-in" type="tel" placeholder="+1 123 456 7890" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="password-in">Password</Label>
                      <Input id="password-in" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full" onClick={() => handleAuthAction('signIn')} disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
              </CardFooter>
          </TabsContent>
          <TabsContent value="sign-up">
              <CardHeader className="pt-0">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>Choose a password for your new account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="phone-up">Phone Number</Label>
                      <Input id="phone-up" type="tel" placeholder="+1 123 456 7890" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="password-up">Password</Label>
                      <Input id="password-up" type="password" placeholder="Must be at least 6 characters" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full" onClick={() => handleAuthAction('signUp')} disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
              </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}