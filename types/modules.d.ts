declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
}

// wa-sqlite ships no type declarations for these — see
// src/db/sqlite/wa-sqlite-adapter.ts (wayfinder ticket "Port the
// wa-sqlite driver adapter into eregisters' SqlDriver interface").
declare module '@journeyapps/wa-sqlite/src/examples/OPFSCoopSyncVFS.js' {
    export const OPFSCoopSyncVFS: any
}
declare module '*.wasm?url' {
    const url: string
    export default url
}
