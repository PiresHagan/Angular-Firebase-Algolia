import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SeoData } from '../../interfaces/seo-data.type';
import { SeoDataService } from '../seo-data.service';

export class SeoConfig extends SeoData {
  url?: string; // the relative route path
  tabTitle?: string;
  summary?: string;
}

@Injectable()
export class SeoService {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private seoDataService: SeoDataService,
  ) { }

  public updateMetaTags(config: SeoConfig): void {
    // default values
    config = {
      title: 'What’s Trending Today | Trending News | Live News | My Trending Stories',
      description: 'Are you wondering what’s trending today? Find the best trending news on My Trending Stories. Discover our daily live news and never miss anything again.',
      summary: 'Are you wondering what’s trending today? Find the best trending news on My Trending Stories.',
      image: {},
      keywords: 'news,articles',
      type: 'website',
      ...config,
      url: window.location.href, // window.location.origin + (config.url || this.router.url)
    };

    if (!config.image.url) {
      config.image.url = 'https://mytrendingstories.com/assets/images/favicon.png';
    }

    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:card', content: config.summary || config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image.url });

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'image', content: config.image.url });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });

    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image.url });
    // this.meta.updateTag({ property: 'og:type', content: config.type });
    this.meta.updateTag({ property: 'og:url', content: config.url });

    this.updateBrowserTabTitle(config.tabTitle || config.title);
  }

  public updateTagsWithData(seoId: string): void {
    this.seoDataService.getSeoData(seoId).pipe(take(1)).subscribe(doc => {
      if (doc.exists) {
        const data: SeoData = doc.data();
        this.updateMetaTags(data);
      }
    }, err => {
      console.log('Error getting seo data', seoId, err);
    });
  }

  public updateBrowserTabTitle(text: string): void {
    this.titleService.setTitle(text);
  }
}