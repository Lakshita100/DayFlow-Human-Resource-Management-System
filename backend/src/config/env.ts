import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is missing'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').default('http://localhost:5173'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is missing'),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

type EnvConfig = z.infer<typeof envSchema>;

function loadEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `${key}: ${messages?.join(', ')}`)
      .join('\n');

    console.error('\n❌ Environment configuration error:');
    console.error(errorMessages);
    console.error('\nPlease check your .env file.\n');
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
