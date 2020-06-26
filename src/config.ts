import toml from "toml";
import { promises as fs } from "fs";

export interface AppConfig {
    globals: {
        [key: string]: string;
    }
    social: {
        matrix: string;
        twitter: string;
        github: string;
    }
}

export async function readConfig(configFile: string): Promise<AppConfig> {
    return toml.parse(
        await fs.readFile(configFile, "utf-8"),
    ) as AppConfig;
}