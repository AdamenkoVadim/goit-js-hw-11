import './css/styles.css'
import fetchImages from "./js/fetchImages";
import { Notify } from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
const per_page = 20;
let searchQuery = null;

searchForm.addEventListener('submit', onSearch);
//loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.remove('is-hidden');

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



function imageMarkup(images) {
         return images.map(
             ({
             webformatURL,
               largeImageURL,
               likes,
               views,
               comments,
               tags,
               downloads,
             }) => {
               return `
               <div class='photo-card'>
           <a href='${largeImageURL}'><img
               src='${webformatURL}'
               alt='${tags}'
               loading='lazy'
             /></a>
           <div class='info'>
             <p class='info-item'>
               <b>Likes</b>
               ${likes}
             </p>
             <p class='info-item'>
               <b>Views</b>
               ${views}
             </p>
             <p class='info-item'>
               <b>Comments</b>
               ${comments}
             </p>
             <p class='info-item'>
               <b>Downloads</b>
               ${downloads}
             </p>
           </div>
         </div>`
             }
           )
           .join('');
                               
      }

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', imageMarkup(images));

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    close: false,
  });
}

window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  
  if(documentRect.bottom < document.documentElement.clientHeight) {
    onLoadMore();
    async function onLoadMore(e) {
      const response = await fetchImages(searchQery, page, per_page);
      const images = response.data.hits;
      const totalImages = response.data.totalHits;
      const totalPages = page * per_page;
      if (totalImages <= totalPages) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.classList.add('is-hidden');
      }
      appendImagesMarkup(images);
      page += 1;
    }
  }
}
);