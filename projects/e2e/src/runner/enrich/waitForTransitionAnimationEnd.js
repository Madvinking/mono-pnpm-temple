async function waitForTransitionAnimationEnd(selector, timeout) {
  await this.evaluate(
    (selector, timeout) =>
      Promise.race([
        new Promise(resolve => {
          const transition = document.querySelector(selector);
          const onEnd = function () {
            transition.removeEventListener('transitionend', onEnd);
            resolve();
          };

          transition.addEventListener('transitionend', onEnd);
        }),
        new Promise(resolve => setTimeout(resolve, timeout)),
      ]),
    selector,
    timeout,
  );
}

module.exports = {
  waitForTransitionAnimationEnd,
};
