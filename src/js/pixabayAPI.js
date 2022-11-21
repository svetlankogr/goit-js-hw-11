import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com';
  #API_KEY = '31421615-58a7222c9d48eda492d3b64ac';
  #total_photos = 0;
  #page = 1;
  #per_page = 40;
  #searchQuery = '';

  async fetchPhotos() {
    try {
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
      return await axios.get(`${this.#BASE_URL}/api/?`, searchParams);
    } catch (error) {
      console.log(error);
    }
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
