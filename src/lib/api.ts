const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  getPatients: async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/patients`);
    if (!res.ok) throw new Error("Failed to fetch patients");
    return res.json();
  },
  getPatientData: async (taj: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/patient/${taj}`);
    if (!res.ok) throw new Error("Patient not found");
    return res.json();
  },
  getDocuments: async (taj: string): Promise<{ documents: string[] }> => {
    const res = await fetch(`${API_BASE_URL}/documents/${taj}`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },
  getDocumentUrl: (filename: string): string => `${API_BASE_URL}/document/${filename}`,
  getFinalSummary: async (taj: string): Promise<{ summary: string }> => {
    const res = await fetch(`${API_BASE_URL}/final_summary/${taj}`);
    if (!res.ok) throw new Error("Summary not found");
    return res.json();
  },
  chat: async (taj: string, query: string): Promise<{ response: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taj, query })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Chat request failed");
    }
    return res.json();
  }
};
