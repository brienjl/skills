// Keep the ordinary in-page link usable if dialog enhancement is unavailable.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const opener = event.target instanceof Element
    ? event.target.closest('[data-open-dialog]')
    : null;
  if (!opener) return;

  const dialog = document.getElementById(opener.dataset.openDialog);
  if (!(dialog instanceof HTMLDialogElement) || typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  if (!dialog.open) dialog.showModal();
});
