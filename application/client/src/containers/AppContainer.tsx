import { lazy, Suspense, type ReactNode, useCallback, useEffect, useId, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet";
import { Route, Routes, useLocation, useNavigate } from "react-router";

import { AppPage } from "@web-speed-hackathon-2026/client/src/components/application/AppPage";
import { AuthModalContainer } from "@web-speed-hackathon-2026/client/src/containers/AuthModalContainer";
import { TimelineContainer } from "@web-speed-hackathon-2026/client/src/containers/TimelineContainer";
import { fetchJSON, sendJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

const DirectMessageListContainer = lazy(async () => {
  const mod = await import(
    "@web-speed-hackathon-2026/client/src/containers/DirectMessageListContainer"
  );
  return { default: mod.DirectMessageListContainer };
});
const DirectMessageContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/DirectMessageContainer");
  return { default: mod.DirectMessageContainer };
});
const NewPostModalContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/NewPostModalContainer");
  return { default: mod.NewPostModalContainer };
});
const NotFoundContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/NotFoundContainer");
  return { default: mod.NotFoundContainer };
});
const PostContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/PostContainer");
  return { default: mod.PostContainer };
});
const SearchContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/SearchContainer");
  return { default: mod.SearchContainer };
});
const TermContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/TermContainer");
  return { default: mod.TermContainer };
});
const CrokContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/CrokContainer");
  return { default: mod.CrokContainer };
});
const UserProfileContainer = lazy(async () => {
  const mod = await import("@web-speed-hackathon-2026/client/src/containers/UserProfileContainer");
  return { default: mod.UserProfileContainer };
});

const Suspended = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={null}>{children}</Suspense>;
};

export const AppContainer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = useState<Models.User | null>(null);
  const [isLoadingActiveUser, setIsLoadingActiveUser] = useState(true);
  useEffect(() => {
    void fetchJSON<Models.User>("/api/v1/me")
      .then((user) => {
        setActiveUser(user);
      })
      .finally(() => {
        setIsLoadingActiveUser(false);
      });
  }, [setActiveUser, setIsLoadingActiveUser]);
  const handleLogout = useCallback(async () => {
    await sendJSON("/api/v1/signout", {});
    setActiveUser(null);
    navigate("/");
  }, [navigate]);

  const authModalId = useId();
  const newPostModalId = useId();
  const [shouldRenderNewPostModal, setShouldRenderNewPostModal] = useState(false);

  const handleOpenNewPostModal = useCallback(() => {
    const dialog = document.getElementById(newPostModalId);
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
      return;
    }
    setShouldRenderNewPostModal(true);
  }, [newPostModalId]);

  if (isLoadingActiveUser) {
    return (
      <HelmetProvider>
        <Helmet>
          <title>読込中 - CaX</title>
        </Helmet>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <AppPage
        activeUser={activeUser}
        authModalId={authModalId}
        onOpenNewPostModal={handleOpenNewPostModal}
        onLogout={handleLogout}
      >
        <Routes>
          <Route element={<TimelineContainer />} path="/" />
          <Route
            element={
              <Suspended>
                <DirectMessageListContainer activeUser={activeUser} authModalId={authModalId} />
              </Suspended>
            }
            path="/dm"
          />
          <Route
            element={
              <Suspended>
                <DirectMessageContainer activeUser={activeUser} authModalId={authModalId} />
              </Suspended>
            }
            path="/dm/:conversationId"
          />
          <Route
            element={
              <Suspended>
                <SearchContainer />
              </Suspended>
            }
            path="/search"
          />
          <Route
            element={
              <Suspended>
                <UserProfileContainer />
              </Suspended>
            }
            path="/users/:username"
          />
          <Route
            element={
              <Suspended>
                <PostContainer />
              </Suspended>
            }
            path="/posts/:postId"
          />
          <Route
            element={
              <Suspended>
                <TermContainer />
              </Suspended>
            }
            path="/terms"
          />
          <Route
            element={
              <Suspended>
                <CrokContainer activeUser={activeUser} authModalId={authModalId} />
              </Suspended>
            }
            path="/crok"
          />
          <Route
            element={
              <Suspended>
                <NotFoundContainer />
              </Suspended>
            }
            path="*"
          />
        </Routes>
      </AppPage>

      <AuthModalContainer id={authModalId} onUpdateActiveUser={setActiveUser} />
      {shouldRenderNewPostModal ? (
        <Suspended>
          <NewPostModalContainer id={newPostModalId} openOnMount={true} />
        </Suspended>
      ) : null}
    </HelmetProvider>
  );
};
