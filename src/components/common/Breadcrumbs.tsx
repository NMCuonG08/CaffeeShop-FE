import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/": "Trang chủ",
  "/auth": "Xác thực",
  "/auth/signup": "Đăng ký",
  "/auth/login": "Đăng nhập",
  "/products": "Sản phẩm",
  "/products/shirts": "Áo sơ mi",
};

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="ms-5 mt-3 text-black">
      <Link to="/"  >Trang chủ</Link>
      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        return (
          <span key={to}>
            {" / "}
            <Link  to={to}>{breadcrumbNameMap[to] || value}</Link>
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
