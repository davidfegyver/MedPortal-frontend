import DoctorProfile from "@/components/DoctorProfile";
import TAJInput from "@/components/TAJInput";
import { Stethoscope, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <DoctorProfile />
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">MedPortal</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center gap-2 justify-center mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Patient Lookup</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Patient Lookup</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search patient records by TAJ number to view medical history, prescriptions, and appointments.
          </p>
        </motion.div>

        <TAJInput />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 MedPortal — Your data is protected under GDPR regulations.
        </p>
      </footer>
    </div>
  );
};

export default Index;
