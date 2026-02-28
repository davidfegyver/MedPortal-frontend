import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import PatientSummary from "@/components/PatientSummary";
import PatientChat from "@/components/PatientChat";
import PatientMenu from "@/components/PatientMenu";
import DoctorProfile from "@/components/DoctorProfile";
import { Loader2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

const MIN_CHAT_WIDTH = 320;
const MAX_CHAT_WIDTH = 800;
const DEFAULT_CHAT_WIDTH = 380;

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<{ full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await api.getPatientData(id!);
        setPatient(p);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient:", err);
        navigate("/");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleMouseDown = () => setDragging(true);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setChatWidth(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <PatientMenu patientId={id!} />
          <DoctorProfile />
        </div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-foreground absolute left-1/2 -translate-x-1/2"
        >
          {patient?.full_name}
        </motion.h1>
        <div />
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Summary area */}
        <div className="flex-1 overflow-y-auto p-6">
          <PatientSummary patientId={id!} patientName={patient?.full_name || ""} />
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize flex items-center justify-center hover:bg-primary/10 transition-colors"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Chat panel - sticky, full height */}
        <div style={{ width: chatWidth }} className="flex-shrink-0 flex flex-col h-full">
          <div className="flex-1 min-h-0 p-4 pl-0">
            <PatientChat patientId={id!} patientName={patient?.full_name || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
