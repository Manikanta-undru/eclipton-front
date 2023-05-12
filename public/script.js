const counters = document.querySelectorAll(".counter");
const countersection = document.querySelector(".licensed-section");
const speed = 200; // The lower the slower
let flag = false;
countersection.addEventListener("mouseover", () => {
  if (!flag && window.innerWidth >= 768) {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;

        const inc = parseInt(target / speed);

        if (count < target) {
          counter.innerText = count + inc;
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
    flag = true;
  }
});
if (window.innerWidth < 768) {
  counters.forEach((counter) => {
    counter.innerText = counter.getAttribute("data-target");
  });
}
