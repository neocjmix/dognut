declare function flatten<T>(maybeArray: T[][]): T[];
declare function flatten<T>(maybeArray: T[]): T[];
declare function flatten<T>(maybeArray: T): T[];
declare const parseAbbr: (expression: string) => any;
declare const parseTemplate: (template: string[], ...args: any[]) => string;
export { flatten, parseAbbr, parseTemplate };
//# sourceMappingURL=common.d.ts.map