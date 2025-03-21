const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) { }

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";
console.log("------------DATABASE_URL", DATABASE_URL)
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      serve: true,
      autoRebuild: true,
      backend: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
      path: "/app",
      outDir: "build",
      develop: {
        serve: true,
        // open: false,
        open: process.env.OPEN_BROWSER !== "false",
        port: 7002,
        host: "localhost",
        logLevel: "error",
        stats: "normal",
        allowedHosts: "auto",
        webSocketURL: undefined,
      },
    },
  },
  `medusa-plugin-wishlist`,
  // {
  //   resolve: "medusa-file-r2",
  //   options: {
  //     account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  //     access_key: process.env.CLOUDFLARE_ACCESS_KEY,
  //     secret_key: process.env.CLOUDFLARE_SECRET_KEY,
  //     bucket: process.env.CLOUDFLARE_BUCKET,
  //     public_url: process.env.CLOUDFLARE_PUBLIC_URL,
  //     prefix: process.env.CLOUDFLARE_PREFIX,
  //     endpoint: process.env.CLOUDFLARE_ENDPOINT
  //   }
  // },
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,

      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      cache_control: process.env.S3_CACHE_CONTROL,
      // optional
      // download_file_duration:
      //   process.env.S3_DOWNLOAD_FILE_DURATION,
      prefix: process.env.S3_PREFIX,
    },
  },
  // {
  //   resolve: "medusa-file-cloudflare-r2",
  //   options: {
  //     public_url: process.env.CLOUDFLARE_PUBLIC_URL,       // https://images.surplusloop.com
  //     s3_endpoint: process.env.CLOUDFLARE_ENDPOINT,        // https://f9627655e2a386fe60fa5b01ce1cc118.r2.cloudflarestorage.com
  //     bucket: process.env.CLOUDFLARE_BUCKET,               // sl-medusa
  //     prefix: process.env.CLOUDFLARE_PREFIX,               // sl-med
  //     access_key_id: process.env.CLOUDFLARE_ACCESS_KEY,    // 75EfE389d47830850a4b243e05759ab
  //     secret_access_key: process.env.CLOUDFLARE_SECRET_KEY, // 83e35d4471da54cd66d7bd8924da3fa132476c7597797e79022a796866a5707
  //   },
  // },
  {
    resolve: `@rsc-labs/medusa-store-analytics`,
    options: {
      enableUI: true
    }
  },
  {
    resolve: `@rsc-labs/medusa-documents`,
    options: {
      enableUI: true
    }
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      payment_options: {
        payment_method_types: ["card"],
        // Enable 3DS by setting automatic_payment_methods
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'always'
        }
      }
    },
  },
  // {
  //   resolve: 'medusa-plugin-category-images',
  //   options: {
  //     enableUI: true,
  //   },
  // },

];
console.log("00000000000000000----------", REDIS_URL);
const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};
/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  path_prefix: "/api",  // This handles the /api prefix stripping
  database_extra:
    process.env.DATABASE_SSL !== 'true'
      ? undefined
      : {
        ssl: {
          rejectUnauthorized: false,
        },
      },
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
