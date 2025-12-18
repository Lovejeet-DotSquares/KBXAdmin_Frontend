import { Link } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

const Breadcrumbs = () => {
    const crumbs = useBreadcrumbs();

    return (
        <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
                {crumbs.map((c, index) => (
                    <li
                        key={index}
                        className={`breadcrumb-item ${index === crumbs.length - 1 ? "active" : ""
                            }`}
                    >
                        {index === crumbs.length - 1 ? (
                            c.name
                        ) : (
                            <Link to={c.path}>{c.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
