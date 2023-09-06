CREATE OR REPLACE FUNCTION public.find_top_similar_paragraphs(
  target_document_id text, 
  query_embeddings vector(384), 
  n integer
) RETURNS TABLE(
  document_id text, 
  document_title text, 
  document_url text, 
  document_origin text, 
  paragraph_id text, 
  paragraph_content text, 
  similarity double precision
) LANGUAGE plpgsql AS $function$
BEGIN
  RETURN QUERY 
  SELECT 
    d.id AS document_id, 
    d.url AS document_url, 
    d.title AS document_title, 
    d.origin AS document_origin, 
    p.id AS paragraph_id, 
    p.content AS paragraph_content, 
    1 - (p.embeddings <=> query_embeddings) as similarity 
  FROM 
    Documents AS d 
    JOIN Paragraphs AS p ON d.id = p.document_id 
  WHERE 
    d.id = target_document_id
  ORDER BY 
    1 - (p.embeddings <=> query_embeddings) 
  DESC
  LIMIT 
    n;
END;
$function$;