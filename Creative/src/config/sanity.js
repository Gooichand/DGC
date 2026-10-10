import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
    projectId: 'placeholder', // Sanity CMS is disabled; set your own project ID to enable it.
    dataset: 'production',
    useCdn: true, // `false` for dev, `true` for production (faster)
    apiVersion: '2024-03-01',
});

const builder = createImageUrlBuilder(sanityClient);

// Funkcja pomocnicza do generowania adresów URL obrazków z Sanity
export const urlFor = (source) => builder.image(source);

// Funkcja pomocnicza do zamiany domeny Sanity na proxy w Cloudflare
export const getProxyUrl = (imageBuilder) => {
    if (!imageBuilder) return null;
    const url = imageBuilder.url();
    if (url && typeof window !== 'undefined') {
        return url.replace('https://cdn.sanity.io', '/sanity-cdn');
    }
    return url;
};
