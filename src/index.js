import './css/styles.css';
import { PixabayAPI } from './js/pixabayAPI';
import { renderMarkup } from './js/renderMarkup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const pixabayAPI = new PixabayAPI();
const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const simpleLightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
});

searchForm.addEventListener('submit', onSearchFormSubmit);

const loadMorePhotos = function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixabayAPI.incrementPage();
      try {
        const data = await pixabayAPI.fetchPhotos();
        if (data.totalHits === 0) {
          return;
        }
        gallery.insertAdjacentHTML('beforeend', renderMarkup(data.hits));
        smoothScroll();
        simpleLightbox.refresh();
        const haveMorePages = pixabayAPI.morePagesExists();
        if (haveMorePages) {
          const item = document.querySelector('.photo-card:last-child');
          observer.observe(item);
        } else {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
      } catch (error) {
        return Notiflix.Notify.warning(error.message);
      }
    }
  });
};

const io = new IntersectionObserver(loadMorePhotos, options);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;
  const searchValue = searchQuery.value.trim();

  pixabayAPI.resetPage();
  gallery.innerHTML = '';
  pixabayAPI.searchQuery = searchValue;

  if (!searchValue) {
    return Notiflix.Notify.info('Enter text in the searching field!');
  }

  try {
    const data = await pixabayAPI.fetchPhotos();

    if (data.totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    gallery.innerHTML = renderMarkup(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    simpleLightbox.refresh();

    pixabayAPI.setTotal(data.totalHits);
    const haveMorePages = pixabayAPI.morePagesExists();
    if (haveMorePages) {
      const item = document.querySelector('.photo-card:last-child');
      io.observe(item);
    }
  } catch (error) {
    return Notiflix.Notify.warning(error.message);
  }
  event.target.reset();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
