require(['jquery', 'MyEpubReader'], function($, EpubReader){
        // path with the title of the book
//		var epubUrl = "epub_content/page-blanche";
        var epubUrl = "epub_content/alexander";
		console.log(epubUrl);
		EpubReader.loadUI({url: decodeURIComponent(epubUrl)});
});
