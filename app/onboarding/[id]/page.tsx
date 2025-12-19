'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TextField, TextAreaField } from '@/components/input-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from '@/components/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileDropzone, type FileDropzoneFile } from '@/components/file-dropzone';
import { toast } from '@/components/ui/toast';
import { Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const productSchema = z.object({
    name: z
        .string()
        .min(1, 'Product name is required')
        .min(2, 'Product name must be at least 2 characters')
        .max(100, 'Product name must be less than 100 characters')
        .trim(),
    description: z
        .string()
        .max(2000, 'Description must be less than 2000 characters')
        .optional()
        .or(z.literal('')),
    billingCycle: z.enum(['one-time', 'recurring']),
    recurringInterval: z
        .string()
        .regex(/^\d+$/, 'Interval must be a number')
        .refine((val) => parseInt(val) >= 1, 'Interval must be at least 1')
        .optional(),
    recurringPeriod: z.enum(['day', 'week', 'month', 'year']).optional(),
    pricingModel: z.enum(['fixed', 'tiered', 'usage']),
    prices: z
        .array(
            z
                .string()
                .min(1, 'Price is required')
                .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g., 10.00 or 10)')
                .refine((val) => parseFloat(val) > 0, 'Price must be greater than 0')
        )
        .min(1, 'At least one price is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function OnboardingProject() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<FileDropzoneFile[]>([]);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            billingCycle: 'recurring',
            recurringInterval: '1',
            recurringPeriod: 'month',
            pricingModel: 'fixed',
            prices: ['10.00'],
        },
        mode: 'onBlur',
    });

    const { setValue, control, formState: { errors } } = form;
    const billingCycle = useWatch({ control, name: 'billingCycle' });
    const name = useWatch({ control, name: 'name' });
    const description = useWatch({ control, name: 'description' });
    const recurringInterval = useWatch({ control, name: 'recurringInterval' });
    const recurringPeriod = useWatch({ control, name: 'recurringPeriod' });
    const pricingModel = useWatch({ control, name: 'pricingModel' });
    const prices = useWatch({ control, name: 'prices' }) || ['10.00'];

    const handleFilesChange = (files: FileDropzoneFile[]) => {
        setImagePreviews(files);
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);

        try {
            const formData = {
                ...data,
                images: imagePreviews.map((fileWithPreview) => fileWithPreview.file),
            };

            console.log('Product setup:', formData);

            toast.success('Product created successfully!', {
                description: 'Redirecting to your dashboard...',
            } as Parameters<typeof toast.success>[1]);

            router.push(`/dashboard/${id}`);
        } catch (error) {
            console.error('Failed to create product:', error);
            toast.error('Failed to create product', {
                description: 'Please try again later',
            } as Parameters<typeof toast.error>[1]);
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        router.push(`/dashboard/${id}`);
    };

    const addPrice = () => {
        const currentPrices = prices || [];
        setValue('prices', [...currentPrices, ''], { shouldValidate: false });
    };

    const removePrice = (index: number) => {
        const currentPrices = prices || [];
        if (currentPrices.length > 1) {
            const updatedPrices = currentPrices.filter((_, i) => i !== index);
            setValue('prices', updatedPrices, { shouldValidate: true });
        }
    };

    const updatePrice = (index: number, value: string) => {
        const currentPrices = prices || [];
        const updatedPrices = [...currentPrices];
        updatedPrices[index] = value;
        setValue('prices', updatedPrices, { shouldValidate: true });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[600px] flex flex-col items-center">
                    <div className="mb-8">
                        <Image
                            src="/images/logo-light.png"
                            alt="Stellar Tools logo"
                            width={50}
                            height={50}
                            className="object-contain rounded-md"
                        priority
                        />
                    </div>

                <h1 className="text-3xl font-normal tracking-tight mb-2 text-foreground text-center">
                    Your first product
                </h1>

                <p className="text-muted-foreground text-base mb-8 text-center">
                    Setup your first digital product to get started.
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6" noValidate>
                    <Card className='border-none shadow-none'>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-normal text-foreground">
                                    Product Information
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Basic product information which helps identify the product
                                </p>
                            </div>

                            <TextField
                                    id="productName"
                                label="Name"
                                value={name || ''}
                                onChange={(value) => setValue('name', value, { shouldValidate: true })}
                                    placeholder="Enter product name"
                                error={errors.name?.message || null}
                                labelClassName="text-sm font-medium"
                                className="shadow-none"
                                />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                
                        
                                </div>
                                <TextAreaField
                                    id="productDescription"
                                    label={'Description'}
                                    value={description || ''}
                                    onChange={(value) => setValue('description', value, { shouldValidate: true })}
                                    placeholder="Enter product description"
                                    error={errors.description?.message || null}
                                    className="min-h-[120px] shadow-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='shadow-none'>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-normal text-foreground">
                                    Media
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Enhance the product page with medias, giving the customers a better idea of the product
                                </p>
                            </div>

                            <FileDropzone
                                            id="mediaUpload"
                                value={imagePreviews}
                                onChange={handleFilesChange}
                                label={null}
                                title="Add product media"
                                description="Up to 10MB each. 16:9 ratio recommended for optimal display."
                                maxSize={MAX_FILE_SIZE}
                                            multiple
                                accept="image/*,application/pdf,.doc,.docx,.txt"
                                showPreview
                                previewGridCols={3}
                                dropzoneClassName="shadow-none"
                            />
                        </CardContent>
                    </Card>

                    <Card className='shadow-none'>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-normal text-foreground">
                                    Pricing
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Set your billing cycle and pricing model
                                </p>
                            </div>

                            <RadioGroup
                                value={billingCycle}
                                onValueChange={(value) => setValue('billingCycle', value as 'one-time' | 'recurring', { shouldValidate: true })}
                                className="space-y-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one-time" id="one-time" />
                                    <Label htmlFor="one-time" className="font-normal cursor-pointer text-foreground">
                                        One-time purchase
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="recurring" id="recurring" />
                                    <Label htmlFor="recurring" className="font-normal cursor-pointer text-foreground">
                                        Recurring subscription
                                    </Label>
                                </div>
                            </RadioGroup>

                            {billingCycle === 'recurring' && (
                                <div className="flex items-center gap-2 pl-6">
                                    <span className="text-sm text-foreground">Every</span>
                                    <TextField
                                        id="recurringInterval"
                                        label={null}
                                        value={recurringInterval || '1'}
                                        onChange={(value) => setValue('recurringInterval', value, { shouldValidate: true })}
                                        type="number"
                                        className="w-20 shadow-none"
                                        min="1"
                                        error={errors.recurringInterval?.message || null}
                                    />
                                    <Select
                                        value={recurringPeriod || 'month'}
                                        onValueChange={(value) => setValue('recurringPeriod', value as 'day' | 'week' | 'month' | 'year', { shouldValidate: true })}
                                    >
                                        <SelectTrigger className="w-full shadow-none">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">day</SelectItem>
                                            <SelectItem value="week">week</SelectItem>
                                            <SelectItem value="month">month</SelectItem>
                                            <SelectItem value="year">year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="pricingModel" className="text-sm font-medium text-foreground block">
                                    Pricing Model
                                </label>
                                <Select
                                    value={pricingModel || 'fixed'}
                                    onValueChange={(value) => setValue('pricingModel', value as 'fixed' | 'tiered' | 'usage', { shouldValidate: true })}
                                >
                                    <SelectTrigger 
                                        className={cn(
                                            "w-full shadow-none",
                                            errors.pricingModel && "border-destructive"
                                        )}
                                        aria-invalid={errors.pricingModel ? 'true' : 'false'}
                                    >
                                        <SelectValue placeholder="Select pricing model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed price</SelectItem>
                                        <SelectItem value="tiered">Tiered pricing</SelectItem>
                                        <SelectItem value="usage">Usage-based</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.pricingModel && (
                                    <p className="text-sm text-destructive" role="alert">
                                        {errors.pricingModel.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-foreground block">
                                    Price{prices.length > 1 ? 's' : ''}
                                </label>
                                {prices.map((price, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <InputGroup
                                                className={cn(
                                                    'shadow-none flex-1',
                                                    errors.prices?.[index] && 'border-destructive'
                                                )}
                                            >
                                                <InputGroupAddon align="inline-start">
                                                    <InputGroupText>$</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    id={`price-${index}`}
                                        type="text"
                                                    value={price || ''}
                                                    onChange={(e) => updatePrice(index, e.target.value)}
                                        placeholder="0.00"
                                                    aria-invalid={errors.prices?.[index] ? 'true' : 'false'}
                                                    aria-describedby={errors.prices?.[index] ? `price-${index}-error` : undefined}
                                                />
                                            </InputGroup>
                                            {prices.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removePrice(index)}
                                                    className="shrink-0"
                                                    aria-label="Remove price"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {errors.prices?.[index] && (
                                            <p
                                                id={`price-${index}-error`}
                                                className="text-sm text-destructive"
                                                role="alert"
                                            >
                                                {errors.prices[index]?.message}
                                            </p>
                                        )}
                                </div>
                                ))}
                                {errors.prices && typeof errors.prices.message === 'string' && (
                                    <p className="text-sm text-destructive" role="alert">
                                        {errors.prices.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full shadow-none"
                                onClick={addPrice}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Additional Price
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                'Setup →'
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Link
                            href={`/dashboard/${id}/configure`}
                            className="hover:text-foreground transition-colors"
                        >
                            Configure manually
                        </Link>
                        <span className="text-foreground">·</span>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="hover:text-foreground transition-colors cursor-pointer"
                        >
                            Skip onboarding
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
