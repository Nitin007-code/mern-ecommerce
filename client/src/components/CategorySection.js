import { Link, useNavigate } from "react-router-dom";
import { Headphones, Shirt, Footprints, Watch, Armchair, Gamepad2 } from "lucide-react";

const categories = [
  { icon: Headphones, title: "Electronics", query: "Electronics" },
  { icon: Shirt, title: "Fashion", query: "Clothing" },
  { icon: Footprints, title: "Footwear", query: "Footwear" },
  { icon: Watch, title: "Accessories", query: "Accessories" },
  { icon: Armchair, title: "Home & Living", query: "Home & Living" },
  { icon: Gamepad2, title: "Gaming", query: "Gaming" },
];

export default function CategorySection() {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const showAllProducts = () => {
    navigate("/");
    requestAnimationFrame(scrollToProducts);
  };

  return (
    <section id="categories" className="category-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Find your next favourite</span>
          <h2>Shop by category</h2>
        </div>
        <button type="button" className="text-link" onClick={showAllProducts}>View all</button>
      </div>

      <div className="category-grid">
        {categories.map(({ icon: Icon, title, query }) => (
          <Link
            key={title}
            to={query ? { pathname: "/", search: `?category=${encodeURIComponent(query)}` } : "/"}
            onClick={scrollToProducts}
            className="category-card"
          >
            <span><Icon size={27} /></span>
            <strong>{title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
