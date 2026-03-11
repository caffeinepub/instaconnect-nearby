import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InstagramEntry {
    id: bigint;
    pin: bigint;
    area: string;
    name: string;
    instagramUsername: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    addEntry(name: string, instagramUsername: string, area: string, pin: bigint): Promise<bigint>;
    deleteEntry(id: bigint, pin: bigint): Promise<void>;
    getAllEntries(): Promise<Array<InstagramEntry>>;
    getEntriesByArea(area: string): Promise<Array<InstagramEntry>>;
}
