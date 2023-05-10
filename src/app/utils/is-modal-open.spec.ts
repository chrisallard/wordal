import { MODAL_BODY_CLASS, SIDE_NAV_BODY_CLASS } from '@app/config/app.config';
import { isModalOpen } from './is-modal-open.utils';

describe('isModalOpen', () => {
  let bodyClasses: DOMTokenList;

  beforeEach(() => {
    bodyClasses = document.body.classList;
    expect(bodyClasses.contains(MODAL_BODY_CLASS)).toBeFalse();
    expect(bodyClasses.contains(SIDE_NAV_BODY_CLASS)).toBeFalse();
  });

  afterEach(() => {
    bodyClasses.remove(MODAL_BODY_CLASS, SIDE_NAV_BODY_CLASS);
  });

  it('should return true if the body tag has modal classes', () => {
    bodyClasses.add(MODAL_BODY_CLASS);
    expect(bodyClasses.contains(MODAL_BODY_CLASS)).toBeTrue();

    let isOpen = isModalOpen();
    expect(isOpen).toBeTrue();

    bodyClasses.remove(MODAL_BODY_CLASS);
    expect(bodyClasses.contains(MODAL_BODY_CLASS)).toBeFalse();

    bodyClasses.add(SIDE_NAV_BODY_CLASS);
    expect(bodyClasses.contains(SIDE_NAV_BODY_CLASS)).toBeTrue();

    isOpen = isModalOpen();
    expect(isOpen).toBeTrue();
  });

  it('should return false if the body tag doesnt have the modal classes', () => {
    const isOpen = isModalOpen();
    expect(isOpen).toBeFalse();
  });
});
