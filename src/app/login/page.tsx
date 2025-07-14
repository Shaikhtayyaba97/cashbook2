"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signInWithPhoneNumber, RecaptchaVerifier, onAuthStateChanged, type ConfirmationResult } from 'firebase/auth';
import type { User } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/dashboard');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      // The 'sign-in-button' is an invisible container for the reCAPTCHA
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone) {
      toast({ title: 'Error', description: 'Please enter a phone number.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const verifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: 'Success', description: 'OTP sent to your phone.' });
    } catch (error: any) {
      console.error("OTP Error:", error);
      toast({ title: 'Error Sending OTP', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: 'Error', description: 'Please enter the OTP.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await window.confirmationResult?.confirm(otp);
      // onAuthStateChanged will handle the redirect
      toast({ title: 'Success!', description: 'Logged in successfully.' });
    } catch (error: any) {
      console.error("Verification Error:", error);
      toast({ title: 'Login Failed', description: 'Invalid OTP or an error occurred.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div id="sign-in-button"></div>
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In / Sign Up</CardTitle>
          <CardDescription>
            Enter your phone number to receive a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!otpSent ? (
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 123 456 7890" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input id="otp" type="text" placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!otpSent ? (
            <Button className="w-full" onClick={handleSendOtp} disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          ) : (
            <Button className="w-full" onClick={handleVerifyOtp} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
