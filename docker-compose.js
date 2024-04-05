const workspaceRoot = process.env.WORKSPACE_ROOT;
const POSTGRES_DB = "postgres-backup-tool";
const POSTGRES_USER = "postgres";
const POSTGRES_PASSWORD = "postgres";

const config = {
  volumes: {
    "postgres-data": {},
  },
  services: {
    app: {
      image: "mucsi96/postgres-backup-tool:latest",
      environment: {
        SERVER_SERVLET_CONTEXT_PATH: "/db",
        SPRING_ACTUATOR_PORT: "8082",
        POSTGRES_HOSTNAME: "db",
        POSTGRES_PORT: "5432",
        POSTGRES_DB,
        POSTGRES_PASSWORD,
        POSTGRES_USER,
        AWS_S3_ENDPOINT_URL: "http://s3mock:9090",
        AWS_S3_ACCESS_KEY_ID: "foo",
        AWS_S3_SECRET_ACCESS_KEY: "bar",
        AWS_S3_BUCKET: "test-bucket",
        AWS_S3_REGION: "test-region",
        EXCLUDE_TABLES: "passwords,secrets",
      },
      ports: ["8080:8080"],
    },
    s3mock: {
      image: "adobe/s3mock:3.1.0",
    },
    db: {
      image: "postgres:16.2-bullseye",
      environment: {
        POSTGRES_DB,
        POSTGRES_PASSWORD,
        POSTGRES_USER,
      },
      volumes: [
        `${workspaceRoot}/db/create_tables.sql:/docker-entrypoint-initdb.d/create_tables.sql`,
      ],
    },
  },
};

console.log(JSON.stringify(config));
