
define(['jquery', 'bootstrap', 'URIjs', 'Readium', 'storage/Settings', 'ReaderSettingsDialog', 'hgn!templates/reader-navbar.html', 'hgn!templates/reader-body.html'],
    function ($, bootstrap, URI, Readium, Settings, SettingsDialog, ReaderNavbar, ReaderBody) {

    var readium,
        el = document.documentElement,
        currentDocument;

    // resize displayed image if needed 
    var imageResize = function(){
        var image_element = $('#epub-reader-container').find('iframe').contents().find('body').find('img');
        if(image_element!==undefined){
            image_element.css({'width':"100%",'height':"100%"});
            // traverse all the images on the page and set them one by one???
            // or
            // check all the images at the beginnig and resize the whole document accordingly??
            var image_width = parseInt(image_element.css("width"),10);
            var image_height = parseInt(image_element.css("height"),10);
            var percentage_width = 80;
            var percentage_height = 80;
            var percentage;
            console.log(image_width,image_height);
            // if larger than 800x600 resize
            if(image_width>600){
                percentage_width=600/image_width*100;
            }
            if(image_height>800){
                percentage_height = 800/image_width*100;
            }
            if(percentage_height>percentage_width){
                percentage = percentage_width;
            } else {
                percentage = percentage_height;
            }
            console.log(percentage_height,percentage_width);
            console.log(percentage);
            if(percentage<100){
                console.log(percentage_height,percentage_width);
                image_element.css({'width':percentage+"%",'height':percentage+"%"});
            }
        }
    };
    
    // This function will retrieve a package document and load an EPUB
    var loadEbook = function (packageDocumentURL) {
        readium.openPackageDocument(packageDocumentURL, function(packageDocument){
            currentDocument = packageDocument;
            currentDocument.generateTocListDOM(function(dom){
                loadToc(dom);
            });
        });
    };

    var loadToc = function(dom){
        $('script', dom).remove();
        var toc = $('body', dom).html() || $(dom).html();
        var tocUrl = currentDocument.getTocURL();

        $('#readium-toc-body').html(toc);
        $('#readium-toc-body').on('click', 'a', function(e){
            var href = $(this).attr('href');
            href = tocUrl ? new URI(href).absoluteTo(tocUrl).toString() : href;

            readium.reader.openContentUrl(href);
            return false;
        });
    };

    var installReaderEventHandlers = function(){
        // Set handlers for click events
        $("#previous-page-btn").unbind("click");
        $("#previous-page-btn").on("click", function () {
            console.log(readium);
            readium.reader.openPageLeft();
            imageResize();
            return false;
        });

        $("#next-page-btn").unbind("click");
        $("#next-page-btn").on("click", function () {
            readium.reader.openPageRight();
            imageResize();
            return false;
        });

        $('.icon-toc').on('click', function(){
            var $appContainer = $('#app-container');
            if ($appContainer.hasClass('toc-visible')){
                $appContainer.removeClass('toc-visible');
            }
            else{
                $appContainer.addClass('toc-visible');
            }
            readium.reader.handleViewportResize();

            });

        $('.icon-enlarge').on('click', function(){
            var fontSize = parseInt($('#epubContentIframe').contents().find("body").css("font-size"),10)*1.5;
            $('#epubContentIframe').contents().find("body").css("font-size", fontSize + 'px');
            console.log(fontSize);
        });

        $('.icon-smaller').on('click', function(){
            var fontSize = parseInt($('#epubContentIframe').contents().find("body").css("font-size"),10)*0.66666;
            $('#epubContentIframe').contents().find("body").css("font-size", fontSize + 'px');
            console.log(fontSize);
        });


        var setTocSize = function(){
            var appHeight = $(document.body).height() - $('#app-container')[0].offsetTop;
            $('#app-container').height(appHeight);
            $('#readium-toc-body').height(appHeight);
        };

        $(window).on('resize', setTocSize);
        setTocSize();

    };



    var loadReaderUIPrivate = function(){
        var $appContainer = $('#app-container');
        $appContainer.empty();
        $appContainer.append(ReaderBody({}));
        $('nav').empty();
        $('nav').append(ReaderNavbar({}));
        installReaderEventHandlers();

    };
    
    var loadReaderUI = function (data) {
        var url = data.url;
        loadReaderUIPrivate();
        currLayoutIsSynthetic = true;

        ReadiumSDK.on(ReadiumSDK.Events.READER_INITIALIZED, function() {
            navigator.epubReadingSystem.name = "epub-js-viewer";
            navigator.epubReadingSystem.version = "0.0.1";
        });

        readium = new Readium("#epub-reader-container", './lib/thirdparty/');
        var defaultSettings = {
            fontSize: 100,
            isSyntheticSpread: false // to do it one page at the time
        };

        //event to resize the view 
        // resize the cover image if needed 
        $(document).ready(function(){
            readium.reader.on(ReadiumSDK.Events.CONTENT_DOCUMENT_LOADED, function(){
                imageResize();
            },this);
        });


        readium.reader.updateSettings(defaultSettings);
        loadEbook(url);
    };


    var unloadReaderUI = function(){
        $(window).off('resize');
    };

    return {
        loadUI : loadReaderUI,
        unloadUI : unloadReaderUI
    };
    
});
