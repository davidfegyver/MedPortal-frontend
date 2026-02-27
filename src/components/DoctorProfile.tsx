import { User } from "lucide-react";

const DoctorProfile = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center overflow-hidden">
        <User className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-sm font-medium text-foreground hidden sm:block">
        Doctor
      </span>
    </div>
  );
};

export default DoctorProfile;
