/* Administration éditoriale : cadre privé sur DashboardLayout, avec garde de rôle et continuité visuelle cuivre / encre. */
import { ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-6 text-[#12243b]">
        <div className="max-w-md border-l-2 border-[#b86e4b] pl-6">
          <ShieldAlert size={24} className="mb-5 text-[#b86e4b]" />
          <p className="eyebrow mb-3">Accès restreint</p>
          <h1 className="font-display text-4xl font-semibold leading-none">Cet espace est réservé à la rédaction.</h1>
          <p className="mt-4 text-sm leading-6 text-[#536174]">Votre compte est connecté, mais il ne dispose pas des droits nécessaires pour administrer les articles.</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
