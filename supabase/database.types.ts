export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string;
          id: string;
          origin: string;
          title: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          origin: string;
          title: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          origin?: string;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      paragraphs: {
        Row: {
          content: string;
          created_at: string;
          document_id: string;
          embeddings: number[];
          id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          document_id: string;
          embeddings: number[];
          id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          document_id?: string;
          embeddings?: number[];
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "paragraphs_document_id_fkey";
            columns: ["document_id"];
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_top_similar_paragraphs: {
        Args: {
          target_document_id: string;
          query_embeddings: number[];
          n: number;
        };
        Returns: {
          document_id: string;
          document_title: string;
          document_url: string;
          document_origin: string;
          paragraph_id: string;
          paragraph_content: string;
          similarity: number;
        }[];
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
