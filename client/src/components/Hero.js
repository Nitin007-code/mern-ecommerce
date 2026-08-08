import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Truck } from "lucide-react";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="floating floating1"></div>
            <div className="floating floating2"></div>
            <div className="floating floating3"></div>

            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className="hero-tag">
                    Curated everyday essentials
                </span>

                <h1>
                    Find better things
                    <br />
                    for your
                    <span> everyday life.</span>
                </h1>

                <p>
                    Discover thoughtful picks across tech, style, and home—delivered
                    quickly, with checkout that feels effortless.
                </p>

                <div className="hero-buttons">
                    <button
                        className="primary-btn"
                        onClick={() => {
                            document.getElementById("products")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });
                        }}
                    >
                        Shop Now
                        <ArrowRight size={18} />
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        <Play size={16} fill="currentColor" />
                        See today's deals
                    </button>
                </div>

                <div className="hero-proof">
                    <span><Truck size={17} /> Free delivery over ₹499</span>
                    <span><ShieldCheck size={17} /> Secure payments</span>
                </div>
            </motion.div>
        </section>
    );
}
