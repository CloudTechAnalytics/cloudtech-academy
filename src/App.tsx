import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/lib/auth";
import { CommunityProvider } from "@/lib/community";
import Home from "@/pages/Home";

const Courses = lazy(() => import("@/pages/Courses"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Learn = lazy(() => import("@/pages/Learn"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Project = lazy(() => import("@/pages/Project"));
const CourseComplete = lazy(() => import("@/pages/CourseComplete"));
const ProgrammePurchase = lazy(() => import("@/pages/ProgrammePurchase"));
const CoursePurchase = lazy(() => import("@/pages/CoursePurchase"));
const CertificatePurchase = lazy(() => import("@/pages/CertificatePurchase"));
const ProgrammeCertificate = lazy(() => import("@/pages/ProgrammeCertificate"));
const CredentialView = lazy(() => import("@/pages/CredentialView"));
function TrackRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/programmes/${slug ?? ""}`} replace />;
}

const TracksList = lazy(() => import("@/pages/Tracks").then((m) => ({ default: m.TracksList })));
const TrackDetail = lazy(() => import("@/pages/Tracks").then((m) => ({ default: m.TrackDetail })));
const Students = lazy(() => import("@/pages/Students"));
const LearnerProfile = lazy(() => import("@/pages/LearnerProfile"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Certificates = lazy(() => import("@/pages/Certificates"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const Community = lazy(() => import("@/pages/Community"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const Verify = lazy(() => import("@/pages/Verify"));
const VerifySearch = lazy(() => import("@/pages/Verify").then((m) => ({ default: m.VerifySearch })));
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
const AdminEvents = lazy(() => import("@/pages/admin/AdminEvents"));
const AdminEventForm = lazy(() => import("@/pages/admin/AdminEventForm"));
const AdminEventRegistrations = lazy(() => import("@/pages/admin/AdminEventRegistrations"));
const AdminCommunity = lazy(() => import("@/pages/admin/AdminCommunity"));
const AdminTracking = lazy(() => import("@/pages/admin/AdminTracking"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminCertificates = lazy(() => import("@/pages/admin/AdminCertificates"));
const AdminCertificatePayments = lazy(() => import("@/pages/admin/AdminCertificates").then((m) => ({ default: m.AdminCertificatePayments })));
const AdminCertificateIssue = lazy(() => import("@/pages/admin/AdminCertificateForm").then((m) => ({ default: m.AdminCertificateIssue })));
const AdminCertificateEdit = lazy(() => import("@/pages/admin/AdminCertificateForm").then((m) => ({ default: m.AdminCertificateEdit })));
const AdminCertificateDetail = lazy(() => import("@/pages/admin/AdminCertificateDetail"));
const AdminCredentials = lazy(() => import("@/pages/admin/AdminCredentials"));
const AdminEnrollments = lazy(() => import("@/pages/admin/AdminProgrammes").then((m) => ({ default: m.AdminEnrollments })));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminProgrammes").then((m) => ({ default: m.AdminAnalytics })));
const AdminProgrammes = lazy(() => import("@/pages/admin/AdminProgrammeEditor").then((m) => ({ default: m.AdminProgrammes })));
const AdminProgrammeEditor = lazy(() => import("@/pages/admin/AdminProgrammeEditor").then((m) => ({ default: m.AdminProgrammeEditor })));
const AdminEmails = lazy(() => import("@/pages/admin/AdminEmails"));
const AdminSubmissions = lazy(() => import("@/pages/admin/AdminSubmissions"));
const AdminPracticeProjects = lazy(() => import("@/pages/admin/AdminPracticeProjects"));

/** Route tree shared by the browser (BrowserRouter) and the prerenderer (StaticRouter). */
export function AppRoutes() {
  return (
    <AuthProvider>
      <CommunityProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="courses/:slug/assessment" element={<Assessment />} />
          <Route path="courses/:slug/project" element={<Project />} />
          <Route path="courses/:slug/modules/:moduleId/check" element={<Assessment />} />
          <Route path="courses/:slug/complete" element={<CourseComplete />} />
          <Route path="courses/:slug/enroll" element={<CoursePurchase />} />
          <Route path="courses/:slug/certificate" element={<CertificatePurchase />} />
          <Route path="credentials/:credentialId" element={<CredentialView />} />
          <Route path="learn/:course/:lesson" element={<Learn />} />
          <Route path="programmes" element={<TracksList />} />
          <Route path="programmes/:slug" element={<TrackDetail />} />
          <Route path="programmes/:slug/enroll" element={<ProgrammePurchase />} />
          <Route path="programmes/:slug/certificate" element={<ProgrammeCertificate />} />
          <Route path="tracks" element={<Navigate to="/programmes" replace />} />
          <Route path="tracks/:slug" element={<TrackRedirect />} />
          <Route path="paths" element={<Navigate to="/programmes/data-analyst" replace />} />
          <Route path="students" element={<Students />} />
          <Route path="learners/:slug" element={<LearnerProfile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetail />} />
          <Route path="community" element={<Community />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="verify" element={<VerifySearch />} />
          <Route path="verify/:credentialId" element={<Verify />} />
          <Route path="about" element={<About />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/certificates/:certificateId" element={<CertificateView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route path="programmes" element={<AdminProgrammes />} />
            <Route path="programmes/:slug" element={<AdminProgrammeEditor />} />
            <Route path="emails" element={<AdminEmails />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route index element={<AdminOverview />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/:slug" element={<AdminCourseEditor />} />
            <Route path="courses/:slug/lessons/:lessonId" element={<AdminLessonEditor />} />
            <Route path="courses/:slug/assessment" element={<AdminAssessment />} />
            <Route path="courses/:slug/modules/:moduleId/assessment" element={<AdminAssessment />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:userId" element={<AdminStudent />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="practice" element={<AdminPracticeProjects />} />
            <Route path="credentials" element={<AdminCredentials />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<AdminEventForm />} />
            <Route path="events/:eventId" element={<AdminEventForm />} />
            <Route path="events/:eventId/registrations" element={<AdminEventRegistrations />} />
            <Route path="community" element={<AdminCommunity />} />
            <Route path="settings" element={<Navigate to="/admin/settings/community" replace />} />
            <Route path="settings/community" element={<AdminSettings />} />
            <Route path="settings/tracking" element={<AdminTracking />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="certificates/payments" element={<AdminCertificatePayments />} />
            <Route path="certificates/new" element={<AdminCertificateIssue mode="new" />} />
            <Route path="certificates/:certificateId" element={<AdminCertificateDetail />} />
            <Route path="certificates/:certificateId/edit" element={<AdminCertificateEdit />} />
            <Route path="certificates/:certificateId/reissue" element={<AdminCertificateIssue mode="reissue" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </CommunityProvider>
    </AuthProvider>
  );
}

