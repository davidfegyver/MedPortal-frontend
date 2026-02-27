import { motion } from "framer-motion";

const DoctorProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-primary">
        DKA
      </div>
      <div className="hidden sm:flex flex-col">
        <span className="text-xs text-muted-foreground">Logged in as</span>
        <span className="text-sm font-semibold text-foreground">Dr. Kovács Anna</span>
      </div>
    </motion.div>
  );
};

export default DoctorProfile;
