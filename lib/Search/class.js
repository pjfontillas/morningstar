class Search {
  constructor(element) {
    let _this = this;
    this.data = null;
    this.latestFetch = 0;
    this.fetchCounter = 0;
    const id = Math.random().toString(36).slice(2);
    element.innerHTML += `
      <div class="search" id="Search-${id}">
        <div class="input-group">
          <div class="prepend">
            <span class="search google-symbol">search</span>
          </div>
          <input type="text" placeholder="Search for securities" />
          <div class="append">
            <button aria-label="clear results" class="close google-symbol">close</button>
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
      closeSearch.style.visibility = 'hidden';
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
      let query = searchInput.value.toLowerCase();
      // context aware clear/close button
      if (query.length > 0) {
        closeSearch.style.visibility = 'visible';
      } else {
        closeSearch.style.visibility = 'visible';
      }

      // hide results
      if (query == '' || query.length < 3) {
        searchResults.style.visibility = 'hidden';
        return;
      }

      // progress indicator and update results
      searchResultsData.innerHTML = `Searching...`;
      searchResults.style.visibility = 'visible';

      // debounce
      setTimeout(async () => {
        let currentQuery = searchInput.value.toLowerCase();
        if (query == currentQuery) {
          try {
            const currentFetch = Date.now();
            _this.latestFetch = currentFetch;

            // hackish way to force waiting at least 10 seconds on first request and 5 seconds on second request
            // TODO: remove this eventually, this is not a feature
            if (_this.fetchCounter == 0) {
              _this.fetchCounter++;
              console.log('Simulating 10 second delay for first fetch request...');
              await new Promise(resolve => setTimeout(resolve, 10000));
            } else if (_this.fetchCounter == 1) {
              _this.fetchCounter++;
              console.log('Simulating 5 second delay for second fetch request...');
              await new Promise(resolve => setTimeout(resolve, 5000));
            }

            let response = await fetch(`http://localhost:8000/api/v1/funds?term=${query}`);
            let json = await response.json();
            let dataHTML = `
              <div class="row header">
                <div class="col name">Name</div>
                <div class="col ticker">Ticker</div>
                <div class="col exchange">Exchange</div>
              </div>
            `;

            // ignore all but latest fetch results
            if (currentFetch < _this.latestFetch) {
              return;
            }

            _this.data = json;
            if (json.length > 0) {
              json.forEach(function(data) {
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
          } catch (error) {
            console.error(error);
            searchResultsData.innerHTML = `
              Search failed. Please try again later.
            `;
          }
        }
      }, 1000);
    }
    searchInput.addEventListener('input', handleSearch);

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