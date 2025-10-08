import type { ReactNode } from "react";

// Base Card Component
interface BaseCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataAos?: string;
  dataAosDelay?: string;
}

export const BaseCard = ({
  children,
  className = "",
  onClick,
  dataAos,
  dataAosDelay
}: BaseCardProps) => {
  const baseClasses = "bg-white rounded-2xl shadow-md p-6 mb-4";
  const cardClasses = `${baseClasses} ${className}`;

  const aosProps = dataAos ? {
    "data-aos": dataAos,
    "data-aos-delay": dataAosDelay
  } : {};

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...aosProps}
    >
      {children}
    </div>
  );
};

// Profile Card Component
interface ProfileCardProps {
  children: ReactNode;
  className?: string;
  dataAos?: string;
  dataAosDelay?: string;
}

export const ProfileCard = ({
  children,
  className = "",
  dataAos = "fade-left",
  dataAosDelay = "150"
}: ProfileCardProps) => {
  return (
    <BaseCard
      className={className}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Information Card Component
interface InfoCardProps {
  children: ReactNode;
  className?: string;
  dataAos?: string;
  dataAosDelay?: string;
}

export const InfoCard = ({
  children,
  className = "",
  dataAos = "fade-right",
  dataAosDelay = "200"
}: InfoCardProps) => {
  return (
    <BaseCard
      className={className}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Action Card Component
interface ActionCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataAos?: string;
  dataAosDelay?: string;
}

export const ActionCard = ({
  children,
  className = "",
  onClick,
  dataAos = "fade-up",
  dataAosDelay = "100"
}: ActionCardProps) => {
  return (
    <BaseCard
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Medical Record Card Component
interface MedicalRecordCardProps {
  children: ReactNode;
  className?: string;
  dataAos?: string;
  dataAosDelay?: string;
}

export const MedicalRecordCard = ({
  children,
  className = "",
  dataAos = "fade-up",
  dataAosDelay = "100"
}: MedicalRecordCardProps) => {
  return (
    <BaseCard
      className={`bg-gradient-to-r from-blue-600 to-blue-400 text-white ${className}`}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Vital Signs Card Component
interface VitalSignsCardProps {
  label: string;
  value: string;
  className?: string;
  dataAos?: string;
  dataAosDelay?: string;
}

export const VitalSignsCard = ({
  label,
  value,
  className = "",
  dataAos = "zoom-in",
  dataAosDelay = "300"
}: VitalSignsCardProps) => {
  return (
    <div
      className={`p-4 bg-white rounded-xl shadow flex flex-col items-center ${className}`}
      data-aos={dataAos}
      data-aos-delay={dataAosDelay}
    >
      <h3 className="text-xs text-gray-500">{label}</h3>
      <p className="text-lg font-bold text-blue-700">{value}</p>
    </div>
  );
};

// Consultation Card Component
interface ConsultationCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataAos?: string;
  dataAosDelay?: string;
}

export const ConsultationCard = ({
  children,
  className = "",
  onClick,
  dataAos = "fade-left",
  dataAosDelay = "200"
}: ConsultationCardProps) => {
  return (
    <BaseCard
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Form Card Component
interface FormCardProps {
  children: ReactNode;
  className?: string;
  dataAos?: string;
  dataAosDelay?: string;
}

export const FormCard = ({
  children,
  className = "",
  dataAos = "fade-up",
  dataAosDelay = "200"
}: FormCardProps) => {
  return (
    <BaseCard
      className={className}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
};

// Appointment Card Component
interface AppointmentCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataAos?: string;
  dataAosDelay?: string;
}

export const AppointmentCard = ({
  children,
  className = "",
  onClick,
  dataAos = "fade-up",
  dataAosDelay = "150"
}: AppointmentCardProps) => {
  return (
    <BaseCard
      className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
      dataAos={dataAos}
      dataAosDelay={dataAosDelay}
    >
      {children}
    </BaseCard>
  );
}; 