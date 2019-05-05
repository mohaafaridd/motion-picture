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
}

seenBtns.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const objects = e.path;
    const result = objects.find(obj => obj.nodeName.toLowerCase() === 'button');
    const classList = [...result.classList];

    // Get ID
    const id = getByRegex('^seen-([0-9]+)$', classList, 'seen-', true);
    const state = getByRegex('^btn-(warning|secondary)$', classList, 'btn-');
    // const idRegex = new RegExp(/^seen-([0-9]+)/);
    // const getIdClass = classList.find(obj => idRegex.test(obj));
    // const id = parseInt(getIdClass.split('seen-')[1], 10);
    // console.log(id);

    // // Get State
    // const stateRegex = new RegExp(/^btn-(warning|secondary)$/);
    // const getStateClass = classList.find(obj => stateRegex.test(obj));
    // const state = getStateClass.split('btn-')[1];

    result.disabled = true;

    const response = await axios({
      method: 'post',
      url: `/media/${id}/seen`,
    });

    if (state === 'warning') {
      result.classList.add('btn-secondary');
      result.classList.remove('btn-warning');
    } else if (state === 'secondary') {
      result.classList.add('btn-warning');
      result.classList.remove('btn-secondary');
    }

    result.disabled = false;

    let el = document.querySelector(':focus');
    if (el) el.blur();
  });
});
