const ERROR_IMAGE =
  "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_1280.png";
const LOADING_IMAGE =
  "https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968246_1280.png";

const AVATAR_LOAD_COMPLETE = "AVATAR_LOAD_COMPLETE";
const AVATAR_LOAD_ERROR = "AVATAR_LOAD_ERROR";

export const EVENTS = {
  AVATAR_LOAD_COMPLETE,
  AVATAR_LOAD_ERROR,
} as const;

export type AvatarCompleteEvent = CustomEvent<{ avatar: string }>;
export type AvatarErrorEvent = CustomEvent<{ error: Error }>;

const getGithubAvatarUrl = async (user: string): Promise<string> => {
  const response = await fetch(`https://api.github.com/users/${user}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data.avatar_url;
};

export default class GithubAvatar extends HTMLElement {
  private url: string;

  constructor() {
    super();
    this.url = LOADING_IMAGE;
  }

  get user() {
    return this.getAttribute("user") ?? "";
  }

  set user(url: string) {
    this.setAttribute("user", url);
  }

  render() {
    window.requestAnimationFrame(() => {
      const img = document.createElement("img");
      img.src = this.url;

      this.innerHTML = "";
      this.appendChild(img);
    });
  }

  onLoadAvatarComplete() {
    const event: AvatarCompleteEvent = new CustomEvent(AVATAR_LOAD_COMPLETE, {
      detail: {
        avatar: this.url,
      },
    });

    this.dispatchEvent(event);
  }

  onLoadAvatarError(error: Error) {
    const event: AvatarErrorEvent = new CustomEvent(AVATAR_LOAD_ERROR, {
      detail: {
        error,
      },
    });

    this.dispatchEvent(event);
  }

  async loadNewAvatar() {
    const { user } = this;

    if (!user) return;

    try {
      this.url = await getGithubAvatarUrl(user);
      this.onLoadAvatarComplete();
    } catch (e) {
      this.url = ERROR_IMAGE;

      if (e instanceof Error) {
        this.onLoadAvatarError(e);
      }
    }

    this.render();
  }

  connectedCallback() {
    this.render();
    this.loadNewAvatar();
  }
}

window.customElements.define("github-avatar", GithubAvatar);
