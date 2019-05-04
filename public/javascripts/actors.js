/* eslint-disable no-undef */

$(document).ready(() => {
  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
        dots: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        loop: false,
      },
    },
  });
});
