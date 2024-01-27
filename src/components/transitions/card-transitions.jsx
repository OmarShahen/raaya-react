import { motion } from "framer-motion"

const CardTransition = ({ children }) => {
  return (
    <motion.div
    className="card"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default CardTransition