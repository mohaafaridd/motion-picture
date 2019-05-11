/* eslint-disable no-undef */
const seenBtns = document.querySelectorAll('.seen');

// seenBtns.length;

const getByRegex = (regex, classList, filter, convertToIntFlag = false) => {
  const reg = new RegExp(regex);
  const classFound = classList.find(obj => reg.test(obj));
  const wanted = classFound.split(filter)[1];

  if (convertToIntFlag) {
    return parseInt(wanted, 10);
  }

  return wanted;
};

seenBtns.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const objects = e.path;
    const result = objects.find(obj => obj.nodeName.toLowerCase() === 'button');
    result.disabled = true;
    try {
      const classList = [...result.classList];
      // Get ID
      const id = getByRegex('^seen-([0-9]+)$', classList, 'seen-', true);
      const state = getByRegex('^btn-(warning|secondary)$', classList, 'btn-');

      if (state === 'warning') {
        result.classList.add('btn-secondary');
        result.classList.remove('btn-warning');
      } else if (state === 'secondary') {
        result.classList.add('btn-warning');
        result.classList.remove('btn-secondary');
      }
      result.disabled = false;

      const el = document.querySelector(':focus');
      if (el) el.blur();

      await axios({
        method: 'post',
        url: `/media/${id}/seen`,
      });
    } catch (error) {
      result.disabled = false;
    }
  });
});
