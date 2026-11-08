import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import RouteMetadata from "./components/layout/RouteMetadata";
import AppErrorBoundary from "./components/layout/AppErrorBoundary";
import NotFound from "./pages/NotFound";

const Home = lazy(() => import("./pages/Home"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const About = lazy(() => import("./pages/About"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Inquiry = lazy(() => import("./pages/Inquiry"));
const BookSiteVisit = lazy(() => import("./pages/BookSiteVisit"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

const CompanySettings = lazy(() => import("./cms/pages/CompanySettings"));
const HeroManagement = lazy(() => import("./cms/pages/HeroManagement"));
const PropertyManagement = lazy(() => import("./cms/pages/PropertyManagement"));
const WebsiteContentManagement = lazy(() => import("./cms/pages/WebsiteContentManagement"));
const ManagementHome = lazy(() => import("./cms/pages/ManagementHome"));
const CmsLogin = lazy(() => import("./cms/pages/CmsLogin"));
const CmsLayout = lazy(() => import("./cms/components/CmsLayout"));
const CmsActivateAccount = lazy(() => import("./cms/pages/CmsActivateAccount"));
const CmsAccounts = lazy(() => import("./cms/pages/CmsAccounts"));
const EmployeeManagement = lazy(() => import("./cms/pages/EmployeeManagement"));
const MyAccount = lazy(() => import("./cms/pages/MyAccount"));

function App() {
  return (
    <>
      <ScrollToTop />
      <RouteMetadata />

      <AppErrorBoundary>
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/book-site-visit" element={<BookSiteVisit />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* CMS access and authenticated management pages */}
          <Route path="/manage/login" element={<CmsLogin />} />
          <Route path="/activate/:token" element={<CmsActivateAccount />} />
          <Route path="/manage/activate" element={<CmsActivateAccount />} />
          <Route path="/manage" element={<CmsLayout />}>
            <Route index element={<ManagementHome />} />
            <Route path="company-settings" element={<CompanySettings />} />
            <Route path="hero" element={<HeroManagement />} />
            <Route path="properties" element={<PropertyManagement />} />
            <Route path="content" element={<WebsiteContentManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="accounts" element={<CmsAccounts />} />
          </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </>
  );
}

export default App;
