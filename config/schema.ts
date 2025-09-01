import { z } from 'zod';

export const ConfigSchema = z.object({
  name: z.string(),
  group: z.enum(['dev', 'test', 'uat', 'onprem']),
  app: z.object({
    baseUrl: z.string().url(),
    username: z.string(),
    password: z.string(),
  }),
  db: z.object({
    oracle: z
      .object({
        host: z.string(),
        port: z.number().int().positive(),
        serviceName: z.string().optional(),
        connectString: z.string().optional(),
        user: z.string(),
        password: z.string(),
        poolMin: z.number().int().nonnegative().default(1),
        poolMax: z.number().int().positive().default(10),
        poolIncrement: z.number().int().positive().default(1),
        poolTimeout: z.number().int().positive().default(60),
        enableStatistics: z.boolean().default(false),
      })
      .refine(data => data.serviceName || data.connectString, {
        message: 'Either serviceName or connectString must be provided',
      }),
    postgres: z.object({
      host: z.string(),
      port: z.number().int().positive(),
      database: z.string(),
      user: z.string(),
      password: z.string(),
      max: z.number().int().positive().default(20),
      idleTimeoutMillis: z.number().int().positive().default(30000),
      connectionTimeoutMillis: z.number().int().positive().default(2000),
      ssl: z
        .object({
          rejectUnauthorized: z.boolean().default(false),
          ca: z.string().optional(),
          cert: z.string().optional(),
          key: z.string().optional(),
        })
        .optional(),
    }),
  }),
  certs: z.object({
    client: z.object({
      pfxPath: z.string(),
      passphrase: z.string(),
      origin: z.string().url(),
    }),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const validateConfig = (config: unknown): Config => {
  return ConfigSchema.parse(config);
};