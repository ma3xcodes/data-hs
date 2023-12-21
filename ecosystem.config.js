module.exports = {
  apps: [
    {
      name: "datamexico-site",
      script: "./index.js",
      cwd: "/home/datahs/www/",
      watch: false,
      wait_ready: true,
      listen_timeout: 300000,
      max_memory_restart: "700M",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "deployment",
        CANON_API: "http://192.168.159.139:3300",
        // CANON_PORT: 3300,
        // if the domain is not root "/", for example "https://datamexico.org/dm-dev-web", then you need to include
        // the following env variables in the ecosystem
        // CANON_BASE_URL, CANON_CONST_CANON_BASE_URL
        // also add CANON_BASE_URL in the init.sh script (see Notes section):
        // CANON_API: "https://datamexico.org/dm-dev-web",
        // CANON_BASE_URL: "https://datamexico.org/dm-dev-web/",
        // CANON_CONST_CANON_BASE_URL: "/dm-dev-web",
        CANON_BASE_URL: "http://192.168.159.139:3300",
        CANON_CONST_CANON_BASE_URL: "/",
        CANON_STATS_API: "https://www.economia.gob.mx/datamexico/api",
        CANON_STATS_LOGGING: "true",
        CANON_CONST_BASE: "https://www.economia.gob.mx/datamexico/api/",
        CANON_CONST_PROFILE_COMPARISON: true,
        CANON_LANGUAGES: "en,es",
        CANON_LANGUAGE_DEFAULT: "es",
        CANON_LOGINS: "true",
        CANON_CMS_CUBES: "https://www.economia.gob.mx/datamexico/api/",
        CANON_CMS_LOGGING: "true",
        CANON_CMS_ENABLE: true,
        CANON_CMS_GENERATOR_TIMEOUT: 90000,
        CANON_DB_USER: "postgres",
        CANON_DB_PW: "postgres",
        CANON_DB_NAME: "datamexico",
        CANON_DB_HOST: "192.168.1.101",
        CANON_GOOGLE_ANALYTICS: "KEY",
        CANON_CONST_STORAGE_BUCKET: "gcp-bucket-name",
        GOOGLE_APPLICATION_CREDENTIALS: "/path/to/gcp/credentials/gcp-bucket-token.json",
        FLICKR_API_KEY: "KEY",
        CANON_CMS_REQUESTS_PER_SECOND: 60
      }
    }
  ]
};
