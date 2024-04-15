class Search {
  constructor(element) {
    const id = Math.random().toString(36).slice(2);
    element.innerHTML += `
      <div class="${id} search">
        <div class="input-group">
          <div class="prepend">
            <span class="google-symbol">search</span>
          </div>
          <input type="text" placeholder="Search for securities" />
          <div class="append">
            <span class="google-symbol">close</span>
          </div>
        </div>
        <div class="results">
          <div class="data">
            <div class="row header">
              <div class="col name">Name</div>
              <div class="col ticker">Ticker</div>
              <div class="col exchange">Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
            <div class="row">
              <div class="col name">Test</div>
              <div class="col ticker">Test Ticker</div>
              <div class="col exchange">Test Exchange</div>
            </div>
          </div>
        </div>
      </div>
    `;

    
  }
}