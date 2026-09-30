import { lazy } from "react";
import { Route, Routes } from "react-router";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/Home";

const Courses = lazy(() => import("@/pages/Courses"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Learn = lazy(() => import("@/pages/Learn"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Project = lazy(() => import("@/pages/Project"));
const CourseCertificate = lazy(() => import("@/pages/CourseCertificate"));
const Paths = lazy(() => import("@/pages/Paths"));
const QuickCourses = lazy(() => import("@/pages/QuickCourses"));
const QuickCourse = lazy(() => import("@/pages/QuickCourse"));
const Projects = lazy(() => import("@/pages/Projects"));
const Certificates = lazy(() => import("@/pages/Certificates"));
const Verify = lazy(() => import("@/pages/Verify"));
const About = lazy(() => import("@/pages/About"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const UpdatePassword = lazy(() => import("@/pages/auth/UpdatePassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CertificateView = lazy(() => import("@/pages/CertificateView"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminCourses = lazy(() => import("@/pages/admin/AdminCourses"));
const AdminCourseEditor = lazy(() => import("@/pages/admin/AdminCourseEditor"));
const AdminLessonEditor = lazy(() => import("@/pages/admin/AdminLessonEditor"));
const AdminAssessment = lazy(() => import("@/pages/admin/AdminAssessment"));
const AdminStudents = lazy(() => import("@/pages/admin/AdminStudents").then((m) => ({ default: m.AdminStudents })));
const AdminStudent = lazy(() => import("@/pages/admin/AdminStudents").then((m) => ({ default: m.AdminStudent })));
const AdminCertificates = lazy(() => import("@/pages/admin/AdminCertificates"));
const AdminSubmissions = lazy(() => import("@/pages/admin/AdminSubmissions"));

/** Route tree shared by the browser (BrowserRouter) and the prerenderer (StaticRouter). */
export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="courses/:slug/assessment" element={<Assessment />} />
          <Route path="courses/:slug/project" element={<Project />} />
          <Route path="courses/:slug/certificate" element={<CourseCertificate />} />
          <Route path="learn/:course/:lesson" element={<Learn />} />
          <Route path="quick" element={<QuickCourses />} />
          <Route path="quick/:slug" element={<QuickCourse />} />
          <Route path="paths" element={<Paths />} />
          <Route path="projects" element={<Projects />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="verify/:credentialId" element={<Verify />} />
          <Route path="about" element={<About />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/certificates/:credentialId" element={<CertificateView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/:slug" element={<AdminCourseEditor />} />
            <Route path="courses/:slug/lessons/:lessonId" element={<AdminLessonEditor />} />
            <Route path="courses/:slug/assessment" element={<AdminAssessment />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:userId" element={<AdminStudent />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="certificates" element={<AdminCertificates />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

