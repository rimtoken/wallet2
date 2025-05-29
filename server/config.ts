import { z } from "zod";

// Environment configuration schema with validation
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  
  // Authentication & Security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  BCRYPT_ROUNDS: z.string().default("12").transform(Number),
  
  // External APIs
  COINGECKO_API_KEY: z.string().optional(),
  INFURA_API_KEY: z.string().optional(),
  ALCHEMY_API_KEY: z.string().optional(),
  
  // Blockchain Networks
  ETHEREUM_RPC_URL: z.string().url().optional(),
  BSC_RPC_URL: z.string().url().optional(),
  POLYGON_RPC_URL: z.string().url().optional(),
  SOLANA_RPC_URL: z.string().url().optional(),
  
  // Payment Providers
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  
  // Communication Services
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  
  // Application Settings
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000").transform(Number),
  CORS_ORIGIN: z.string().default("*"),
  
  // Security Headers
  RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform(Number), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100").transform(Number),
  
  // Encryption
  ENCRYPTION_KEY: z.string().min(32, "ENCRYPTION_KEY must be at least 32 characters").optional(),
  
  // External Service URLs
  NOTIFICATION_SERVICE_URL: z.string().url().optional(),
  ANALYTICS_SERVICE_URL: z.string().url().optional(),
});

// Parse and validate environment variables
function parseEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === "invalid_type" && err.received === "undefined")
        .map(err => err.path.join("."));
      
      const invalidVars = error.errors
        .filter(err => err.code !== "invalid_type" || err.received !== "undefined")
        .map(err => `${err.path.join(".")}: ${err.message}`);

      console.error("❌ Environment configuration errors:");
      
      if (missingVars.length > 0) {
        console.error("Missing required environment variables:");
        missingVars.forEach(varName => console.error(`  - ${varName}`));
      }
      
      if (invalidVars.length > 0) {
        console.error("Invalid environment variables:");
        invalidVars.forEach(error => console.error(`  - ${error}`));
      }
      
      console.error("\n💡 Create a .env file with the required variables or set them in your environment.");
      process.exit(1);
    }
    throw error;
  }
}

// Export validated configuration
export const config = parseEnvironment();

// Export individual configs for easier access
export const dbConfig = {
  url: config.DATABASE_URL,
};

export const authConfig = {
  jwtSecret: config.JWT_SECRET,
  sessionSecret: config.SESSION_SECRET,
  bcryptRounds: config.BCRYPT_ROUNDS,
};

export const apiConfig = {
  coinGecko: config.COINGECKO_API_KEY,
  infura: config.INFURA_API_KEY,
  alchemy: config.ALCHEMY_API_KEY,
};

export const blockchainConfig = {
  ethereum: config.ETHEREUM_RPC_URL,
  bsc: config.BSC_RPC_URL,
  polygon: config.POLYGON_RPC_URL,
  solana: config.SOLANA_RPC_URL,
};

export const paymentConfig = {
  stripe: {
    secretKey: config.STRIPE_SECRET_KEY,
    publishableKey: config.STRIPE_PUBLISHABLE_KEY,
  },
  paypal: {
    clientId: config.PAYPAL_CLIENT_ID,
    clientSecret: config.PAYPAL_CLIENT_SECRET,
  },
};

export const communicationConfig = {
  twilio: {
    accountSid: config.TWILIO_ACCOUNT_SID,
    authToken: config.TWILIO_AUTH_TOKEN,
    phoneNumber: config.TWILIO_PHONE_NUMBER,
  },
  sendGrid: {
    apiKey: config.SENDGRID_API_KEY,
  },
};

export const securityConfig = {
  rateLimitWindowMs: config.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: config.RATE_LIMIT_MAX_REQUESTS,
  encryptionKey: config.ENCRYPTION_KEY,
  corsOrigin: config.CORS_ORIGIN,
};

export const appConfig = {
  nodeEnv: config.NODE_ENV,
  port: config.PORT,
  isProduction: config.NODE_ENV === "production",
  isDevelopment: config.NODE_ENV === "development",
};

// Helper function to check if a service is configured
export function isServiceConfigured(service: keyof typeof config): boolean {
  return !!config[service];
}

// Helper function to get service URL with fallbacks
export function getServiceUrl(service: string, fallback?: string): string {
  const url = config[service as keyof typeof config];
  if (typeof url === "string") return url;
  if (fallback) return fallback;
  throw new Error(`Service ${service} is not configured and no fallback provided`);
}