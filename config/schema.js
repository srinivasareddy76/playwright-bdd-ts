"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.ConfigSchema = void 0;
const zod_1 = require("zod");
exports.ConfigSchema = zod_1.z.object({
    name: zod_1.z.string(),
    group: zod_1.z.enum(['dev', 'test', 'uat', 'onprem']),
    app: zod_1.z.object({
        baseUrl: zod_1.z.string().url(),
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
    db: zod_1.z.object({
        oracle: zod_1.z
            .object({
            host: zod_1.z.string(),
            port: zod_1.z.number().int().positive(),
            serviceName: zod_1.z.string().optional(),
            connectString: zod_1.z.string().optional(),
            user: zod_1.z.string(),
            password: zod_1.z.string(),
            poolMin: zod_1.z.number().int().nonnegative().default(1),
            poolMax: zod_1.z.number().int().positive().default(10),
            poolIncrement: zod_1.z.number().int().positive().default(1),
            poolTimeout: zod_1.z.number().int().positive().default(60),
            enableStatistics: zod_1.z.boolean().default(false),
        })
            .refine(data => data.serviceName || data.connectString, {
            message: 'Either serviceName or connectString must be provided',
        }),
        postgres: zod_1.z.object({
            host: zod_1.z.string(),
            port: zod_1.z.number().int().positive(),
            database: zod_1.z.string(),
            user: zod_1.z.string(),
            password: zod_1.z.string(),
            max: zod_1.z.number().int().positive().default(20),
            idleTimeoutMillis: zod_1.z.number().int().positive().default(30000),
            connectionTimeoutMillis: zod_1.z.number().int().positive().default(2000),
            ssl: zod_1.z
                .object({
                rejectUnauthorized: zod_1.z.boolean().default(false),
                ca: zod_1.z.string().optional(),
                cert: zod_1.z.string().optional(),
                key: zod_1.z.string().optional(),
            })
                .optional(),
        }),
    }),
    certs: zod_1.z.object({
        client: zod_1.z.object({
            pfxPath: zod_1.z.string(),
            passphrase: zod_1.z.string(),
            origin: zod_1.z.string().url(),
        }),
    }),
});
const validateConfig = (config) => {
    return exports.ConfigSchema.parse(config);
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=schema.js.map