/**
 * JS to interface with ID archive API.
 * 
 * ?action=getdirs&name=levels/doom2/
 */
var engine = {
	PROXY_LOCATION : '/doom/proxy/proxy.php',	
	init : function(){
		this.loadDirectories(false,'doom_container');
		this.spinner = document.createElement('img');
		this.spinner.setAttribute('src','images/spinner.gif');
	},
	
	loadDirectories : function(branch,target){
		let _url = engine.PROXY_LOCATION + "?action=getdirs"
		if(branch){
			_url = engine.PROXY_LOCATION + "?action=getdirs&name=" + branch;
		};
		$('#'+target).find('div.spinner_wrapper').append($(engine.spinner).clone());
		var _target = target;
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : _url
        }).done(function(data){
        	/* check whether the response is a directory list: */
        	if(data['content'] && data['content']['dir']){
        		engine.buildDirectoryLinks(data,_target);
        	}
        	/* if not, assume a file list */
        	else{
        		engine.loadFiles(branch,_target);
        	};
        }).fail(function(a,b,c){
        	console.log(a,b,c);
        });
	},
	
	loadFiles : function(branch,target,loadedBefore){
		var _url = engine.PROXY_LOCATION + "?action=getfiles&name=" + branch;
		var _target = target;
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : _url
        }).done(function(data){
        	if(data['content'] && data['content']['file']){
        		engine.buildFileLinks(data,_target);
        	}
        });
	},

	buildDirectoryLinks : function(data,  target){
		var _out = "";
		var _ul = document.createElement('ul');
		if(data.content.dir){
			/* If only one entry, we don't get an array, we get an object: */
			let _dirs = new Array();
			if(data.content.dir[0] === undefined){
				_dirs[0] = data.content.dir;
			}
			else{
				_dirs = data.content.dir;
			}
			for(var a=0;a<_dirs.length; a++){
				var _li = document.createElement('li');
				_li.setAttribute('data-loaded','false');
				_li.setAttribute('id','tree_'+_dirs[a].id);
				var _div1 = document.createElement('div'); /* wrapper for folder icon */
				_div1.setAttribute('class', 'tree-toggler closed');
				_div1.setAttribute('data-loaded','false');
				_div1.setAttribute('data-target','tree_'+_dirs[a].id);
				_div1.setAttribute('data-directory',_dirs[a].name);
				_div1.setAttribute('data-id',_dirs[a].id);
				var _txt = document.createTextNode(_dirs[a].name.split(/\//g).reverse()[1]);
				var _i = document.createElement('i');
				_i.setAttribute('class','fas fa-folder');
				var _div2 = document.createElement('div'); /* wrapper AJAX loading spinner */
				_div2.setAttribute('class', 'spinner_wrapper');
				_div1.appendChild(_i);
				_li.appendChild(_div1);
				_li.appendChild(_txt);
				_li.appendChild(_div2);
				_ul.appendChild(_li);
			}
			var _target = document.getElementById(target);
			_target.appendChild(_ul);
			
			/* remove spinner when done building the branch: */
			$(_target).find('div.spinner_wrapper > img').remove();
			
			/* now append click handlers: */
	    	$('#doom_container li > div').each(function(){
	    		$(this).off('click').click(function(){
	    			if($(this).attr('data-loaded') === 'false'){
	    				$(this).find('i').first().removeClass('fa-folder').addClass('fa-folder-open');
	    				$(this).attr({'data-loaded':'true'});
	    				engine.loadDirectories($(this).attr('data-directory'),$(this).attr('data-target'));
	    			}
	    			else{
	    				engine.toggleBranch($(this).attr('data-target'));
	    			}
	    		});
	    	});
		}
		else{
			console.log('not a directory listing');
		}
	},

	buildFileLinks : function(data, target){
		var _target = document.getElementById(target);
		var _out = "";
		var ftp_root = "ftp://ftp.fu-berlin.de/pc/games/idgames/";
		var _ul = document.createElement('ul');
		if(data.content.file){
			/* as for directories, if only one result, we don't get an array... */
			let _files = new Array();
			if(data.content.file[0] === undefined){
				_files[0] = data.content.file;
			}
			else{
				_files = data.content.file;
			}
			for(var a=0;a<_files.length; a++){
				var _li = document.createElement('li');
				_li.setAttribute('data-loaded','false');
				_li.setAttribute('id','tree_'+_files[a].id);
				
				var _div = document.createElement('div');
				_div.setAttribute('class', 'tree-toggler closed');
				_div.setAttribute('data-loaded','false');
				_div.setAttribute('data-target','tree_'+_files[a].id);
				
				var _span = document.createElement('span');
				let _desc = '[no description found]';
				if(_files[a].description){
					_desc = _files[a].description.replace(/\<br\>/g,'\n');
				}
				let _title = _files[a].filename;
				if(_files[a].title){
					_title = _files[a].title
				}
				var _a1 = document.createElement('a');
				_a1.setAttribute('title',_desc);
				_a1.setAttribute('href',ftp_root + _files[a].dir + _files[a].filename);
				
				var _txt = document.createTextNode(_title);
				_a1.appendChild(_txt);
				_li.appendChild(_div);
				_li.appendChild(_a1);
				_ul.appendChild(_li);
			}
			_target.appendChild(_ul);
			/* remove spinner when done building the childs: */
			$(_target).find('div.spinner_wrapper > img').remove();
		}
	},
	
	/**
	 * toggle visibility of child <li> elements 
	 * and also the folder class of the toggler <div>
	 * */
	toggleBranch : function(togglerId){
		var _thing = $('#'+togglerId).find('ul').first();
		
		if(_thing.hasClass('hidden')){
			$('#'+togglerId).find('i').first().removeClass('fa-folder').addClass('fa-folder-open');
			_thing.removeClass('hidden');
		}
		else{
			$('#'+togglerId).find('i').first().removeClass('fa-folder-open').addClass('fa-folder');
			_thing.addClass('hidden');
		}
	},
	
	getQuerystring : function(){
		return(window.location.search);
	}
};
$(function(){engine.init();})