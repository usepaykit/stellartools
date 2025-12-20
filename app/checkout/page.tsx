'use client';

import { BeautifulQRCode } from '@beautiful-qr-code/react';
import { TextField } from '@/components/input-picker';
import { PhoneNumberPicker, type PhoneNumber } from '@/components/phone-number-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState<PhoneNumber>({
        number: '',
        countryCode: 'US',
    });

    // SEP-0007 payment URL format
    const qrCodeData = `web+stellar:pay?destination=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&amount=200&memo=Monthly%20Subscription&memo_type=text`;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Unlimited Monthly Subscription
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Unlimited Monthly offers a flexible subscription that unlocks premium features 
                                like unlimited transactions, priority support, and advanced analytics. 
                                Billed monthly and can be canceled anytime.
                            </p>
                        </div>

                        <div className="p-6 bg-muted/50 rounded-lg border border-border">
                            <p className="text-4xl font-semibold text-foreground">
                                200 XLM / mo
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Payment Form */}
                    <Card className="shadow-none">
                        <CardContent className="pt-6 pb-6 space-y-6">
                            <form className="space-y-6">
                                {/* Email */}
                                <TextField
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    label="Email"
                                    error={null}
                                    className="w-full shadow-none"
                                    placeholder="you@example.com"
                                />

                                {/* Phone Number */}
                                <PhoneNumberPicker
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    label="Phone number"
                                    error={null}
                                    groupClassName="w-full shadow-none"
                                />

                                {/* Payment Methods */}
                                <div className="space-y-6">
                                    {/* QR Code Payment */}
                                    <Card className="shadow-none border-2 border-dashed border-border bg-muted/30">
                                        <CardContent className="p-0 flex flex-col items-center justify-center space-y-4 shadow-none">
                                            <div className="bg-white rounded-lg flex items-center justify-center border border-border shadow-sm p-4">
                                                <BeautifulQRCode
                                                    data={qrCodeData}
                                                    foregroundColor="#000000"
                                                    backgroundColor="#ffffff"
                                                    radius={1}
                                                    padding={1}
                                                    className=' size-50'
                                                />
                                            </div>
                                           
                                        </CardContent>
                                    </Card>

                                    {/* OR Separator */}
                                    <div className="flex items-center gap-4">
                                        <Separator className="flex-1" />
                                        <span className="text-sm text-muted-foreground font-medium">OR</span>
                                        <Separator className="flex-1" />
                                    </div>

                                    {/* Wallet Payment */}
                                    <Button
                                        type="button"
                                        variant="default"
                                        className="w-full h-12 shadow-none"
                                        size="lg"
                                    >
                                        Continue with Wallet 
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                                    This order is processed by our payment provider, who also handles 
                                    order-related inquiries and returns.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>

        
                <footer className="mt-12 pt-8 border-t border-border">
                    <div className="space-y-6">
                     


                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>© {new Date().getFullYear()} Stellar Tools. All rights reserved.</span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
                            <Link
                                href="/terms"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/refund"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Refund Policy
                            </Link>
                            <Link
                                href="/support"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Support
                            </Link>
                        </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Powered by</span>
                                <Image
                                    src="/images/integrations/stellar-official.png"
                                    alt="Stellar"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                                <span className="text-xs font-medium text-foreground">Stellar</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

