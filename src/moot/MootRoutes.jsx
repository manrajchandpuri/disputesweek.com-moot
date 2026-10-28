import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MootLayout from "./MootLayout";
import ComingSoon from "./components/ComingSoon";

const Home = lazy(() => import("./pages/Home"));
const Problem = lazy(() => import("./pages/Problem"));
const Format = lazy(() => import("./pages/Format"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Registration = lazy(() => import("./pages/Registration"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));

// Mount inside the main app as <Route path="/moot/*" element={<MootRoutes />} />.
export default function MootRoutes({ assetBase = "" }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FBFBFA" }} />}>
      <Routes>
        <Route element={<MootLayout assetBase={assetBase} />}>
          <Route index element={<Home assetBase={assetBase} />} />
          <Route path="problem" element={<Problem />} />
          <Route path="format" element={<Format />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="registration" element={<Registration />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="rules"
            element={
              <ComingSoon
                meta="Rules of the Competition"
                eyebrow="Rules of the Competition"
                title="We are finalising the Rules of the Competition."
                body="The Rules will set out eligibility, word limits, citation style, scoring, the policy on the use of AI tools and the procedure for grievances. We will publish them before registration opens."
              />
            }
          />
          <Route
            path="clarifications"
            element={
              <ComingSoon
                meta="Clarifications"
                eyebrow="Requests for clarification"
                title="Registered teams will submit their questions about the problem here."
                body="We will open this page after we release the proposition. The Tribunal will then answer the questions it accepts in a further procedural order, which we will publish on this page."
              />
            }
          />
          <Route
            path="submissions"
            element={
              <ComingSoon
                meta="Memorandum submissions"
                eyebrow="Memorandum submissions"
                title="Registered teams will file their memoranda through this page."
                body="The submission portal will record the time of every filing and remove identifying details before any evaluator reads a memorandum. We will open it for registered teams during the written qualifier."
              />
            }
          />
          <Route path="*" element={<ComingSoon />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
