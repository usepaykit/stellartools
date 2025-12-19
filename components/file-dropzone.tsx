'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { MixinProps, splitProps } from '@/lib/mixin';
import { cn } from '@/lib/utils';
import { ImagePlus, X, File } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
type LabelProps = React.ComponentProps<typeof Label>;
type ErrorProps = React.ComponentProps<'p'>;
type ContainerProps = React.ComponentProps<'div'>;
type IconProps = React.ComponentProps<typeof ImagePlus>;
type TextProps = React.ComponentProps<'p'>;
type ButtonProps = React.ComponentProps<'button'>;
type ImageProps = React.ComponentProps<typeof Image>;
type InputProps = React.ComponentProps<'input'>;

export interface FileDropzoneFile {
    file: File;
    preview?: string;
    id?: string;
}

interface FileDropzoneProps
    extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange' | 'value'>,
        MixinProps<'label', Omit<LabelProps, 'children'>>,
        MixinProps<'error', Omit<ErrorProps, 'children'>>,
        MixinProps<'root', Omit<ContainerProps, 'children'>>,
        MixinProps<'container', Omit<ContainerProps, 'children'>>,
        MixinProps<'previewGrid', Omit<ContainerProps, 'children'>>,
        MixinProps<'previewItem', Omit<ContainerProps, 'children'>>,
        MixinProps<'previewImageContainer', Omit<ContainerProps, 'children'>>,
        MixinProps<'previewImage', Omit<ImageProps, 'src' | 'alt' | 'fill'>>,
        MixinProps<'previewPlaceholder', Omit<ContainerProps, 'children'>>,
        MixinProps<'previewPlaceholderIcon', Omit<IconProps, 'children'>>,
        MixinProps<'removeButton', Omit<ButtonProps, 'onClick' | 'type' | 'aria-label'>>,
        MixinProps<'removeButtonIcon', Omit<IconProps, 'children'>>,
        MixinProps<'inputWrapper', Omit<ContainerProps, 'children'>>,
        MixinProps<'input', Omit<InputProps, 'type' | 'id' | 'accept' | 'multiple' | 'onChange' | 'disabled'>>,
        MixinProps<'dropzone', Omit<ContainerProps, 'children' | 'onClick' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'>>,
        MixinProps<'icon', Omit<IconProps, 'children'>>,
        MixinProps<'title', Omit<TextProps, 'children'>>,
        MixinProps<'description', Omit<TextProps, 'children'>> {
    id: string;
    value?: FileDropzoneFile[];
    onChange?: (files: FileDropzoneFile[]) => void;
    onFilesChange?: (files: File[]) => void;
    label?: LabelProps['children'] | null;
    error?: ErrorProps['children'] | null;
    title?: string;
    description?: string;
    maxSize?: number;
    maxFiles?: number;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    showPreview?: boolean;
    previewGridCols?: 2 | 3 | 4;
    onRemove?: (index: number, file: FileDropzoneFile) => void;
    icon?: React.ReactNode;
    dragActiveClassName?: string;
    className?: string;
}

export const FileDropzone = React.forwardRef<HTMLInputElement, FileDropzoneProps>(
    (
        {
            id,
            value = [],
            onChange,
            onFilesChange,
            label,
            error,
            title = 'Add files',
            description,
            maxSize = 10 * 1024 * 1024,
            maxFiles,
            accept = 'image/*',
            multiple = false,
            disabled = false,
            showPreview = true,
            previewGridCols = 3,
            onRemove,
            icon,
            dragActiveClassName,
            className,
            ...mixProps
        },
        ref
    ) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [isDragging, setIsDragging] = useState(false);
        const dragCounterRef = useRef(0);

        const {
            label: labelProps,
            error: errorProps,
            root: rootProps,
            container: containerProps,
            previewGrid: previewGridProps,
            previewItem: previewItemProps,
            previewImageContainer: previewImageContainerProps,
            previewImage: previewImageProps,
            previewPlaceholder: previewPlaceholderProps,
            previewPlaceholderIcon: previewPlaceholderIconProps,
            removeButton: removeButtonProps,
            removeButtonIcon: removeButtonIconProps,
            inputWrapper: inputWrapperProps,
            input: inputProps,
            dropzone: dropzoneProps,
            icon: iconProps,
            title: titleProps,
            description: descriptionProps,
            rest,
        } = splitProps(
            mixProps,
            'label',
            'error',
            'root',
            'container',
            'previewGrid',
            'previewItem',
            'previewImageContainer',
            'previewImage',
            'previewPlaceholder',
            'previewPlaceholderIcon',
            'removeButton',
            'removeButtonIcon',
            'inputWrapper',
            'input',
            'dropzone',
            'icon',
            'title',
            'description'
        );

        const isImageFile = useCallback((file: File): boolean => {
            if (file.type.startsWith('image/')) {
                return true;
            }
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
            const fileName = file.name.toLowerCase();
            return imageExtensions.some(ext => fileName.endsWith(ext));
        }, []);

        const createFilePreview = useCallback((file: File): FileDropzoneFile => {
            const fileWithPreview: FileDropzoneFile = {
                file,
                id: `${file.name}-${file.size}-${Date.now()}`,
            };

            if (isImageFile(file)) {
                try {
                    fileWithPreview.preview = URL.createObjectURL(file);
                } catch (error) {
                    console.error('Failed to create preview URL:', error);
                }
            }

            return fileWithPreview;
        }, [isImageFile]);

        const validateFiles = useCallback(
            (files: File[]): { valid: File[]; errors: string[] } => {
                const valid: File[] = [];
                const errors: string[] = [];

                files.forEach((file) => {
                    if (maxSize && file.size > maxSize) {
                        errors.push(`${file.name} exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`);
                        return;
                    }

                    if (maxFiles && value.length + valid.length >= maxFiles) {
                        errors.push(`Maximum ${maxFiles} file(s) allowed`);
                        return;
                    }

                    valid.push(file);
                });

                return { valid, errors };
            },
            [maxSize, maxFiles, value.length]
        );

        const handleFiles = useCallback(
            (files: File[]) => {
                if (files.length === 0) return;

                const { valid, errors } = validateFiles(Array.from(files));

                if (errors.length > 0 && errorProps?.onClick) {
                    errorProps.onClick({} as React.MouseEvent<HTMLParagraphElement>);
                }

                if (valid.length === 0) return;

                const newFiles = valid.map(createFilePreview);
                const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;

                onChange?.(updatedFiles);
                onFilesChange?.(valid);
            },
            [validateFiles, createFilePreview, multiple, value, onChange, onFilesChange, errorProps]
        );

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                    handleFiles(Array.from(files));
                }
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            [handleFiles]
        );

        const handleDragEnter = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounterRef.current += 1;
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true);
            }
        }, []);

        const handleDragLeave = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounterRef.current -= 1;
            if (dragCounterRef.current === 0) {
                setIsDragging(false);
            }
        }, []);

        const handleDragOver = useCallback((e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        }, []);

        const handleDrop = useCallback(
            (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                dragCounterRef.current = 0;

                if (disabled) return;

                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                    handleFiles(files);
                }
            },
            [disabled, handleFiles]
        );

        const handleRemove = useCallback(
            (index: number) => {
                const fileToRemove = value[index];
                if (fileToRemove?.preview) {
                    URL.revokeObjectURL(fileToRemove.preview);
                }

                const updatedFiles = value.filter((_, i) => i !== index);
                onChange?.(updatedFiles);
                onRemove?.(index, fileToRemove);
            },
            [value, onChange, onRemove]
        );

        const handleClick = useCallback(() => {
            if (!disabled && fileInputRef.current) {
                fileInputRef.current.click();
            }
        }, [disabled]);

        React.useEffect(() => {
            return () => {
                value.forEach((file) => {
                    if (file.preview) {
                        URL.revokeObjectURL(file.preview);
                    }
                });
            };
        }, [value]);

        const defaultDescription = description || `Up to ${(maxSize / 1024 / 1024).toFixed(0)}MB each.`;

        const gridColsClass = {
            2: 'grid-cols-2',
            3: 'grid-cols-2 sm:grid-cols-3',
            4: 'grid-cols-2 sm:grid-cols-4',
        }[previewGridCols];

        return (
            <div {...rootProps} className={cn('space-y-2', className, rootProps?.className)}>
                {label && (
                    <Label {...labelProps} htmlFor={id}>
                        {label}
                    </Label>
                )}

                <div
                    {...containerProps}
                    className={cn('space-y-4', containerProps?.className)}
                >
                    {showPreview && value.length > 0 ? (
                        <div
                            {...previewGridProps}
                            className={cn('grid gap-4', gridColsClass, previewGridProps?.className)}
                        >
                            {value.map((fileWithPreview, index) => (
                                <div
                                    key={fileWithPreview.id || index}
                                    {...previewItemProps}
                                    className={cn(
                                        'relative group aspect-video rounded-lg overflow-hidden border border-input bg-muted',
                                        previewItemProps?.className
                                    )}
                                >
                                    {fileWithPreview.preview ? (
                                        <div
                                            {...previewImageContainerProps}
                                            className={cn(
                                                'relative w-full h-full',
                                                previewImageContainerProps?.className
                                            )}
                                        >
                                            <Image
                                                src={fileWithPreview.preview}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                unoptimized
                                                {...previewImageProps}
                                                className={cn('object-cover transition-transform duration-300 group-hover:scale-110', previewImageProps?.className)}
                                                onError={(e) => {
                                                    console.error('Failed to load image preview');
                                                    const target = e.target as HTMLImageElement;
                                                    if (target.parentElement) {
                                                        target.style.display = 'none';
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div
                                            {...previewPlaceholderProps}
                                            className={cn(
                                                'w-full h-full flex flex-col items-center justify-center gap-2 bg-linear-to-br from-muted to-muted/50 p-4',
                                                previewPlaceholderProps?.className
                                            )}
                                        >
                                            <File
                                                {...previewPlaceholderIconProps}
                                                className={cn(
                                                    'w-10 h-10 text-muted-foreground',
                                                    previewPlaceholderIconProps?.className
                                                )}
                                            />
                                            <span className="text-xs text-muted-foreground text-center line-clamp-2 px-2">
                                                {fileWithPreview.file.name}
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                         variant={'ghost'}
                                        onClick={() => handleRemove(index)}
                                        aria-label="Remove file"
                                        disabled={disabled}
                                        {...removeButtonProps}
                                        className={cn(
                                            'absolute top-2 right-2 p-1.3 rounded-full bg-background/80 hover:bg-background border border-input opacity-0 group-hover:opacity-100 transition-opacity z-10',
                                            removeButtonProps?.className
                                        )}
                                    >
                                        <X
                                            {...removeButtonIconProps}
                                            className={cn('w-4 h-4 text-foreground', removeButtonIconProps?.className)}
                                        />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div
                        {...inputWrapperProps}
                        className={cn('relative', inputWrapperProps?.className)}
                    >
                        <input
                            ref={fileInputRef || ref}
                            id={id}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            onChange={handleInputChange}
                            disabled={disabled}
                            {...inputProps}
                            {...rest}
                            className={cn(
                                'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed',
                                inputProps?.className
                            )}
                        />
                        <div
                            onClick={handleClick}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            {...dropzoneProps}
                            className={cn(
                                'border-2 border-dashed border-input rounded-lg p-12 flex flex-col items-center justify-center text-center transition-colors',
                                isDragging
                                    ? dragActiveClassName || 'bg-accent border-primary'
                                    : 'hover:bg-accent/50',
                                disabled && 'opacity-50 cursor-not-allowed',
                                !disabled && 'cursor-pointer',
                                dropzoneProps?.className
                            )}
                        >
                            {icon || (
                                <ImagePlus
                                    {...iconProps}
                                    className={cn('w-12 h-12 text-muted-foreground mb-4', iconProps?.className)}
                                />
                            )}
                            <p
                                {...titleProps}
                                className={cn('text-sm font-medium text-foreground mb-1', titleProps?.className)}
                            >
                                {title}
                            </p>
                            {description && (
                                <p
                                    {...descriptionProps}
                                    className={cn('text-xs text-muted-foreground', descriptionProps?.className)}
                                >
                                    {defaultDescription}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <p
                        {...errorProps}
                        className={cn('text-sm text-destructive', errorProps?.className)}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FileDropzone.displayName = 'FileDropzone';