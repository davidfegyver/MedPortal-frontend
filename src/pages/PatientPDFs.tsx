import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PDF {
  file_name: string;
  file_url: string;
}

const PatientPDFs = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (pdf: PDF) => {
    try {
      setDownloading(pdf.file_name);
      const response = await fetch(pdf.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdf.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { documents } = await api.getDocuments(id!);
        const pdfList = documents.map(filename => ({
          file_name: filename,
          file_url: api.getDocumentUrl(filename)
        }));
        setPdfs(pdfList);
      } catch (err) {
        console.error("Error fetching documents:", err);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/patient/${id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold text-foreground">Patient Documents</h1>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {pdfs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pdfs.map(pdf => (
              <div
                key={pdf.file_name}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:healthcare-shadow transition-shadow"
              >
                <FileText className="h-5 w-5 text-primary" />
                <a
                  href={pdf.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium text-foreground text-sm">{pdf.file_name}</p>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:text-primary/80 flex-shrink-0"
                  onClick={() => handleDownload(pdf)}
                  disabled={downloading === pdf.file_name}
                >
                  {downloading === pdf.file_name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientPDFs;
