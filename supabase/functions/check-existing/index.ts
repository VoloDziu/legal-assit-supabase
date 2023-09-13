import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../db.ts";

serve(async (req) => {
  const { documentIds }: { documentIds: string[] } = await req.json();
  {
    const { data, error } = await supabase
      .from("documents")
      .select()
      .in("id", documentIds);

    let result = data;

    if (error) {
      result = [];
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});
