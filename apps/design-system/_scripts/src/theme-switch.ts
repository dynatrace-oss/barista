export function themeSwitcher() {
  const themeSwitch = document.querySelector('.ds-theme-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      if (document.body.classList.contains('fluid-theme--abyss')) {
        document.body.classList.remove('fluid-theme--abyss');
        document.body.classList.add('fluid-theme--surface');
      } else {
        document.body.classList.add('fluid-theme--abyss');
        document.body.classList.remove('fluid-theme--surface');
      }
    });
  }
}
