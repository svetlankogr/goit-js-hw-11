import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';

export class PixabayAPI {
  #API_KEY = '31421615-58a7222c9d48eda492d3b64ac';
  #total_photos = 0;
  #page = 1;
  #per_page = 40;
  #searchQuery = '';

  async fetchPhotos() {
    const searchParams = {
      params: {
        q: this.#searchQuery,
        page: this.#page,
        per_page: this.#per_page,
        image_type: 'photo',
        safesearch: 'true',
        orientation: 'horizontal',
        key: this.#API_KEY,
      },
    };
    const { data } = await axios.get(`/api/?`, searchParams);
    return data;
  }
  get searchQuery() {
    return this.#searchQuery;
  }

  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  setTotal(total) {
    this.#total_photos = total;
  }

  morePagesExists() {
    return this.#page < Math.ceil(this.#total_photos / this.#per_page);
  }
  incrementPage() {
    this.#page += 1;
  }
  resetPage() {
    this.#page = 1;
  }
}
