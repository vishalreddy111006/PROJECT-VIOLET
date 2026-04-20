import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';

const BillboardsPage = () => {
  return (
    <div className="container-custom py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-display font-bold mb-8">Browse Billboards</h1>
        <div className="card text-center py-20">
          <FiGrid className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h2 className="text-2xl font-semibold mb-2">Billboards Page</h2>
          <p className="text-dark-600">Billboard listing and filtering coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
};
export default BillboardsPage;
