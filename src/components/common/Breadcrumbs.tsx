import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useProductName } from "@/features/product/hooks/useProduct";

const breadcrumbNameMap = {
  "/": "Trang chủ",
  "/auth": "Xác thực",
  "/auth/signup": "Đăng ký",
  "/auth/login": "Đăng nhập",
  "/products": "Sản phẩm",
  "/products/shirts": "Áo sơ mi",
  "/checkout": "Chuẩn bị thanh toán",
  "/cart": "Giỏ hàng",
  "/profile": "Hồ sơ",
  "/orders": "Đơn hàng",
  "/payment": "Thanh toán",
   "/payment/success": "Thanh toán thành công",
  "/payment/failed": "Thanh toán thất bại",
  "/admin": "Quản trị",
  "/admin/products": "Quản lý sản phẩm",
};

// Component riêng để handle product breadcrumb
const ProductBreadcrumb = ({ productId, isLast, to }: { 
  productId: string; 
  isLast: boolean; 
  to: string; 
}) => {
  const { product, loading } = useProductName(Number(productId));
  
  const displayName = loading ? "Loading..." : (product?.product || productId);

  if (isLast) {
    return (
      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform">
        {displayName}
      </span>
    );
  }

  return (
    <Link 
      to={to}
      className="text-amber-700 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 transition-all duration-300 px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-lg transform hover:scale-105 border border-transparent hover:border-amber-300"
    >
      {displayName}
    </Link>
  );
};

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === '/') {
    return null;
  }

  // Helper function để check nếu path segment là product ID
  const isProductId = (value: string, index: number) => {
    return pathnames[index - 1] === 'products' && !isNaN(Number(value));
  };

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-1 text-sm">
          {/* Home Link */}
          <li>
            <Link 
              to="/" 
              className="flex items-center text-amber-700 hover:text-amber-900 transition-all duration-300 hover:bg-amber-100 px-3 py-2 rounded-lg group shadow-sm hover:shadow-md"
            >
              <Home className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Trang chủ</span>
            </Link>
          </li>

          {/* Breadcrumb Items */}
          {pathnames.map((value, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            return (
              <li key={to} className="flex items-center">
                {/* Separator */}
                <div className="mx-2 p-1">
                  <ChevronRight className="h-4 w-4 text-amber-500 animate-pulse" />
                </div>
                
                {/* Breadcrumb Link or Text */}
                {isProductId(value, index) ? (
                  <ProductBreadcrumb 
                    productId={value} 
                    isLast={isLast} 
                    to={to} 
                  />
                ) : isLast ? (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform">
                    {breadcrumbNameMap[to] || value}
                  </span>
                ) : (
                  <Link 
                    to={to}
                    className="text-amber-700 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 transition-all duration-300 px-3 py-2 rounded-lg font-medium shadow-sm hover:shadow-lg transform hover:scale-105 border border-transparent hover:border-amber-300"
                  >
                    {breadcrumbNameMap[to] || value}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumbs;