create extension if not exists "vector" with schema "public" version '0.4.0';

create table "public"."documents" (
    "id" text not null
);


alter table "public"."documents" enable row level security;

create table "public"."paragraphs" (
    "id" text not null,
    "document_id" text not null,
    "content" text not null,
    "embeddings" vector not null
);


alter table "public"."paragraphs" enable row level security;

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE INDEX paragraphs_document_id_idx ON public.paragraphs USING btree (document_id);

CREATE UNIQUE INDEX paragraphs_pkey ON public.paragraphs USING btree (id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."paragraphs" add constraint "paragraphs_pkey" PRIMARY KEY using index "paragraphs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_n_similar_paragraphs(target_document_id text, query_embeddings vector, n integer)
 RETURNS TABLE(id text, document_id text, content text, similarity double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT 
      id, 
      document_id, 
      content, 
      1 - (embeddings <=> query_embeddings) AS similarity
    FROM paragraphs
    WHERE document_id = target_document_id
    ORDER BY 1 - (embeddings <=> query_embeddings) DESC
    LIMIT n;
END;
$function$
;

create policy "full access to anon"
on "public"."documents"
as permissive
for all
to anon
using (true)
with check (true);


create policy "Full access to anon"
on "public"."paragraphs"
as permissive
for all
to anon
using (true)
with check (true);