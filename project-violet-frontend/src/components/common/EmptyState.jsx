import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      {Icon && (
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-50 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary-600" />
        </div>
      )}
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-dark-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
