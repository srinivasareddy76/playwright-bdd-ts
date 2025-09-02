import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    name: z.ZodString;
    group: z.ZodEnum<["dev", "test", "uat", "onprem"]>;
    app: z.ZodObject<{
        baseUrl: z.ZodString;
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        baseUrl: string;
        username: string;
        password: string;
    }, {
        baseUrl: string;
        username: string;
        password: string;
    }>;
    db: z.ZodObject<{
        oracle: z.ZodEffects<z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            serviceName: z.ZodOptional<z.ZodString>;
            connectString: z.ZodOptional<z.ZodString>;
            user: z.ZodString;
            password: z.ZodString;
            poolMin: z.ZodDefault<z.ZodNumber>;
            poolMax: z.ZodDefault<z.ZodNumber>;
            poolIncrement: z.ZodDefault<z.ZodNumber>;
            poolTimeout: z.ZodDefault<z.ZodNumber>;
            enableStatistics: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            host: string;
            port: number;
            user: string;
            poolMin: number;
            poolMax: number;
            poolIncrement: number;
            poolTimeout: number;
            enableStatistics: boolean;
            serviceName?: string | undefined;
            connectString?: string | undefined;
        }, {
            password: string;
            host: string;
            port: number;
            user: string;
            serviceName?: string | undefined;
            connectString?: string | undefined;
            poolMin?: number | undefined;
            poolMax?: number | undefined;
            poolIncrement?: number | undefined;
            poolTimeout?: number | undefined;
            enableStatistics?: boolean | undefined;
        }>, {
            password: string;
            host: string;
            port: number;
            user: string;
            poolMin: number;
            poolMax: number;
            poolIncrement: number;
            poolTimeout: number;
            enableStatistics: boolean;
            serviceName?: string | undefined;
            connectString?: string | undefined;
        }, {
            password: string;
            host: string;
            port: number;
            user: string;
            serviceName?: string | undefined;
            connectString?: string | undefined;
            poolMin?: number | undefined;
            poolMax?: number | undefined;
            poolIncrement?: number | undefined;
            poolTimeout?: number | undefined;
            enableStatistics?: boolean | undefined;
        }>;
        postgres: z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            database: z.ZodString;
            user: z.ZodString;
            password: z.ZodString;
            max: z.ZodDefault<z.ZodNumber>;
            idleTimeoutMillis: z.ZodDefault<z.ZodNumber>;
            connectionTimeoutMillis: z.ZodDefault<z.ZodNumber>;
            ssl: z.ZodOptional<z.ZodObject<{
                rejectUnauthorized: z.ZodDefault<z.ZodBoolean>;
                ca: z.ZodOptional<z.ZodString>;
                cert: z.ZodOptional<z.ZodString>;
                key: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                rejectUnauthorized: boolean;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            }, {
                rejectUnauthorized?: boolean | undefined;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max: number;
            idleTimeoutMillis: number;
            connectionTimeoutMillis: number;
            ssl?: {
                rejectUnauthorized: boolean;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        }, {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max?: number | undefined;
            idleTimeoutMillis?: number | undefined;
            connectionTimeoutMillis?: number | undefined;
            ssl?: {
                rejectUnauthorized?: boolean | undefined;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        oracle: {
            password: string;
            host: string;
            port: number;
            user: string;
            poolMin: number;
            poolMax: number;
            poolIncrement: number;
            poolTimeout: number;
            enableStatistics: boolean;
            serviceName?: string | undefined;
            connectString?: string | undefined;
        };
        postgres: {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max: number;
            idleTimeoutMillis: number;
            connectionTimeoutMillis: number;
            ssl?: {
                rejectUnauthorized: boolean;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        };
    }, {
        oracle: {
            password: string;
            host: string;
            port: number;
            user: string;
            serviceName?: string | undefined;
            connectString?: string | undefined;
            poolMin?: number | undefined;
            poolMax?: number | undefined;
            poolIncrement?: number | undefined;
            poolTimeout?: number | undefined;
            enableStatistics?: boolean | undefined;
        };
        postgres: {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max?: number | undefined;
            idleTimeoutMillis?: number | undefined;
            connectionTimeoutMillis?: number | undefined;
            ssl?: {
                rejectUnauthorized?: boolean | undefined;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        };
    }>;
    certs: z.ZodObject<{
        client: z.ZodObject<{
            pfxPath: z.ZodString;
            passphrase: z.ZodString;
            origin: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            pfxPath: string;
            passphrase: string;
            origin: string;
        }, {
            pfxPath: string;
            passphrase: string;
            origin: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        client: {
            pfxPath: string;
            passphrase: string;
            origin: string;
        };
    }, {
        client: {
            pfxPath: string;
            passphrase: string;
            origin: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    group: "dev" | "test" | "uat" | "onprem";
    app: {
        baseUrl: string;
        username: string;
        password: string;
    };
    db: {
        oracle: {
            password: string;
            host: string;
            port: number;
            user: string;
            poolMin: number;
            poolMax: number;
            poolIncrement: number;
            poolTimeout: number;
            enableStatistics: boolean;
            serviceName?: string | undefined;
            connectString?: string | undefined;
        };
        postgres: {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max: number;
            idleTimeoutMillis: number;
            connectionTimeoutMillis: number;
            ssl?: {
                rejectUnauthorized: boolean;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        };
    };
    certs: {
        client: {
            pfxPath: string;
            passphrase: string;
            origin: string;
        };
    };
}, {
    name: string;
    group: "dev" | "test" | "uat" | "onprem";
    app: {
        baseUrl: string;
        username: string;
        password: string;
    };
    db: {
        oracle: {
            password: string;
            host: string;
            port: number;
            user: string;
            serviceName?: string | undefined;
            connectString?: string | undefined;
            poolMin?: number | undefined;
            poolMax?: number | undefined;
            poolIncrement?: number | undefined;
            poolTimeout?: number | undefined;
            enableStatistics?: boolean | undefined;
        };
        postgres: {
            password: string;
            host: string;
            port: number;
            user: string;
            database: string;
            max?: number | undefined;
            idleTimeoutMillis?: number | undefined;
            connectionTimeoutMillis?: number | undefined;
            ssl?: {
                rejectUnauthorized?: boolean | undefined;
                ca?: string | undefined;
                cert?: string | undefined;
                key?: string | undefined;
            } | undefined;
        };
    };
    certs: {
        client: {
            pfxPath: string;
            passphrase: string;
            origin: string;
        };
    };
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const validateConfig: (config: unknown) => Config;
//# sourceMappingURL=schema.d.ts.map