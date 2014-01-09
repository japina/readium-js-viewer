require(['jquery', 'EpubLibrary', 'MyEpubReader'], function($, EpubLibrary, EpubReader){
	
	var getEpubQueryParam = function(){
        var query = window.location.search;
        if (query && query.length){
            query = query.substring(1);
        }
        if (query.length){
            var keyParams = query.split('&');
            for (var x = 0; x < keyParams.length; x++)
            {
                var keyVal = keyParams[x].split('=');
                if (keyVal[0] == 'epub' && keyVal.length == 2){
                    return keyVal[1];
                }
            }

        }
        return null;
    }


		var epubUrl = getEpubQueryParam();
		console.log(epubUrl);
		EpubReader.loadUI({url: decodeURIComponent(epubUrl)});


	/*
	var pushState = $.noop;
	if (window.history && window.history.pushState){
		$(window).on('popstate', function(){
			var state = history.state;
			if (state && state.url){
				EpubLibrary.unloadUI();
				EpubReader.loadUI({url: state.url});
			}
			else{
				EpubReader.unloadUI();
				EpubLibrary.loadUI();
			} 
		});
		pushState = function(data, title, url){
			history.pushState(data, title, url);
		};
	} 

	$(window).on('readepub', function(e, url){
		EpubLibrary.unloadUI();
		EpubReader.loadUI({url: url});
		pushState({url: url}, "Readium Viewer", '?epub=' + encodeURIComponent(url));
	}); */
});