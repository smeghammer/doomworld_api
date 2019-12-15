/**
 * JS to interface with ID archive API.
 * 
 * ?action=getdirs&name=levels/doom2/
 */
var engine = {
	PROXY_LOCATION : '/doom/proxy/proxy.php',	
	LIST_TARGET : 'doom_container',
	init : function(){
		console.log('starting');
		
		this.loadDirectories(false);
		
		$('#a').click(function(){
			console.log($(this).attr('data-test'));
			var action = "getfiles";
            $.ajax({
                type: "GET",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                url : engine.PROXY_LOCATION + "?action=getdirss&name=" + $(this).attr('data-test')
            }).done(function(data){
            	console.log(data);
            });
		});
		$('#b').click(function(){
			console.log($(this).attr('data-test'));
		});
	},
	
	loadDirectories : function(branch){
		let _url = engine.PROXY_LOCATION + "?action=getdirs"
		if(branch){
			_url = engine.PROXY_LOCATION + "?action=getdirs&name=" + branch
		}
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : _url
        }).done(function(data){
        	console.log(data);
        	if(data['content'] && data['content']['dir']){
        		engine.buildDirectoryLinks(data);
        	}
        	else{
        		engine.loadFiles(branch);
        	}
        });
	},
	
	loadFiles : function(branch){
		var _url = engine.PROXY_LOCATION + "?action=getfiles&name=" + branch
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : _url
        }).done(function(data){
        	console.log(data);
        	if(data['content'] && data['content']['files']){
        		engine.buildFileLinks(data);
        	}
//        	else{
//        		engine.loadFiles(branch);
//        	}
        });
	},
	
	buildDirectoryLinks : function(data){
		$('#'+engine.LIST_TARGET).empty();
		var _out = "";
		var _li = document.createElement('ul');
		if(data.content.dir){
			for(var a=0;a<data.content.dir.length; a++){
				var _ul = document.createElement('li');
				var _a = document.createElement('a');
				_a.setAttribute('href','#');
				_a.setAttribute('data-directory',data.content.dir[a].name);
				_a.setAttribute('data-id',data.content.dir[a].id);
				var _txt = document.createTextNode(data.content.dir[a].name);
				
				_a.appendChild(_txt);
				_ul.appendChild(_a);
				_li.appendChild(_ul);
				var _target = document.getElementById(engine.LIST_TARGET);
				_target.appendChild(_li);
			}
		}
		else{
			console.log(data);
		}
		/*
    	 * now append click handlers:
    	 * */
    	$('#doom_container li > a').each(function(){
    		$(this).click(function(){
    			console.log($(this).attr('data-directory'));
    			engine.loadDirectories($(this).attr('data-directory'));
    		});
    	});
		
	},
	
	getQuerystring : function(){
		return(window.location.search);
	}
};
$(function(){engine.init();})