import PreviewView from './previewView';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and';
  _message = '';
}

export default new BookmarksView();
