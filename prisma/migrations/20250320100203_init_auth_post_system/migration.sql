-- Start transaction
BEGIN;

-- Check if the 'tags' column exists and handle it appropriately
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name='post' AND column_name='tags') THEN
        -- If the 'tags' column exists, alter it without dropping to preserve data
        ALTER TABLE "Post" ALTER COLUMN "tags" TYPE TEXT USING "tags"::TEXT;
    ELSE
        -- If the 'tags' column does not exist, simply add it
        ALTER TABLE "Post" ADD COLUMN "tags" TEXT;
    END IF;
END $$;

-- Create User table if it does not exist
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create a unique index on the 'email' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class c
                   JOIN pg_namespace n ON n.oid = c.relnamespace
                   WHERE c.relname = 'User_email_key' AND n.nspname = 'public') THEN
        CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
    END IF;
END $$;

-- Add foreign key constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_userId_fkey') THEN
        ALTER TABLE "Post"
        ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Commit transaction
COMMIT;

