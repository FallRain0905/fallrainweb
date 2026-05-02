import { NavCard } from "./nav-card";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  icon_url?: string | null;
}

interface CategoryItem {
  id: string;
  name: string;
  icon?: string | null;
  links: LinkItem[];
}

export function NavGroup({ category }: { category: CategoryItem }) {
  if (category.links.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        {category.icon && <span>{category.icon}</span>}
        {category.name}
        <span className="text-sm font-normal text-muted">({category.links.length})</span>
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.links.map((link) => (
          <NavCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
