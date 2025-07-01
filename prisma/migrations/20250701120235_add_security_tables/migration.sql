-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "duration" INTEGER,
    "key" TEXT,
    "tempo" INTEGER,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bandName" TEXT,
    "eventName" TEXT,
    "eventDate" TIMESTAMP(3),
    "openTime" TEXT,
    "startTime" TEXT,
    "theme" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setlist_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "order" INTEGER NOT NULL,
    "setlistId" TEXT NOT NULL,

    CONSTRAINT "setlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_entries" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "resource" TEXT,
    "details" JSONB,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_activities" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "userId" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "threat_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "setlist_items_setlistId_order_key" ON "setlist_items"("setlistId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_entries_key_key" ON "rate_limit_entries"("key");

-- CreateIndex
CREATE INDEX "rate_limit_entries_resetTime_idx" ON "rate_limit_entries"("resetTime");

-- CreateIndex
CREATE INDEX "security_events_timestamp_idx" ON "security_events"("timestamp");

-- CreateIndex
CREATE INDEX "security_events_ipAddress_idx" ON "security_events"("ipAddress");

-- CreateIndex
CREATE INDEX "security_events_type_idx" ON "security_events"("type");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");

-- CreateIndex
CREATE INDEX "threat_activities_ipAddress_timestamp_idx" ON "threat_activities"("ipAddress", "timestamp");

-- CreateIndex
CREATE INDEX "threat_activities_activityType_idx" ON "threat_activities"("activityType");

-- CreateIndex
CREATE INDEX "threat_activities_timestamp_idx" ON "threat_activities"("timestamp");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setlists" ADD CONSTRAINT "setlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setlist_items" ADD CONSTRAINT "setlist_items_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "setlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
