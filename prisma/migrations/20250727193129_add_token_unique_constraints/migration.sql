-- Add unique constraints to token fields
ALTER TABLE "users" ADD CONSTRAINT "users_emailChangeToken_key" UNIQUE ("emailChangeToken");
ALTER TABLE "users" ADD CONSTRAINT "users_emailVerificationToken_key" UNIQUE ("emailVerificationToken");
ALTER TABLE "users" ADD CONSTRAINT "users_passwordResetToken_key" UNIQUE ("passwordResetToken");

-- Add foreign key constraint for security_events
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add composite index for security_events
CREATE INDEX "security_events_userId_type_timestamp_idx" ON "security_events"("userId", "type", "timestamp");