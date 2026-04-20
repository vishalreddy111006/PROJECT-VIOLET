import { FiShield, FiLock, FiCheckCircle } from 'react-icons/fi';

const AdminVerification = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <FiShield className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-dark-900">Autonomous Security</h1>
          <p className="text-dark-500">
            Project Violet uses end-to-end AI identity verification. To maintain user privacy and data security, individual verification scores are handled by the system core and are not accessible via the dashboard.
          </p>
        </div>
        <div className="p-4 bg-success/5 border border-success/10 rounded-xl flex items-center gap-3 text-success text-sm font-medium">
          <FiCheckCircle className="shrink-0" />
          System Status: All Identity Protocols Active
        </div>
      </div>
    </div>
  );
};

export default AdminVerification;