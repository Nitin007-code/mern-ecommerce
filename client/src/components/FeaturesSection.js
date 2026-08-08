import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  Headphones
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={42} />,
    title: "Secure Payment",
    desc: "100% secure transactions with trusted payment gateways."
  },
  {
    icon: <Truck size={42} />,
    title: "Fast Delivery",
    desc: "Quick and reliable delivery across India."
  },
  {
    icon: <RefreshCcw size={42} />,
    title: "Easy Returns",
    desc: "Simple return policy for a hassle-free shopping experience."
  },
  {
    icon: <Headphones size={42} />,
    title: "24/7 Support",
    desc: "Friendly customer support whenever you need help."
  }
];

export default function FeaturesSection() {
  return (
    <section className="features-section">

      <div className="section-header">
        <h2>Why Choose ShopMax?</h2>

        <p>
          Everything you need for a smooth, secure and enjoyable shopping experience.
        </p>
      </div>

      <div className="features-grid">

        {features.map((item, index) => (

          <motion.div
            key={index}
            whileHover={{
              y: -10,
              scale: 1.03
            }}
            transition={{ duration: 0.3 }}
            className="feature-card"
          >

            <div className="feature-icon">

              {item.icon}

            </div>

            <h3>

              {item.title}

            </h3>

            <p>

              {item.desc}

            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
}