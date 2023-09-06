-- Create extension if not exists "vector" with schema "public" version '0.4.0';
CREATE EXTENSION IF NOT EXISTS "vector"
WITH SCHEMA "public" VERSION '0.4.0';

-- Create table "public"."documents"
CREATE TABLE "public"."documents" (
    "id" text NOT NULL,
    "created_at" timestamp WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "title" text NOT NULL,
    "url" text NOT NULL,
    "origin" text NOT NULL
);

-- Enable row level security for table "public"."documents"
ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;

-- Create table "public"."paragraphs"
CREATE TABLE "public"."paragraphs" (
    "id" text NOT NULL,
    "created_at" timestamp WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "document_id" text NOT NULL,
    "content" text NOT NULL,
    "embeddings" vector(384) NOT NULL
);

-- Enable row level security for table "public"."paragraphs"
ALTER TABLE "public"."paragraphs" ENABLE ROW LEVEL SECURITY;

-- Create unique index "documents_pkey" for table "public.documents"
CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

-- Add primary key constraint "documents_pkey" to table "public.documents"
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_pkey" PRIMARY KEY USING INDEX "documents_pkey";

-- Create unique index "paragraphs_pkey" for table "public.paragraphs"
CREATE UNIQUE INDEX paragraphs_pkey ON public.paragraphs USING btree (id);

-- Add primary key constraint "paragraphs_pkey" to table "public.paragraphs"
ALTER TABLE "public"."paragraphs" ADD CONSTRAINT "paragraphs_pkey" PRIMARY KEY USING INDEX "paragraphs_pkey";

-- Add foreign key constraint "paragraphs_document_id_fkey" to table "public.paragraphs"
ALTER TABLE "public"."paragraphs" ADD CONSTRAINT "paragraphs_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE NOT VALID;

-- Validate foreign key constraint "paragraphs_document_id_fkey" on table "public.paragraphs"
ALTER TABLE "public"."paragraphs" VALIDATE CONSTRAINT "paragraphs_document_id_fkey";

-- Create policy "Enable access to anon" on "public"."documents"
CREATE POLICY "Enable access to anon" ON "public"."documents" AS PERMISSIVE FOR ALL TO anon USING (true)
WITH CHECK (true);

-- Create policy "Enable access to anon" on "public"."paragraphs"
CREATE POLICY "Enable access to anon" ON "public"."paragraphs" AS PERMISSIVE FOR ALL TO anon USING (true)
WITH CHECK (true);
