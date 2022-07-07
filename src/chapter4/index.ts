import {
  AvatarCompleteEvent,
  AvatarErrorEvent,
  EVENTS,
} from "./components/GithubAvatar";

document.querySelectorAll("github-avatar").forEach((avatar) => {
  avatar.addEventListener(EVENTS.AVATAR_LOAD_COMPLETE, (e) => {
    const { detail } = e as AvatarCompleteEvent;

    console.log("Avatar Loaded", detail.avatar);
  });

  avatar.addEventListener(EVENTS.AVATAR_LOAD_ERROR, (e) => {
    const { detail } = e as AvatarErrorEvent;

    console.log("Avatar Loading error", detail.error);
  });
});
