import { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Props {
  patientId: string;
  patientName: string;
}

const PatientSummary = ({ patientId, patientName }: Props) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const { summary } = await api.getFinalSummary(patientId);
        setSummary(summary);
        setError(null);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Failed to load medical summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [patientId]);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border healthcare-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Medical Summary</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating summary for {patientName}...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-destructive text-sm py-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="text-foreground text-sm leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown>{summary || ""}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default PatientSummary;
