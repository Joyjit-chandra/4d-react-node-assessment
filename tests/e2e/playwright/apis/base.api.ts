import { APIRequestContext, APIResponse } from '@playwright/test';
import { Serializable } from 'child_process';
import { ReadStream } from 'fs';

export class BaseApi {
  constructor(readonly request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Sends a GET request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async get(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.get(url, options)
    );
  }

  /**
   * Sends a POST request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async post(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.post(url, options)
    );
  }

  /**
   * Sends a PUT request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async put(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.put(url, options)
    );
  }

  /**
   * Sends a DELETE request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async delete(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.delete(url, options)
    );
  }

  /**
   * Sends a PATCH request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async patch(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.patch(url, options)
    );
  }

  /**
   * Sends a HEAD request to the specified URL with optional parameters.
   *
   * @param {string} url - The URL to send the request to.
   * @param {APIRequestOptions} [options] - Optional request options.
   * @returns {Promise<APIResponse>} The API response.
   */
  async head(url: string, options?: APIRequestOptions): Promise<APIResponse> {
    return this.handleRequest(url, options, () =>
      this.request.head(url, options)
    );
  }

  /**
   * Handles the request, validates the response, and throws an error if the request fails.
   *
   * @param {() => Promise<APIResponse>} requestMethod - The request method to execute.
   * @returns {Promise<APIResponse>} The API response.
   * @throws {Error} If the request fails.
   */
  private async handleRequest(
    url: string,
    options: APIRequestOptions | undefined,
    requestMethod: () => Promise<APIResponse>
  ): Promise<APIResponse> {
    try {
      const response = await requestMethod();
      await this.validateResponse(response, url, options);
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  /**
   * Validates the API response and throws an error if the response is not successful.
   *
   * @param {APIResponse} response - The API response to validate.
   * @throws {Error} If the response is not successful.
   */
  private async validateResponse(
    response: APIResponse,
    url: string,
    options: APIRequestOptions | undefined
  ): Promise<void> {
    if (!response.ok()) {
      const status = response.status();
      const statusText = response.statusText();
      const body = await response.text();

      console.error(`Request failed with status ${status} ${statusText}`);
      console.error('Response body:', body);
      console.log('Request URL:', url);
      console.log('Request Headers:', options?.headers || 'No headers');
      console.log('Request Body:', JSON.stringify(options?.data) || 'No body');
      console.log('Request Body:', options?.params || 'No params');

      throw new Error(
        `Request failed with status ${status} ${statusText} ${body}`
      );
    }
  }

  /**
   * Handles paginated API requests.
   * @param {string} url - The base URL for the API request.
   * @param {Record<string, unknown>} params - The query parameters for the API request.
   * @param {number} pageSize - The number of items per page.
   * @param {(data: unknown) => unknown[]} dataExtractor - A function to extract the relevant data from the response.
   * @returns {Promise<unknown[]>} An array of all paginated data.
   */
  async handlePagination(
    url: string,
    params: Record<string, unknown>,
    pageSize: number,
    dataExtractor: (data: unknown) => unknown[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[]> {
    let pageNum = 1;
    const allData: unknown[] = [];
    let hasMoreData = true;

    while (hasMoreData) {
      const response = await this.get(url, {
        params: { ...params, $pagenum: pageNum, $pagesize: pageSize },
      });

      if (response.status() == 200) {
        const data = await response.json();
        const extractedData = dataExtractor(data);

        if (Array.isArray(extractedData) && extractedData.length > 0) {
          allData.push(...extractedData);
          pageNum++;
        } else {
          hasMoreData = false;
        }
      } else {
        //handle case of 204 - when no folder exists
        hasMoreData = false;
      }
    }

    return allData;
  }
}

export interface APIRequestOptions {
  /**
   * Allows to set post data of the request. If the data parameter is an object, it will be serialized to JSON string
   * and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type`
   * header will be set to `application/octet-stream` if not explicitly set.
   */
  data?: string | Buffer | Serializable;

  /**
   * Whether to throw on response codes other than 2xx and 3xx. By default, the response object is returned for all status
   * codes.
   */
  failOnStatusCode?: boolean;

  /**
   * Provides an object that will be serialized as an HTML form using `application/x-www-form-urlencoded` encoding and sent
   * as this request body. If this parameter is specified, the `content-type` header will be set to
   * `application/x-www-form-urlencoded` unless explicitly provided.
   */
  form?: Record<string, string | number | boolean>;

  /**
   * Allows setting HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by
   * it.
   */
  headers?: Record<string, string>;

  /**
   * Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
   */
  ignoreHTTPSErrors?: boolean;

  /**
   * Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is
   * exceeded. Defaults to `20`. Pass `0` to not follow redirects.
   */
  maxRedirects?: number;

  /**
   * Maximum number of times network errors should be retried. Currently only `ECONNRESET` errors are retried. Does not
   * retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
   */
  maxRetries?: number;

  /**
   * Provides an object that will be serialized as an HTML form using `multipart/form-data` encoding and sent as this
   * request body. If this parameter is specified, the `content-type` header will be set to `multipart/form-data` unless
   * explicitly provided.
   */
  multipart?:
    | FormData
    | Record<
        string,
        | string
        | number
        | boolean
        | ReadStream
        | {
            name: string;
            mimeType: string;
            buffer: Buffer;
          }
      >;

  /**
   * Query parameters to be sent with the URL.
   */
  params?: Record<string, string | number | boolean>;

  /**
   * Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
   */
  timeout?: number;
}
