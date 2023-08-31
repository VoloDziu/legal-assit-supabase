import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { vectorStore } from "../setup.ts";

// export const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
// };

serve(async (req) => {
  // // Handle CORS
  // if (req.method === "OPTIONS") {
  //   return new Response("ok", { headers: corsHeaders });
  // }

  // Search query is passed in request payload
  const { query, count } = await req.json();

  try {
    const results = await vectorStore.similaritySearch(query, count || 10);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }

  // return new Response(JSON.stringify(documents), {
  //   headers: { ...corsHeaders, "Content-Type": "application/json" },
  // });
});
