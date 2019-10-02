# Migration `20191001184820-init`

This migration has been generated at 10/1/2019, 6:48:20 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Server" (
  "containerId" text NOT NULL DEFAULT '' ,
  "createdAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "id" text NOT NULL  ,
  "updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "url" text NOT NULL DEFAULT '' ,
  "user" text NOT NULL DEFAULT '' ,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Server.url" ON "public"."Server"("url")

CREATE UNIQUE INDEX "Server.containerId" ON "public"."Server"("containerId")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20191001184820-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,17 @@
+datasource db {
+  provider = env("PRISMA_DB_PROVIDER")
+  url      = env("PRISMA_DB_URL")
+}
+
+generator photon {
+  provider = "photonjs"
+}
+
+model Server {
+  id        String   @default(cuid()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  url       String   @unique
+  containerId String @unique
+  user      String   
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20191001184820-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20191001184820-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
