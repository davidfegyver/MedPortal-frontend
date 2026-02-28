import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const formatTAJ = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
};

const TAJInput = () => {
  const [taj, setTaj] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const digits = taj.replace(/\D/g, "");

  const handleSearch = async () => {
    if (digits.length !== 9) return;
    setLoading(true);
    setError("");

    try {
      await api.getPatientData(digits);
      navigate(`/patient/${digits}`);
    } catch (err) {
      setError("TAJ number not found");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className={`bg-card rounded-2xl p-8 border border-border healthcare-shadow ${shaking ? "animate-shake" : ""}`}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-accent">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Patient Search</h2>
            <p className="text-sm text-primary">Enter patient's 9-digit TAJ number</p>
          </div>
        </div>

        <div className="mt-6">
          <Input
            value={taj}
            onChange={(e) => {
              setTaj(formatTAJ(e.target.value));
              setError("");
            }}
            placeholder="123 456 789"
            className={`w-full text-center text-xl tracking-[0.25em] h-14 font-mono ${error ? "border-destructive text-destructive" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <p className="text-sm text-muted-foreground text-center mt-2">
            Format: XXX XXX XXX ({digits.length}/9 digits)
          </p>
        </div>

        <Button
          onClick={handleSearch}
          disabled={loading || digits.length !== 9}
          className="w-full mt-5 h-12 healthcare-gradient text-primary-foreground text-base font-medium"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Patient
        </Button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm mt-3 font-medium text-center"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default TAJInput;
