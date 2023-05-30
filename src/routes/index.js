import * as React from "react";
import { Routes, Route } from "react-router-dom";

import ChapterContent from "../features/chapter/ChapterContent";

import Subscription from "../features/user/Subscription";

import BlankLayout from "../layouts/BlankLayout";
import MainLayout from "../layouts/MainLayout";
import AccountPage from "../pages/AccountPage";
import CreateStoryAndChapterPage from "../pages/CreateStoryAndChapterPage";
import EditStoryAndChapterPage from "../pages/EditStoryAndChapterPage";
import DetailPage from "../pages/DetailPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import AllHotStoriesWithPagination from "../features/story/AllHotStoriesWithPagination";
import AllLoveStoriesWithPagination from "../features/story/AllLoveStoriesWithPagination";
import AllSearchStories from "../features/story/AllSearchStories";
import AllStoriesWithPagination from "../features/story/AllStoriesWithPagination";
import LovedStoriesListOfUser from "../features/story/LovedStoriesListOfUser";
import StoryWithAuthorName from "../pages/StoryWithAuthorName";
import StoryWithArtist from "../pages/StoryWithArtist";
import AdminPage from "../pages/AdminPage";
import ChapterCreate from "../features/chapter/ChapterCreate";

// import AuthRequire from "./AuthRequire";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="story/:id" element={<DetailPage />} />
        <Route path="admin" element={<AdminPage />} />

        <Route
          path="account/editstory/:id"
          element={<EditStoryAndChapterPage />}
        />
        <Route
          path="/story/create"
          element={
            // <SubRequire>
            <CreateStoryAndChapterPage />
            // </SubRequire> todo
          }
        />

        <Route path="/author/:authorName" element={<StoryWithAuthorName />} />
        <Route path="/artist/:artist" element={<StoryWithArtist />} />
        <Route path="stories/:genres" element={<AllStoriesWithPagination />} />
        <Route
          path="stories/hot-stories"
          element={<AllHotStoriesWithPagination />}
        />
        <Route
          path="stories/love-stories"
          element={<AllLoveStoriesWithPagination />}
        />
        <Route path="favorite" element={<LovedStoriesListOfUser />} />

        <Route path="/login" element={<LoginPage />} />
        {/* toask: tại sao LoginPage k nằm trong AuthRequire mà vẫn xài useLocation được */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/account" element={<AccountPage />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/chapter/:id" element={<ChapterContent />} />
        <Route path="/search" element={<AllSearchStories />} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
