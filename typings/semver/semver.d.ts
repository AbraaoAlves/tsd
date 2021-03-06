// Type definitions for semver v2.2.1
// Project: https://github.com/isaacs/node-semver
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module SemverModule {

    export function  valid(v:string, loose?:boolean):string; // Return the parsed version, or null if it's not valid.
    //TODO maybe add an enum for release?
    export function  inc(v:string, release:string, loose?:boolean):string; // Return the version incremented by the release type (major, minor, patch, or prerelease), or null if it's not valid.

    //Comparison
    export function  gt(v1:string, v2:string, loose?:boolean):boolean; // v1 > v2
    export function  gte(v1:string, v2:string, loose?:boolean):boolean; // v1 >= v2
    export function  lt(v1:string, v2:string, loose?:boolean):boolean; // v1 < v2
    export function  lte(v1:string, v2:string, loose?:boolean):boolean; // v1 <= v2
    export function  eq(v1:string, v2:string, loose?:boolean):boolean; // v1 == v2 This is true if they're logically equivalent, even if they're not the exact same string. You already know how to compare strings.
    export function  neq(v1:string, v2:string, loose?:boolean):boolean; // v1 != v2 The opposite of eq.
    export function  cmp(v1:string, comparator:any, v2:string, loose?:boolean):boolean; // Pass in a comparison string, and it'll call the corresponding function above. "===" and "!==" do simple string comparison, but are included for completeness. Throws if an invalid comparison string is provided.
    export function  compare(v1:string, v2:string, loose?:boolean):number; // Return 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is greater. Sorts in ascending order if passed to Array.sort().
    export function  rcompare(v1:string, v2:string, loose?:boolean):number; // The reverse of compare. Sorts an array of versions in descending order when passed to Array.sort().

    //Ranges
    export function  validRange(range:string, loose?:boolean):string; // Return the valid range or null if it's not valid
    export function  satisfies(version:string, range:string, loose?:boolean):string; // Return true if the version satisfies the range.
    export function  maxSatisfying(versions:string[], range:string, loose?:boolean):string; // Return the highest version in the list that satisfies the range, or null if none of them do.
    export function  gtr(version:string, range:string, loose?:boolean):boolean; // Return true if version is greater than all the versions possible in the range.
    export function  ltr(version:string, range:string, loose?:boolean):boolean; // Return true if version is less than all the versions possible in the range.
    export function  outside(version:string, range:string, hilo:string, loose?:boolean):boolean; // Return true if the version is outside the bounds of the range in either the high or low direction. The hilo argument must be either the string '>' or '<'. (This is the function called by gtr and ltr.)

    class SemverBase {
        raw:string;
        loose:boolean;
        format():string;
        inspect():string;
        toString():string;
    }

    class Semver extends SemverBase {
        constructor(version:string, loose?:boolean);

        major:number;
        minor:number;
        patch:number;
        version:string;
        build:string[];
        prerelease:string[];

        compare(other:Semver):number;
        compareMain(other:Semver):number;
        comparePre(other:Semver):number;
        inc(release:string):Semver;
    }

    class Comparator extends SemverBase {
        constructor(comp:string, loose?:boolean);

        semver:Semver;
        operator:string;
        value:boolean;
        parse(comp:string) :void;
        test(version:Semver):boolean;
    }

    class Range extends SemverBase {
        constructor(range:string, loose?:boolean);

        set():Comparator[][];
        parseRange(range:string):Comparator[];
        test(version:Semver):boolean;
    }
}
declare module "semver" {
export = SemverModule;
}
