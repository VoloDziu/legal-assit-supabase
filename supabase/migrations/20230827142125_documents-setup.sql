create extension if not exists "vector" with schema "public" version '0.4.0';

create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "doc_id" text not null,
    "content" text not null,
    "embedding" vector not null
);


alter table "public"."documents" enable row level security;

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";