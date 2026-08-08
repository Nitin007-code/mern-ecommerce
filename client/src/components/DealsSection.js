import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgePercent } from "lucide-react";

function DealsSection() {
  const deals = [
    { title: "Electronics", discount: "Up to 50% off", color: "#6a3ee8", category: "Electronics" },
    { title: "Fashion", discount: "Flat 40% off", color: "#d05c8c", category: "Clothing" },
    { title: "Footwear", discount: "Buy 1, get 1", color: "#d8722a", category: "Footwear" },
  ];

  const scrollToProducts = () => {
    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section id="deals" className="deals-section">
      <div className="section-header">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider text-violet-700 bg-violet-100 border border-violet-300 shadow-md shadow-violet-200/50 transition-all duration-300 hover:bg-violet-200 hover:border-violet-500 hover:-translate-y-0.5">
          🔥 Limited Time Offers
        </span>
        <h2>Today’s best deals</h2>
        <p>Fresh savings, picked for the way you shop.</p>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <article key={deal.title} className="deal-card" style={{ "--deal-color": deal.color }}>
            <div className="deal-icon"><BadgePercent size={25} /></div>
            <h3>{deal.title}</h3>
            <h1>{deal.discount}</h1>
            <Link
              to={{ pathname: "/", search: `?category=${encodeURIComponent(deal.category)}` }}
              onClick={scrollToProducts}
              className="primary-btn"
            >
              Browse collection
              <ArrowRight size={18} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DealsSection;
