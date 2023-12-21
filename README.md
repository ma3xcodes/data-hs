
# DataMexico Site

## Requirements

- [Node 12](https://nodejs.org/en/blog/release/v12.13.0/)
- Ubuntu: `sudo apt -y install gcc g++ make`
- `canon-stats` and `gcp-bucket-token.json`: please contact datamexico@datawheel.us to get the required credentials
- `ecosystem.config.js` file:

```
module.exports = {
  apps: [
    {
      name: "datamexico-site",
      script: "./index.js",
      cwd: "/path/to/repository/directory/datamexico-site/",
      watch: false,
      wait_ready: true,
      listen_timeout: 300000,
      max_memory_restart: "700M",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "deployment",
        CANON_API: "https://datamexico.org",
        CANON_STATS_API: "https://api.datamexico.org/tesseract",
        CANON_STATS_LOGGING: "true",
        CANON_CONST_BASE: "https://api.datamexico.org/tesseract/",
        CANON_CONST_PROFILE_COMPARISON: true,
        CANON_LANGUAGES: "en,es",
        CANON_LANGUAGE_DEFAULT: "es",
        CANON_LOGINS: "true",
        CANON_CMS_CUBES: "https://api.datamexico.org/tesseract/",
        CANON_CMS_LOGGING: "true",
        CANON_CMS_ENABLE: true,
        CANON_CMS_GENERATOR_TIMEOUT: 90000,
        CANON_DB_USER: "DB_USER",
        CANON_DB_PW: "DB_PW",
        CANON_DB_NAME: "DB_NAME",
        CANON_DB_HOST: "DB_HOST",
        CANON_GOOGLE_ANALYTICS: "KEY",
        CANON_CONST_STORAGE_BUCKET: "gcp-bucket-name",
        GOOGLE_APPLICATION_CREDENTIALS: "/path/to/gcp/credentials/gcp-bucket-token.json",
        FLICKR_API_KEY: "KEY",
        CANON_CMS_REQUESTS_PER_SECOND: 60
      }
    }
  ]
};
```

## Usage

To run the app use [init.sh](init.sh):

```
> sudo bash init.sh develop
```

## Check status

```
> pm2 status

┌─────────────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬──────┬────────────┬──────┬──────────┐
│ App name        │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu  │ mem        │ user │ watching │
├─────────────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼──────┼────────────┼──────┼──────────┤
│ datamexico-site │ 0  │ 1.0.0   │ cluster │ 32072 │ online │ 100     │ 16D    │ 0.3% │ 185.0 MB   │ root │ disabled │
│ datamexico-site │ 1  │ 1.0.0   │ cluster │ 32078 │ online │ 100     │ 16D    │ 0.4% │ 176.1 MB   │ root │ disabled │
│ datamexico-site │ 2  │ 1.0.0   │ cluster │ 32097 │ online │ 86      │ 16D    │ 0.4% │ 192.1 MB   │ root │ disabled │
│ datamexico-site │ 3  │ 1.0.0   │ cluster │ 32109 │ online │ 84      │ 16D    │ 0.4% │ 183.5 MB   │ root │ disabled │
│ datamexico-site │ 4  │ 1.0.0   │ cluster │ 32127 │ online │ 84      │ 16D    │ 0.4% │ 186.9 MB   │ root │ disabled │
│ datamexico-site │ 5  │ 1.0.0   │ cluster │ 32147 │ online │ 84      │ 16D    │ 0.4% │ 180.6 MB   │ root │ disabled │
│ datamexico-site │ 6  │ 1.0.0   │ cluster │ 32165 │ online │ 86      │ 16D    │ 0.3% │ 188.1 MB   │ root │ disabled │
│ datamexico-site │ 7  │ 1.0.0   │ cluster │ 32184 │ online │ 84      │ 16D    │ 0.3% │ 181.4 MB   │ root │ disabled │
│ datamexico-site │ 8  │ 1.0.0   │ cluster │ 32205 │ online │ 84      │ 16D    │ 0.3% │ 183.4 MB   │ root │ disabled │
│ datamexico-site │ 9  │ 1.0.0   │ cluster │ 32225 │ online │ 84      │ 16D    │ 0.3% │ 182.9 MB   │ root │ disabled │
│ datamexico-site │ 10 │ 1.0.0   │ cluster │ 32256 │ online │ 84      │ 16D    │ 0.3% │ 179.9 MB   │ root │ disabled │
│ datamexico-site │ 11 │ 1.0.0   │ cluster │ 32273 │ online │ 85      │ 16D    │ 0.3% │ 185.5 MB   │ root │ disabled │
└─────────────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴──────┴────────────┴──────┴──────────┘
```

## Notes
- [official documentation](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) to get a service account key for `GOOGLE_APPLICATION_CREDENTIALS` 
- Centos - Canon Stats:
```
> sudo yum install -y python3-devel
> sudo pip3 install requests
> sudo pip3 install -r requirements.txt
```
