import { SeoImage } from "./seo-image.type";

export interface SeoData {
	title?: string;
	description?: string;
	type?: string;
    keywords?: string;
    image: SeoImage
}
