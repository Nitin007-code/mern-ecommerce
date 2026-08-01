import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

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
                    Premium Shopping Experience
                </span>

                <h1>
                    Discover Products
                    <br />
                    Designed for
                    <span> Everyday Life</span>
                </h1>

                <p>
                    Explore premium collections with fast delivery,
                    secure checkout and exceptional quality.
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

                    <button className="secondary-btn">
                        Explore Collection
                    </button>
                </div>
            </motion.div>
        </section>
    );
}