class UserAgentService {
  private userAgent: string;
  private userAgentData: NavigatorUAData | undefined;

  constructor() {
    this.userAgent = window.navigator.userAgent;
    this.userAgentData = window.navigator.userAgentData;
  }

  isMobile() {
    return this.userAgentData
      ? this.userAgentData.mobile
      : /Mobi/gi.test(this.userAgent);
  }

  isIE() {
    return /Trident|MSIE/gi.test(this.userAgent);
  }
}

export default new UserAgentService();
