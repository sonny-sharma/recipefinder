import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);

      if (!btn) return;
      const goToPage = +btn.dataset.togo;

      // after converting string to number using '+' sign
      // console.log(typeof goToPage);
      // console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    // console.log(this._data);
    const curPage = this._data.page;

    const prevButton = `
    <button data-togo="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>
    `;

    const nextButton = `
    <button data-togo="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
    
    
    `;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPages);

    // ? page1 , there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
     ${nextButton}
      
      `;
    }
    // ? Last page

    if (curPage === numPages && numPages > 1) {
      return `
     ${prevButton}
   
      
      `;
    }
    // ? Other page

    if (curPage < numPages) {
      return `
      ${prevButton}${nextButton}
      
      
      
      
      `;
    }
    // ? page1 , there are NO other pages
    return '';
  }
}

export default new PaginationView();
