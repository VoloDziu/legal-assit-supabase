import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { vectorStore } from "../setup.ts";
import { Document } from "langchain.document";

serve(async (req) => {
  const { docs }: { docs: Document[] } = await req.json();

  try {
    await vectorStore.addDocuments(docs);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
