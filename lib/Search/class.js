class Search {
  constructor(element) {
    let _this = this;
    this.data = null;
    const id = Math.random().toString(36).slice(2);
    element.innerHTML += `
      <div class="search" id="Search-${id}">
        <div class="input-group">
          <div class="prepend">
            <span class="search google-symbol">search</span>
          </div>
          <input type="text" placeholder="Search for securities" />
          <div class="append">
            <span class="close google-symbol">close</span>
          </div>
        </div>
        <div class="results">
          <div class="data"></div>
        </div>
      </div>
    `;

    let searchInputGroup = document.querySelector(`#Search-${id} .input-group`);
    let searchResults = document.querySelector(`#Search-${id} .results`);
    let searchResultsData = document.querySelector(`#Search-${id} .results .data`);
    let closeSearch = document.querySelector(`#Search-${id} .input-group .close`);
    let searchInput = document.querySelector(`#Search-${id} .input-group input`);

    /**
     * If underlying page is clicked or escape key is pressed the search results should be hidden
     *   - User input and search results are retained
     *   - If the user clicks back into the search field the results should open with the same content (no API request)
     */
    function handleModuleClick(event) {
      if (searchInputGroup.contains(event.target) || searchResults.contains(event.target)) {
        if (_this.data != null) {
          searchResults.style.visibility = 'visible';
        }
      } else {
        searchResults.style.visibility = 'hidden';
      }
    }
    document.addEventListener('click', handleModuleClick);

    /**
     * Search results should close and clear when "clear" button in search field is clicked
     */
    function handleClose(event) {
      searchResultsData.innerHTML = '';
      searchResults.style.visibility = 'hidden';
      searchInput.value = '';
      _this.data = null;
    }
    closeSearch.addEventListener('click', handleClose);

    /**
     * Handle user input
     * 
     * Modifier and arrow keys can be ignored.
     * Results should be cleared, a progress indicator shown, and input debounced to reduce HTTP requests.
     */
    function handleSearch(event) {
      if (event.keyCode == 16 // shift
        || event.keyCode == 17 // ctrl
        || event.keyCode == 18 // alt
        || event.keyCode == 37 // left arrow
        || event.keyCode == 38 // up arrow
        || event.keyCode == 39 // right arrow
        || event.keyCode == 40 // down arrow
      ) {
        return;
      }

      let query = searchInput.value.toLowerCase();
      if (query == '' || query.length < 3) {
        searchResults.style.visibility = 'hidden';
        return;
      }
      // progress indicator and update results
      searchResultsData.innerHTML = `Searching...`;
      searchResults.style.visibility = 'visible';

      // debounce
      setTimeout(() => {
        let currentQuery = searchInput.value.toLowerCase();
        if (query == currentQuery) {
          fetch(`http://localhost:8000/api/v1/funds?term=${query}`, {
            method: "GET"
          })
          .then(response =>response.json())
          .then(function(json) {
            let dataHTML = `
              <div class="row header">
                <div class="col name">Name</div>
                <div class="col ticker">Ticker</div>
                <div class="col exchange">Exchange</div>
              </div>
            `;
            if (json.length > 0) {
              json.forEach(function(data) {
                _this.data = data;
                // prevent scripts injection
                data.name = data.name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, ' ');
                data.ticker = data.ticker.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, ' ');
                data.exchange = data.exchange.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, ' ');
                let name = data.name.toLowerCase();
                if (name.indexOf(query) != -1) {
                  let index = name.indexOf(query);
                  data.name = `${data.name.slice(0, index)}<span class="match">${data.name.slice(index, index + query.length)}</span>${data.name.slice(index + query.length, data.name.length)}`;
                }
                let ticker = data.ticker.toLowerCase();
                if (ticker.indexOf(query) != -1) {
                  let index = ticker.indexOf(query);
                  data.ticker = `${data.ticker.slice(0, index)}<span class="match">${data.ticker.slice(index, index + query.length)}</span>${data.ticker.slice(index + query.length, data.ticker.length)}`;
                }
                let exchange = data.exchange.toLowerCase();
                if (exchange.indexOf(query) != -1) {
                  let index = exchange.indexOf(query);
                  data.exchange = `${data.exchange.slice(0, index)}<span class="match">${data.exchange.slice(index, index + query.length)}</span>${data.exchange.slice(index + query.length, data.exchange.length)}`;
                }
                dataHTML += `
                  <div class="record row">
                    <div class="col name">${data.name}</div>
                    <div class="col ticker">${data.ticker}</div>
                    <div class="col exchange">${data.exchange}</div>
                  </div>
                `;
              });
            } else {
              dataHTML = 'No results found';
            }
            searchResultsData.innerHTML = `
              ${dataHTML}
            `;
            searchResults.style.visibility = 'visible';
          });
        }
      }, 1000);
    }
    searchInput.addEventListener('keyup', handleSearch);

    /**
     * Perform self cleanup
     * 
     * Remove event listeners if parent search element no longer exists
     */
    function garbageCollect() {
      if (document.getElementById(`Search-${id}`)) {
        // check again later
        setTimeout(() => {
          garbageCollect();
        }, 10000)    
      } else {
        console.log('Search element no longer exists. Removing event listeners...');
        document.removeEventListener('click', handleModuleClick);
        closeSearch.removeEventListener('click', handleClose);
        searchInput.removeEventListener('keyup', handleSearch);
      }
    }
    setTimeout(function() {
      garbageCollect();
    }, 10000)
  }
}