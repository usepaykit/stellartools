'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, X } from 'lucide-react';

export default function OnboardingProject() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const id = params?.id as string;

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // const logoSrc = resolvedTheme === 'dark' ? '/images/logo-light.png' : '/images/logo-dark.png';

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const [billingCycle, setBillingCycle] = useState<'one-time' | 'recurring'>('recurring');
    const [recurringInterval, setRecurringInterval] = useState('1');
    const [recurringPeriod, setRecurringPeriod] = useState('month');
    const [pricingModel, setPricingModel] = useState('fixed');
    const [price, setPrice] = useState('10.00');

    // Media preview state
    const [imagePreviews, setImagePreviews] = useState<{ url: string; file: File }[]>([]);

    const handleSetup = () => {
        if (!projectName.trim()) {
            alert('Please enter a project name.');
            return;
        }
        console.log('Project setup:', {
            name: projectName,
            description: projectDescription,
            billingCycle,
            recurringInterval,
            recurringPeriod,
            pricingModel,
            price
        });
        // Navigate to next step or dashboard
        // router.push(`/dashboard/${id}/...`);
    };

    const handleSkip = () => {
        // Navigate to dashboard or next step
        router.push(`/dashboard/${id}`);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newPreviews: { url: string; file: File }[] = [];

            Array.from(files).forEach((file) => {
                // Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds 10MB limit.`);
                    return;
                }

                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                newPreviews.push({ url: previewUrl, file });
            });

            setImagePreviews((prev) => [...prev, ...newPreviews]);
            console.log('Files selected:', files);
        }
    };

    const removeImage = (index: number) => {
        setImagePreviews((prev) => {
            // Revoke the object URL to free memory
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[600px] flex flex-col items-center">

                {mounted && (
                    <div className="mb-8">
                        <Image
                            src="/images/logo-light.png"
                            alt="Stellar Tools logo"
                            width={50}
                            height={50}
                            className="object-contain rounded-md"
                        />
                    </div>
                )}

                <h1 className="text-3xl font-normal tracking-tight mb-2 text-foreground text-center">
                    Your first project
                </h1>

                <p className="text-muted-foreground text-base mb-8 text-center">
                    Setup your first digital project to get started.
                </p>

                <div className="w-full space-y-6">
                    <Card>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-normal text-foreground">
                                    Project Information
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Basic project information which helps identify the project
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectName">
                                    Name
                                </Label>
                                <Input
                                    id="projectName"
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Enter project name"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="projectDescription">
                                        Description
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        Markdown format
                                    </span>
                                </div>
                                <Textarea
                                    id="projectDescription"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="Enter project description"
                                    className="min-h-[120px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media Section */}
                    <Card>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-normal text-foreground">
                                    Media
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Enhance the project page with medias, giving the customers a better idea of the project
                                </p>
                            </div>

                            <div className="space-y-4">
                                {imagePreviews.length > 0 ? (
                                    /* Image Previews - Replaces upload area */
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-video rounded-lg overflow-hidden border border-input bg-muted"
                                            >
                                                <Image
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background border border-input opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Remove image"
                                                >
                                                    <X className="w-4 h-4 text-foreground" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Upload Area - Only shown when no images */
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="mediaUpload"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="border-2 border-dashed border-input rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors">
                                            <ImagePlus className="w-12 h-12 text-muted-foreground mb-4" />
                                            <p className="text-sm font-medium text-foreground mb-1">
                                                Add project media
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Up to 10MB each. 16:9 ratio recommended for optimal display.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

      
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            onClick={handleSetup}
                            className="flex-1"
                            size="lg"
                        >
                            Setup →
                        </Button>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Link
                            href={`/dashboard/${id}/configure`}
                            className="hover:text-foreground transition-colors"
                        >
                            Configure manually
                        </Link>
                        <span className="text-foreground">·</span>
                        <button
                            onClick={handleSkip}
                            className="hover:text-foreground transition-colors cursor-pointer"
                        >
                            Skip onboarding
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}