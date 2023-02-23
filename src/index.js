import './css/styles.css'
import fetchImages from "./js/fetchImages";
import imageMarkup from './js/imageMarkup';
import { Notify } from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let page = 1;
const per_page = 40;
let searchQuery = null;

searchForm.addEventListener('submit', onSearch);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: false,
});

async function onSearch(e) {
  e.preventDefault();  

  gallery.innerHTML = '';
  searchQuery = e.currentTarget.searchQuery.value;

  page = 1;
  const response = await fetchImages(searchQuery, page, per_page);
  const images = response.data.hits;
  const totalImages = response.data.totalHits;

  if (images.length > 0) {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  } else {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  appendImagesMarkup(images);
}

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', imageMarkup(images));
  lightbox.refresh()
}

window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  
  if(documentRect.bottom < document.documentElement.clientHeight+2) {
    onLoadMore();
    async function onLoadMore(e) {
      const response = await fetchImages(searchQuery, page+1, per_page);
      const images = response.data.hits;
      const totalImages = response.data.totalHits;
      const totalPages = page * per_page;
      if (totalImages <= totalPages) {
        Notify.info("We're sorry, but you've reached the end of search results.");
      }
      appendImagesMarkup(images);
      page += 1;
    }
  }
}
);