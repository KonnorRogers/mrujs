function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import lunr from "lunr";

class SearchEngine {
  generateIndex(indexData) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.index = lunr(function () {
        this.ref("id");
        this.field("id");
        this.field("title", {
          boost: 10
        });
        this.field("categories");
        this.field("tags");
        this.field("url");
        this.field("content");
        indexData.forEach(item => {
          if (item.content) {
            this.add(item);
          }
        });
      });
      _this.indexData = indexData;
    })();
  }

  performSearch(query) {
    var snippetLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (this.index) {
      this.query = query;
      var results = this.index.search(this.query);

      if (results.length) {
        return results.map(result => {
          var item = this.indexData.find(item => item.id == result.ref);
          var contentPreview = this.previewTemplate(item.content, snippetLength);
          var titlePreview = this.previewTemplate(item.title) + "<!--(".concat(result.score, ")-->");
          return {
            url: item.url.trim(),
            heading: titlePreview,
            preview: contentPreview
          };
        });
      } else {
        return [];
      }
    } else {
      throw new Error("Search index hasn't yet loaded. Run the generateIndex function");
    }
  }

  previewTemplate(text, length) {
    if (length == null) length = 300;
    var padding = length / 2;
    var output;

    if (length) {
      // Get sorted locations of all the words in the search query
      var textToSearch = text.toLowerCase();
      var wordLocations = this.query.toLowerCase().split(" ").map(word => {
        return textToSearch.indexOf(word);
      }).filter(location => location != -1).sort((a, b) => {
        return a - b;
      }); // Grab the first location and back up a bit
      // Then go past second location or just use the length

      if (wordLocations[1]) {
        length = Math.min(wordLocations[1] - wordLocations[0], length);
      }

      output = text.substr(Math.max(0, wordLocations[0] - padding), length + padding);
    } else {
      output = text;
    }

    if (!text.startsWith(output)) {
      output = "…" + output;
    }

    if (!text.endsWith(output)) {
      output = output + "…";
    }

    this.query.toLowerCase().split(" ").forEach(word => {
      if (word != "") {
        output = output.replace(new RegExp("(".concat(word.replace(/[\.\*\+\(\)]/g, ""), ")"), "ig"), "<strong>$1</strong>");
      }
    });
    return output;
  }

}

export default SearchEngine;
