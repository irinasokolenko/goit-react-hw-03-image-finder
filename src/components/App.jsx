import { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostsApiService from 'services/PostApiService';

import Searchbar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

import { AppContent } from './App.module';

const postApiService = new PostsApiService();

export class App extends Component {
  state = {
    searchQuery: ``,//хранит запрос для поиска
    galleryItems: [],//хранит загруженые изображения
    galleryPage: 1,//хранит текущий номер страницы

    loading: false,//индикатор загрузки изображений
    isButtonShow: false,//кнопка
    error: true,//хранит сообщение об ошибке
    totalPages: 0, // хранит общее количество страниц
  };
//метод жизненого цикла (при обновлении компоненкта)
  componentDidUpdate(_, prevState) {
    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.galleryPage !== this.state.galleryPage
    ) {
      this.addgalleryItems();
    }
  }

  fetchGalleryItems = (nextQuery, nextPage) => {
    this.setState({ loading: true, error: false });

    postApiService.query = nextQuery;
    postApiService.page = nextPage;

    postApiService.fetchPost().then(data => {
      postApiService.hits = data.totalHits;

      const newData = data.hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );
     

      this.setState(prevState => ({
        galleryItems: [...prevState.galleryItems, ...newData],
      }));

      if (!data.totalHits) {
        this.setState({ loading: false, error: true });
        return toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      

      if (nextPage === 1) {
        toast.success(`Hooray! We found ${postApiService.hits} images.`);
      }

      this.setState({
        loading: false,
        isButtonShow: true,
        error: false,
      });
    });
  };

  handleFormSubmit = searchQuery => {
    this.setState({ galleryPage: 1, galleryItems: [], isButtonShow: false });
    if (searchQuery === 1);
    
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      galleryPage: prevState.galleryPage + 1,
    }));
  };

  render() {
    const { galleryItems, loading, isButtonShow, error } = this.state;

    return (
      <AppContent>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {error && <h2>Please, enter search word!</h2>}
        {!error && <ImageGallery galleryItems={galleryItems} />}
        {loading && <Loader />}
        {isButtonShow && <Button onClick={this.onLoadMore} />}

        {/* Additions  */}
        <ToastContainer autoClose={3000} theme="dark" />
      </AppContent>
    );
  }
}