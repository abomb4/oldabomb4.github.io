//
// This is a simple theme manager, dependence on jQuery, localStorage and bootstrap.
//
const themeManager = (function() {

  const THEME_CLASS_DARK = "theme-dark";
  const THEME_CLASS_LIGHT = "theme-light";
  const THEME_CLASS_DEFAULT = "theme-default";
  const THEME_CLASS_COLORFUL = "theme-colorful";

  const NAVBAR_DARK = "navbar-dark";
  const NAVBAR_LIGHT = "navbar-light";

  const BODY_CLASS_NAMES = [
    THEME_CLASS_DARK,
    THEME_CLASS_LIGHT,
    THEME_CLASS_DEFAULT,
    THEME_CLASS_COLORFUL
  ];

  const THEME_DARK = "dark";
  const THEME_LIGHT = "light";
  const THEME_COLORFUL = "colorful";
  const THEME_DEFAULT = "";

  const KEY_BLOG_THEME = "blog-theme";

  function init() {
    var theme = localStorage.getItem(KEY_BLOG_THEME);
    swtichTheme(theme);
  }

  // This function do not write to localStorage
  function swtichTheme(theme) {
    const bodyJq = $(document.body);
    const headerJq = $("#blog-header");
    for (const themeClass of BODY_CLASS_NAMES) {
      bodyJq.removeClass(themeClass);
    }

    headerJq.removeClass(NAVBAR_DARK);
    headerJq.removeClass(NAVBAR_LIGHT);

    switch (theme) {
      case THEME_DARK:
        bodyJq.addClass(THEME_CLASS_DARK);
        headerJq.addClass(NAVBAR_DARK);
        break;
      case THEME_LIGHT:
        bodyJq.addClass(THEME_CLASS_LIGHT);
        headerJq.addClass(NAVBAR_LIGHT);
        break;
      case THEME_COLORFUL:
        bodyJq.addClass(THEME_CLASS_COLORFUL);
        headerJq.addClass(NAVBAR_LIGHT);
        break;
      case THEME_DEFAULT:
      default:
        bodyJq.addClass(THEME_CLASS_DEFAULT);
        headerJq.addClass(NAVBAR_LIGHT);
        break;
    }
  }
  // This function change the localStorage
  function setTheme(newTheme) {
    localStorage.setItem(KEY_BLOG_THEME, newTheme);
    swtichTheme(newTheme);
  }

  return {
    init,
    setTheme
  }
})();

$(function() {
  themeManager.init();
});
