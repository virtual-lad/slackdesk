export interface EnvConfig {
    name: string;
    version: string;
    environment: string;
}

export function getEnvironment(): EnvConfig {
    return {
        name: "SlackDesk",
        version: "1.0.0",
        environment: "PROD"
    };
}
