import { Page } from 'puppeteer/lib/cjs/puppeteer/common/Page';
import { CDPSession } from 'puppeteer/lib/cjs/puppeteer/common/Connection';

declare type WaitForSelectorOptions = {
  visible?: boolean;
  hidden?: boolean;
  timeout?: number;
};

declare type WaitForNetworkIdleOptions = {
  idleFor?: number;
  maxRequests?: number;
  timeout?: number;
  ignore?: RegExp;
};

export declare class EnrichedPage extends Page {
  refreshPage(
    network?: boolean,
    options?: {
      timeout?: number;
    },
  ): Promise<any>;
  fullyRefreshPage(): Promise<any>;
  clearAllData(): Promise<any>;

  clearCache(cdpSession?: CDPSession): Promise<any>;
  clearUserData(cdpSession?: CDPSession): Promise<any>;
  getAllText(selector: string, options?: WaitForSelectorOptions): Promise<Array<any>>;
  getText(selector: string, options?: WaitForSelectorOptions): Promise<string>;
  getClasses(selector: string, options?: WaitForSelectorOptions): Promise<Array<any>>;
  hasClass(selector: string, className: string, options?: WaitForSelectorOptions): Promise<boolean>;
  isExists(selector: string): Promise<boolean>;
  isExistsByText(selector: string, text: string, options?: { normalize: boolean }): Promise<boolean>;
  getCacheItem(name: string): Promise<unknown>;
  removeCacheItem(name: string): Promise<void>;
  waitForTransitionAnimationEnd(selector: string, timeout: number): Promise<void>;
  waitForClick(selector: string, options?: { clickCount?: number; timeout: number }): Promise<void>;
  waitForNetworkIdle(options?: WaitForNetworkIdleOptions): Promise<void>;
  getElementsCount(selector: string, options?: WaitForSelectorOptions): Promise<number>;
  clickAndType(selector: string, text: string, options?: WaitForSelectorOptions): Promise<void>;
  waitForUrlToInclude(partial: string, options?: WaitForSelectorOptions): Promise<void>;
}

declare const page: EnrichedPage;

