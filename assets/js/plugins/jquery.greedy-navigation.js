/* Right-aligned navigation with an accessible overflow menu on small screens. */
var $nav = $('#site-nav');
var $btn = $nav.children('button');
var $vlinks = $nav.children('.visible-links');
var $hlinks = $nav.children('.hidden-links');
var $tail = $vlinks.children('.tail');

function closeNavigation() {
  $hlinks.addClass('hidden');
  $btn.removeClass('close').attr('aria-expanded', 'false');
}

function updateNav() {
  $nav.addClass('js-nav');
  // Restore the original order before measuring; widths change with font loading.
  $hlinks.children().insertBefore($tail);
  $btn.addClass('hidden');
  $vlinks.css('width', $nav.width());
  while ($vlinks[0].scrollWidth > $vlinks[0].clientWidth + 1 &&
         $vlinks.children(':not(.persist)').length) {
    $btn.removeClass('hidden');
    $vlinks.css('width', $nav.width() - $btn.outerWidth() - 16);
    $vlinks.children(':not(.persist)').last().prependTo($hlinks);
  }
  $btn.attr('count', $hlinks.children().length);
  closeNavigation();
  var mastheadHeight = $('.masthead').outerHeight();
  $('body').css('padding-top', mastheadHeight + 'px');
  document.documentElement.style.setProperty('--site-masthead-height', mastheadHeight + 'px');
}

$(window).on('resize', updateNav);
if (screen.orientation && screen.orientation.addEventListener) {
  screen.orientation.addEventListener('change', updateNav);
}
$btn.on('click', function () {
  var isOpen = $btn.attr('aria-expanded') === 'true';
  $btn.attr('aria-expanded', String(!isOpen)).toggleClass('close', !isOpen);
  $hlinks.toggleClass('hidden', isOpen);
});
$(document).on('keydown', function (event) {
  if (event.key === 'Escape' && $btn.attr('aria-expanded') === 'true') {
    closeNavigation();
    $btn.trigger('focus');
  }
}).on('click', function (event) {
  if (!$nav[0].contains(event.target)) closeNavigation();
});
updateNav();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateNav);
