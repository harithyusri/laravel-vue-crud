// Minimal TypeScript declarations for ziggy-js
// Improve these types later if you use more of Ziggy's API.

declare module 'ziggy-js' {
    export interface Ziggy {
        url?: string;
        port?: string | number;
        defaults?: Record<string, any>;
        namedRoutes?: Record<string, string>;
    }

    export interface NamedRouteParams {
        [key: string]: string | number | boolean | undefined | null | Array<string | number>;
    }

    /**
     * route(name, params?, absolute?, routeObject?)
     * - name: route name
     * - params: route parameters
     * - absolute: boolean to force absolute URL
     * - routeObject: optional Ziggy object override
     */
    export type UrlMethodPair = { url: string; method?: string };

    export default function route(
        name: string,
        params?: NamedRouteParams | Array<string | number>,
        absolute?: boolean,
        routeObject?: Ziggy,
    ): UrlMethodPair | string;

    export function setZiggy(ziggy: Ziggy): void;
    export function getZiggy(): Ziggy;
}
