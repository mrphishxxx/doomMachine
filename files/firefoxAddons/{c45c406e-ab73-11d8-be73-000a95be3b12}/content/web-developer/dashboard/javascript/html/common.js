var WebDeveloper = WebDeveloper || {};

WebDeveloper.Generated                    = WebDeveloper.Generated || {};
WebDeveloper.Generated.animationSpeed     = 200;
WebDeveloper.Generated.maximumURLLength   = 100;
WebDeveloper.Generated.syntaxHighlighters = [];

// Adds a document
WebDeveloper.Generated.addDocument = function(documentURL, documentCount, itemDescription, itemCount)
{
  var childElement = document.createElement("a");
  var element      = document.createElement("h2");
  var fragment     = document.createDocumentFragment();

  childElement.appendChild(document.createTextNode(documentURL));

  childElement.setAttribute("href", documentURL);
  element.setAttribute("id", "document-" + (documentCount + 1));
  element.appendChild(childElement);
  fragment.appendChild(element);

  element      = document.createElement("li");
  childElement = document.createElement("a");

  childElement.appendChild(document.createTextNode(WebDeveloper.Generated.formatURL(documentURL)));
  childElement.setAttribute("href", "#document-" + (documentCount + 1));
  element.appendChild(childElement);
  $(".dropdown-menu", $("#documents-dropdown")).get(0).appendChild(element);

  // If the item description is set
  if(itemDescription)
  {
    element = document.createElement("h3");

    // If there are items
    if(itemCount !== 0)
    {
      childElement = document.createElement("i");

      childElement.setAttribute("class", "icon-caret-down");
      element.appendChild(childElement);
    }

    element.appendChild(document.createTextNode(itemCount + " " + itemDescription));
    fragment.appendChild(element);
  }

  document.getElementById("content").appendChild(fragment);
};

// Adds a separator
WebDeveloper.Generated.addSeparator = function()
{
  var separator = document.createElement("div");

  separator.setAttribute("class", "web-developer-separator");
  document.getElementById("content").appendChild(separator);
};

// Changes the syntax highlight theme
WebDeveloper.Generated.changeSyntaxHighlightTheme = function(event)
{
  var themeMenu = $(this);
  var themeIcon = $("i", themeMenu);

  // If this is not the current theme
  if(themeIcon.hasClass("icon-empty"))
  {
    var theme = themeMenu.attr("id").replace("web-developer-syntax-highlighting-", "");

    // If there is no theme
    if(theme == "none")
    {
      $(".CodeMirror").hide();
      $(".web-developer-syntax-highlight").show();
    }
    else if(WebDeveloper.Generated.syntaxHighlighters.length)
    {
      $(".CodeMirror").show();
      $(".web-developer-syntax-highlight").hide();

      // Loop through the syntax highlighters
      for(var i = 0, l = WebDeveloper.Generated.syntaxHighlighters.length; i < l; i++)
      {
        WebDeveloper.Generated.syntaxHighlighters[i].setOption("theme", theme);
      }
    }
    else
    {
      WebDeveloper.Generated.initializeSyntaxHighlight(theme);
    }

    $(".dropdown-menu .icon-ok", $("#web-developer-syntax-highlighting-dropdown")).removeClass("icon-ok").addClass("icon-empty");
    themeIcon.removeClass("icon-empty").addClass("icon-ok");
  }

  event.preventDefault();
};

// Collapses all the output
WebDeveloper.Generated.collapseAllOutput = function(event)
{
  // Loop through the output headers
  $("h3").each(function()
  {
    var header = $(this);

    $("i", header).removeClass("icon-caret-down").addClass("icon-caret-right");
    header.next().slideUp(WebDeveloper.Generated.animationSpeed);
  });

  event.preventDefault();
};

// Empties the content
WebDeveloper.Generated.emptyContent = function()
{
  $(".progress", $("#content")).remove();
};

// Expands all the output
WebDeveloper.Generated.expandAllOutput = function(event)
{
  // Loop through the output headers
  $("h3").each(function()
  {
    var header = $(this);

    $("i", header).removeClass("icon-caret-right").addClass("icon-caret-down");
    header.next().slideDown(WebDeveloper.Generated.animationSpeed);
  });

  // If the event is set
  if(event)
  {
    event.preventDefault();
  }
};

// Formats a URL
WebDeveloper.Generated.formatURL = function(url)
{
  // If the URL is set
  if(url && url.length > WebDeveloper.Generated.maximumURLLength)
  {
    var halfLength = WebDeveloper.Generated.maximumURLLength / 2;

    return url.substring(0, halfLength) + "..." + url.substr(-halfLength);
  }

  return url;
};

// Generates a document container
WebDeveloper.Generated.generateDocumentContainer = function()
{
  var documentContainer = document.createElement("div");

  documentContainer.setAttribute("class", "web-developer-document");

  return documentContainer;
};

// Initializes the common page elements
WebDeveloper.Generated.initializeCommonElements = function()
{
  $("i", $("h3")).on("click", WebDeveloper.Generated.toggleOutput);
  $("#web-developer-collapse-all").on("click", WebDeveloper.Generated.collapseAllOutput);
  $("#web-developer-expand-all").on("click", WebDeveloper.Generated.expandAllOutput);

  // If there is a nav bar
  if($(".navbar").length)
  {
    $(".dropdown-toggle").dropdown();
  }
};

// Initializes the syntax highlight functionality
WebDeveloper.Generated.initializeSyntaxHighlight = function(color, locale)
{
  // If the locale is set
  if(locale)
  {
    $(".dropdown-toggle", $("#web-developer-syntax-highlighting-dropdown")).prepend(locale.syntaxHighlighting);
    $("#web-developer-syntax-highlighting-dark").append(locale.dark);
    $("#web-developer-syntax-highlighting-light").append(locale.light);
    $("#web-developer-syntax-highlighting-none").append(locale.none);

    $(".dropdown-menu a", $("#web-developer-syntax-highlighting-dropdown")).on("click", WebDeveloper.Generated.changeSyntaxHighlightTheme);
    $("i", $("#web-developer-syntax-highlighting-" + color)).removeClass("icon-empty").addClass("icon-ok");
  }

  // If a color is set
  if(color != "none")
  {
    // Loop through the syntax highlight elements
    $(".web-developer-syntax-highlight").each(function()
    {
      var pre = $(this);

      window.setTimeout(function()
      {
        WebDeveloper.Generated.syntaxHighlighters.push(CodeMirror(function(element)
        {
          pre.after(element);
          pre.hide();
        },
        {
          lineNumbers: pre.data("line-numbers"),
          mode: pre.data("type"),
          readOnly: true,
          tabSize: 2,
          theme: color,
          value: pre.text()
        }));
      }, 0);
    });
  }
};

// Initializes the page with JSON data
WebDeveloper.Generated.initializeWithJSON = function(event)
{
  var eventTarget = event.target;

  WebDeveloper.Generated.initialize(JSON.parse(eventTarget.getAttribute("data-web-developer")), JSON.parse(eventTarget.getAttribute("data-web-developer-locale")));

  eventTarget.removeAttribute("data-web-developer");
  eventTarget.removeAttribute("data-web-developer-locale");

  window.removeEventListener("web-developer-generated-event", WebDeveloper.Generated.initializeWithJSON, false);
};

// Localizes the header
WebDeveloper.Generated.localizeHeader = function(locale)
{
  $("#web-developer-collapse-all").text(locale.collapseAll);
  $("#web-developer-expand-all").text(locale.expandAll);
  $(".dropdown-toggle", $("#documents-dropdown")).prepend(locale.documents);
  $("span.brand").text(locale.webDeveloper);
};

// Outputs content
WebDeveloper.Generated.output = function(title, url, anchor, type, outputOriginal)
{
  var childElement      = document.createElement("i");
  var container         = document.createElement("pre");
  var content           = document.getElementById("content");
  var documentContainer = WebDeveloper.Generated.generateDocumentContainer();
  var element           = document.createElement("h3");
  var outputContainers  = [];
  var outputTitle       = title;

  childElement.setAttribute("class", "icon-caret-down");
  element.appendChild(childElement);
  element.setAttribute("id", anchor);

  // If the URL is set
  if(url)
  {
    childElement = document.createElement("a");
    outputTitle  = WebDeveloper.Generated.formatURL(url);

    childElement.appendChild(document.createTextNode(outputTitle));
    childElement.setAttribute("href", url);
    element.appendChild(childElement);
  }
  else
  {
    element.appendChild(document.createTextNode(outputTitle));
  }

  content.appendChild(element);

  childElement = document.createElement("a");
  element      = document.createElement("li");

  childElement.appendChild(document.createTextNode(outputTitle));
  childElement.setAttribute("href", "#" + anchor);
  element.appendChild(childElement);
  $(".dropdown-menu", $("#files-dropdown")).get(0).appendChild(element);

  container.setAttribute("class", "web-developer-syntax-highlight");
  container.setAttribute("data-line-numbers", "true");
  container.setAttribute("data-type", type);
  documentContainer.appendChild(container);
  outputContainers.push($(container));

  // If the original should be output
  if(outputOriginal)
  {
    var originalContainer = document.createElement("pre");

    originalContainer.setAttribute("class", "web-developer-original");
    documentContainer.appendChild(originalContainer);
    outputContainers.push($(originalContainer));
  }

  content.appendChild(documentContainer);
  WebDeveloper.Generated.addSeparator();

  return outputContainers;
};

// Sets the page title
WebDeveloper.Generated.setPageTitle = function(type, data, locale)
{
  document.title = type + " " + locale.from.toLowerCase() + " " + WebDeveloper.Generated.formatURL(data.pageURL);

  $("a.brand", $(".navbar")).text(type);
};

// Toggles the collapsed state of an output
WebDeveloper.Generated.toggleOutput = function()
{
  $(this).toggleClass("icon-caret-down").toggleClass("icon-caret-right").parent().next().slideToggle(WebDeveloper.Generated.animationSpeed);
};

window.addEventListener("web-developer-generated-event", WebDeveloper.Generated.initializeWithJSON, false);
var WebDeveloper = WebDeveloper || {};

WebDeveloper.Dashboard               = WebDeveloper.Dashboard || {};
WebDeveloper.Dashboard.browserWindow = null;
WebDeveloper.Dashboard.currentLine   = null;
WebDeveloper.Dashboard.editor        = null;
WebDeveloper.Dashboard.editorElement = null;
WebDeveloper.Dashboard.lastPosition  = null;
WebDeveloper.Dashboard.lastQuery     = null;
WebDeveloper.Dashboard.textArea      = null;

// Adjusts the breadcrumb
WebDeveloper.Dashboard.adjustBreadcrumb = function()
{
  // If the dashboard is not vertical
  if(!$("html").hasClass("vertical"))
  {
    $(".breadcrumb").css("margin-right", ($("#web-developer-copy-ancestor-path").outerWidth() + 10) + "px");
  }
};

// Changes the syntax highlight theme
WebDeveloper.Dashboard.changeSyntaxHighlightTheme = function(type, color)
{
  WebDeveloper.Dashboard.setContent(WebDeveloper.Dashboard.getContent(), true);

  // If the color is not set
  if(color == "none")
  {
    $(".CodeMirror").hide();
    WebDeveloper.Dashboard.textArea.show();
  }
  else if(WebDeveloper.Dashboard.editorElement)
  {
    $(".CodeMirror").show();
    WebDeveloper.Dashboard.textArea.hide();

    WebDeveloper.Dashboard.editor.setOption("theme", color);
  }
  else
  {
    WebDeveloper.Dashboard.initializeSyntaxHighlight(type, color);
  }

  WebDeveloper.Dashboard.resize();
};

// Returns the ancestor path
WebDeveloper.Dashboard.getAncestorPath = function()
{
  var ancestor     = null;
  var ancestorData = null;
  var ancestorPath = "";

  // Loop through the ancestors
  $("li", $("#web-developer-ancestors")).each(function()
  {
    ancestor      = $(this);
    ancestorData  = ancestor.data("web-developer-element-id");
    ancestorPath += ancestor.data("web-developer-element-tag");

    // If the ancestor data is set
    if(ancestorData)
    {
      ancestorPath += ancestorData;
    }

    ancestorData = ancestor.data("web-developer-element-classes");

    // If the ancestor data is set
    if(ancestorData)
    {
      ancestorPath += ancestorData;
    }

    ancestorPath += " > ";
  });

  // If the ancestor path is set
  if(ancestorPath)
  {
    ancestorPath = ancestorPath.substring(0, ancestorPath.length - 3);
  }

  return ancestorPath;
};

// Returns the content
WebDeveloper.Dashboard.getContent = function()
{
  // If the text area is set and is visible
  if(WebDeveloper.Dashboard.textArea && WebDeveloper.Dashboard.textArea.is(":visible"))
  {
    return WebDeveloper.Dashboard.textArea.val();
  }
  else if(WebDeveloper.Dashboard.editor)
  {
    return WebDeveloper.Dashboard.editor.getValue();
  }

  return null;
};

// Initializes the editor
WebDeveloper.Dashboard.initializeEditor = function(type, color)
{
  WebDeveloper.Dashboard.browserWindow = $(window);
  WebDeveloper.Dashboard.textArea      = $("#web-developer-content");

  // If the color is set
  if(color != "none")
  {
    WebDeveloper.Dashboard.initializeSyntaxHighlight(type, color);
  }

  WebDeveloper.Dashboard.resize();

  WebDeveloper.Dashboard.browserWindow.on("resize", WebDeveloper.Dashboard.resize);
};

// Initializes the syntax highlight functionality
WebDeveloper.Dashboard.initializeSyntaxHighlight = function(type, color)
{
  WebDeveloper.Dashboard.editor = CodeMirror.fromTextArea($("#web-developer-content").get(0),
  {
    lineNumbers: true,
    mode: type,
    onCursorActivity: function()
    {
      // If the current line is set
      if(WebDeveloper.Dashboard.currentLine)
      {
        WebDeveloper.Dashboard.editor.setLineClass(WebDeveloper.Dashboard.currentLine, null);
      }

      WebDeveloper.Dashboard.currentLine = WebDeveloper.Dashboard.editor.setLineClass(WebDeveloper.Dashboard.editor.getCursor().line, null, "current-line");
    },
    tabSize: 2,
    theme: color
  });

  WebDeveloper.Dashboard.editorElement = $(WebDeveloper.Dashboard.editor.getScrollerElement());
};

// Handles the window being resized
WebDeveloper.Dashboard.resize = function()
{
  WebDeveloper.Dashboard.textArea.height(WebDeveloper.Dashboard.browserWindow.height());

  // If the editor element is set
  if(WebDeveloper.Dashboard.editorElement)
  {
    WebDeveloper.Dashboard.editorElement.height(WebDeveloper.Dashboard.browserWindow.height());
  }
};

// Searches for the specified query
WebDeveloper.Dashboard.search = function(query)
{
  // If the editor element is set
  if(WebDeveloper.Dashboard.editorElement)
  {
    var cursor = null;

    // If this is a new query
    if(query != WebDeveloper.Dashboard.lastQuery)
    {
      WebDeveloper.Dashboard.lastPosition = null;
      WebDeveloper.Dashboard.lastQuery    = query;
    }

    cursor = WebDeveloper.Dashboard.editor.getSearchCursor(query, WebDeveloper.Dashboard.lastPosition, true);

    // If the search was not found
    if(!cursor.findNext())
    {
      cursor = WebDeveloper.Dashboard.editor.getSearchCursor(query, null, true);

      // If the search was still not found
      if(!cursor.findNext())
      {
        return;
      }
    }

    WebDeveloper.Dashboard.lastPosition = cursor.to();

    WebDeveloper.Dashboard.editor.setSelection(cursor.from(), WebDeveloper.Dashboard.lastPosition);
  }
};

// Sets the content
WebDeveloper.Dashboard.setContent = function(content, excludeNewLine)
{
  WebDeveloper.Dashboard.textArea.val(content);

  // If the editor is set
  if(WebDeveloper.Dashboard.editor)
  {
    // If not excluding the new line
    if(!excludeNewLine)
    {
      content += "\n";
    }

    WebDeveloper.Dashboard.editor.setValue(content);
  }
};

// Sets the position
WebDeveloper.Dashboard.setPosition = function(position)
{
  // If the position is left or right
  if(position == "left" || position == "right")
  {
    $("html").addClass("vertical");
  }
};
