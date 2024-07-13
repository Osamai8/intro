import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import animation from "@/public/formloadAnimation.json";
const OrderAnimation = () => {
    return (
        <div className="flex items-center justify-center flex-col mt-24">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                Preparing your order ✨
            </motion.h1>
            <Player autoplay loop src={animation} style={{ transform: 'scale(2)' }} />
        </div>
    )
}

export default OrderAnimation;
