type FlatMappable<T, U> = T[] & {
    flatMap: (func: (item: T) => U) => U[]
}

const BETWEEN_BRACKET_AND_EQUAL = /(?<=\[).*?(?==)/
const BETWEEN_EQUAL_AND_BRACKET = /(?<==).*?(?=])/
const EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET = /([\.#:].*?((?=[\.#:[])|$)|\[.*?])/g

const isFlatMappable = <T, U>(object: any): object is FlatMappable<T, U> => object && object.flatMap && typeof object.flatMap === 'function'

function flatten<T>(maybeArray: T[][]): T[];
function flatten<T>(maybeArray: T[]): T[];
function flatten<T>(maybeArray: T): T[];
function flatten(maybeArray: any) {
    if (isFlatMappable(maybeArray)) {
        return maybeArray.flatMap(element => flatten(element));
    } else {
        return [maybeArray];
    }
}


const parseAbbr = (expression: string) => {
    const AttrExpMap: { [index: string]: Function } = {
        '.': (exp: string) => ({['class']: exp.slice(1)}),
        '#': (exp: string) => ({['id']: exp.slice(1)}),
        ':': (exp: string) => ({['type']: exp.slice(1)}),
        '[': (exp: string) => ({[exp.match(BETWEEN_BRACKET_AND_EQUAL)?.[0] || '']: exp.match(BETWEEN_EQUAL_AND_BRACKET)?.[0]}),
    };
    return (expression.match(EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET) || [])
        .map(part => (AttrExpMap[(part?.[0] || '')] || (() => ({})))(part))
        .reduce(({class: classValue1, ...attrs1}, {class: classValue2, ...attrs2}) => ({
            ...attrs1,
            ...attrs2,
            class: [classValue1, classValue2]
                .filter(classValue => classValue != null && classValue !== '')
                .join(' '),
        }))
};

const parseTemplate = (template:string[], ...args:any[]) => template
    .map((text, index) => text + (args.length > index ? args[index] : ''))
    .join('');

export {flatten, parseAbbr, parseTemplate}
