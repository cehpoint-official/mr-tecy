/**
 * Cloudinary Upload Service
 * Handles image uploads to Cloudinary
 */

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
}

export const cloudinaryUploadService = {
    /**
     * Uploads an image to Cloudinary
     * @param file The file to upload
     * @param folder The folder path (default: 'services')
     * @returns Promise resolving to the Cloudinary upload result
     */
    async uploadImage(
        file: File,
        folder: string = "services"
    ): Promise<CloudinaryUploadResult> {
        try {
            console.log(`[CloudinaryUpload] Starting upload: ${file.name} (${file.type}, ${file.size} bytes)`);

            // Validate file type
            if (!file.type.startsWith("image/")) {
                throw new Error("Invalid file type. Please upload an image.");
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File size too large. Max 5MB allowed.");
            }

            // Create FormData for upload
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
            formData.append("folder", folder);

            // Upload to Cloudinary
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) {
                throw new Error("Cloudinary cloud name not configured");
            }

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await response.json();
            console.log(`[CloudinaryUpload] Upload successful:`, data.secure_url);

            return {
                url: data.secure_url,
                publicId: data.public_id,
                width: data.width,
                height: data.height,
                format: data.format,
            };
        } catch (error) {
            console.error("[CloudinaryUpload] Error uploading image:", error);
            throw error;
        }
    },

    /**
     * Uploads multiple images for a booking to Cloudinary
     * @param files Array of files to upload
     * @param bookingId The booking ID for folder organization
     * @param onProgress Optional callback for upload progress
     * @returns Promise resolving to array of Cloudinary upload results
     */
    async uploadBookingImages(
        files: File[],
        bookingId: string,
        onProgress?: (progress: number) => void
    ): Promise<CloudinaryUploadResult[]> {
        try {
            console.log(`[CloudinaryUpload] Starting upload of ${files.length} images for booking ${bookingId}`);

            // Validate all files first
            for (const file of files) {
                if (!file.type.startsWith("image/")) {
                    throw new Error(`Invalid file type: ${file.name}. Please upload images only.`);
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`File ${file.name} is too large. Max 5MB allowed.`);
                }
            }

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary configuration missing");
            }

            const uploadPromises = files.map(async (file, index) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);
                formData.append("folder", `bookings/${bookingId}/images`);

                console.log(`[CloudinaryUpload] Uploading ${index + 1}/${files.length}: ${file.name}`);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Failed to upload ${file.name}`);
                }

                const data = await response.json();
                console.log(`[CloudinaryUpload] Uploaded ${index + 1}/${files.length}: ${data.secure_url}`);

                // Report progress if callback provided
                if (onProgress) {
                    const progress = ((index + 1) / files.length) * 100;
                    onProgress(progress);
                }

                return {
                    url: data.secure_url,
                    publicId: data.public_id,
                    width: data.width,
                    height: data.height,
                    format: data.format,
                };
            });

            const results = await Promise.all(uploadPromises);
            console.log(`[CloudinaryUpload] Successfully uploaded ${results.length} images`);

            return results;
        } catch (error) {
            console.error("[CloudinaryUpload] Error uploading booking images:", error);
            throw error;
        }
    },

    /**
     * Gets an optimized URL for a Cloudinary image
     * @param publicId The Cloudinary public ID
     * @param transformations Optional transformation parameters
     * @returns Optimized image URL
     */
    getOptimizedUrl(
        publicId: string,
        transformations?: {
            width?: number;
            height?: number;
            quality?: number;
            format?: string;
        }
    ): string {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error("Cloudinary cloud name not configured");
        }

        const params: string[] = [];

        if (transformations) {
            if (transformations.width) params.push(`w_${transformations.width}`);
            if (transformations.height) params.push(`h_${transformations.height}`);
            if (transformations.quality) params.push(`q_${transformations.quality}`);
            if (transformations.format) params.push(`f_${transformations.format}`);
        }

        const transformStr = params.length > 0 ? `${params.join(",")}` : "f_auto,q_auto";

        return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${publicId}`;
    },
};
