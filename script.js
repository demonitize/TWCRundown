let crawlIndex = 0;
const container = document.getElementById('container');
const elCrawl = document.getElementById('crawl');
const crawlLeftOffset = elCrawl.getBoundingClientRect().left;
const crawlRightOffset = elCrawl.getBoundingClientRect().right;

/*
  Find out if the crawl fills the container
*/
function isCrawlShort() {
  let lastEl = document.querySelector("#container > div:last-child");
  if (!lastEl) return true;
  let rightStop = lastEl.getBoundingClientRect().right;
  return rightStop < crawlRightOffset;
}

function loadCrawls() {

  while (isCrawlShort()) {

    let crawl = crawls[crawlIndex];
    let isCategory = false;
    let classes = '';

    // Categories are prefixed with a #
    if (crawl.substr(0, 1) === '#') {
      crawl = crawl.substr(1);
      isCategory = true;
    }

    let lastEl = document.querySelector("#container > *:last-child");

    if (isCategory) {
      container.innerHTML += `<div data-id='${crawlIndex}' class='category'>${crawl}</div>`;
    } else if (!lastEl || lastEl.classList.contains("category")) {
      container.innerHTML += `<div class='headline-group'><div data-id='${crawlIndex}' class='headline'>${crawl}</div></div>`;
    } else if (lastEl.classList.contains("headline-group")) {
      lastEl.innerHTML += `<div data-id='${crawlIndex}' class='headline'>${crawl}</div>`;
    }

    crawlIndex++;
    if (crawlIndex+1 > crawls.length) {
      crawlIndex = 0;
    }

  }

}

loadCrawls();

let pos = 0;
let activeCategory, activeCategoryPos = null, x;
let inCategory = false;
let upNextCategory = false;
let nextCategory;

function crawl() {
  pos = pos - speed;
  
  // Detect if a category element is going out
  activeCategory = document.querySelector("#container .category:first-child");
  activeCategoryLeft = activeCategory.getBoundingClientRect().left;
  activeCategoryRight = activeCategory.getBoundingClientRect().right;

  if (activeCategoryPos == null) {
    activeCategoryPos = activeCategory.offsetLeft;
  }

  let nextCategoryLeft = null;
  if (nextCategory) {
    nextCategoryLeft = document.querySelectorAll("#container > .category")[1].getBoundingClientRect().left;
  }
  
  if (nextCategory && (nextCategoryLeft <= crawlLeftOffset)) {

    // Once the next category hits the edge of the master container we reset again

    pos = 0;
    container.style.left = '0px';

    // Remove anything to the left of the up next category
    let temp = document.querySelectorAll("#container > .category")[1];
    let sibling = temp.previousSibling;

    while (sibling) {
      sibling.remove();
      sibling = temp.previousSibling;
    }

    upNextCategory = false;
    inCategory = false;

  } else if (nextCategory && (nextCategoryLeft <= activeCategoryRight)) {

    // Next up category is hitting the right edge of the active category

    if (!upNextCategory) {
      console.log('Resetting pos = 0');
      upNextCategory = true;
      pos = 0;
    }

    // Scroll the parent container
    container.style.left = pos + 'px';

  } else if (activeCategoryLeft <= crawlLeftOffset) {

    // Once a category hits the edge, reset pos to 0 and stop moving the container
    if (!inCategory) {
      console.log('Resetting pos = 0');
      pos = 0;
      inCategory = true;

      // You can't do an :nth-child for this :(
      nextCategory = document.querySelectorAll("#container > .category")[1];
    }

    // Move the headline group instead
    activeCategory.nextSibling.style.marginLeft = pos + 'px';

  } else {
    container.style.left = pos + 'px';
  }

  loadCrawls();

  requestAnimationFrame(crawl);
}

crawl();
