import { MODAL_BODY_CLASS, SIDE_NAV_BODY_CLASS } from '@app/config/app.config';
export function isModalOpen(): boolean {
  const bodyClasses = document.body.classList;
  const isModalOpen =
    bodyClasses.contains(MODAL_BODY_CLASS) ||
    bodyClasses.contains(SIDE_NAV_BODY_CLASS);

  return isModalOpen;
}
