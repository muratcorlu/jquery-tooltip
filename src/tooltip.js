/**
jQuery Tooltip plugin
Author: Murat Corlu
Web: http://muratcorlu.com
*/

(function($){
    var box,
    body = $("body"),
    timeOut,
    domWindow = window,
    jQueryWindow = $(domWindow),
    contentContainer = null,
    ttArrow = null,
    ttLeft = null,
    ttContainerName = 'tooltipContainer',
    modalBackground = null,

    getTooltipContainer = function(){
    	
        // Create container div if doesn't exist
        if (box == null) {
            box = $('#'+ttContainerName);
            if (box.length == 0) {
                box = $('<div id="'+ttContainerName+'" class="'+ttContainerName+'"><div id="ttArrow" class="ttArrow" /><table id="tooltipContainerTable" class="reset"><tr><td id="ttTopLeft" class="ttTopLeft" /><td id="ttTop" class="ttTop" /><td id="ttTopRight" class="ttTopRight" /></tr><tr><td id="ttLeft" class="ttLeft" /><td id="ttContent" class="ttContent" /><td id="ttRight" class="ttRight" /></tr><tr><td id="ttBottomLeft" class="ttBottomLeft" /><td id="ttBottom" class="ttBottom" /><td id="ttBottomRight" class="ttBottomRight" /></tr></table></div>').appendTo(body);
            }
        }

        box.mouseenter(function(){
            clearTimeout(timeOut);
        });

        box.mouseleave(function(){
           clearTimeout(timeOut);
           timeOut = setTimeout(function(){
                box.css({top:'-10000px'}).removeClass('ttVisible');
            }, 500); 
        });

        if (modalBackground == null) {
            modalBackground = $('<div id="ttModalBackground" />').hide().appendTo(body);
        }

        if (!contentContainer) { 
            contentContainer = $('#ttContent');
        }

        if (!ttArrow) {
            ttArrow = $('#ttArrow');
        }

        if (!ttLeft) {
            ttLeft = $('#ttLeft');
        }
        
        return box;
    },

    resizeHandler = function () {
        jQueryWindow.resize(function(){
            $('.'+ttContainerName+'.keepInWindow').each(function(){
                //
            });
        });
    };
    
    /*
    jQueryWindow.click(function(event){
        if($(event.target).parents('.'+ttContainerName).size() == 0){
            $('.'+ttContainerName+'.ttCloseOutsideClick').css({top:'-10000px'}).removeClass('ttVisible');
        }
    });
    */

    $.fn.ttShow = function() {
        $(this).trigger('ttShow');
    }

    $.fn.ttHide = function() {
        $(this).trigger('ttHide');
    }

    $.fn.tooltip = function(options) {

        var defaultOptions = {
            openEvent:'mouseenter',     // mouseenter, click
            openDelay:500,
            closeEvent:'mouseleave',    // mouseleave
            closeDelay:500,
            location:'relative',        // relative, absolute
            position:'bottom right',    // center, top left, top center, top right, fixed
            targetId:"",
            targetUrl:"",
            width:'auto',
            height:'auto',
            title:'',
            modal:false,
            distance:0
        },
        optionDistance,
        self = this;
        
        if (options.modal) {
            defaultOptions.location = 'absolute';
            defaultOptions.position = 'center';
            defaultOptions.openEvent = 'click';
            defaultOptions.closeEvent = '__custom';
            defaultOptions.openDelay = 0;
            defaultOptions.closeDelay = 0;
        }
        
	options  = $.extend(defaultOptions, options);

        optionDistance = options.distance;

        self.each(function(){
            var element = $(this),
            title = 'title';

            if (element.attr(title)) {
                element.data(title, element.attr(title));
                // Clear title attribute
                element.removeAttr(title);
            }
            
            //Eğer href "#" ise preventDefault() yapıyoruz (Doruk)
            
            if(element.attr("href") == "#"){            	 
            	element.click(function(e){
            		e.preventDefault();
            	});
            }
        });

        self.live('ttShow', function(event) {
        	
            clearTimeout(timeOut);

            // Get element
            var titleAttr = '',
            content,
            elLeft,
            elTop,
            elWidth,
            elHeight,
            elBottom,
            elRight,
            boxWidth,
            posLeft,
            posTop,
            ttLeftWidth,
            ttArrowWidth,
            windowWidth,
            windowHeight,
            scrollTop,
            
            checkBottom,
            checkRight,
            checkTop,
            checkLeft;
                
            titleAttr = self.data('title');
            
            // Create or get tooltipContainer div
            getTooltipContainer();

            box.bind(options.openEvent, function(){
                clearTimeout(timeOut);
            });

            box.bind(options.closeEvent, function(){

                self.trigger('ttHide');
               /*clearTimeout(timeOut);
               timeOut = setTimeout(function(){
                    box.css({top:'-10000px'}).removeClass('ttVisible');
                }, 500); */
            });

            // Set Content
            content = titleAttr;
            if (options.content) {
                content = options.content;
            }
            if (options.targetId) {
                content = $('#'+options.targetId).html();
            }
            if (options.url) {
                $.ajax({
                    url:options.url, 
                    success:function(response) {
                        contentContainer.html(response.responseText);
                    }
                });
            }
            
            contentContainer.html(content);

            windowWidth = jQueryWindow.width();
            windowHeight = jQueryWindow.height();
            scrollTop = jQueryWindow.scrollTop();

            // Position calculations
            elLeft = self.offset().left;
            
            elTop = self.offset().top;
            elWidth = self.width();
            elHeight = self.height();
            elBottom = elTop + elHeight;
            elRight = elLeft + elWidth;
            
            boxWidth = box.width();
            boxHeight = box.height();
            
            ttLeftWidth = ttLeft.width();
            ttArrowWidth = ttArrow.width();
            posLeft = 0;
            posTop = 0;
            
            box.attr('class',ttContainerName+' ttVisible');

            // TODO:
            // box.addClass('ttCloseOutsideClick');
            
            checkBottom = function(oldClass, newClass){
              if (posTop + boxHeight > windowHeight + scrollTop) {
                  box.removeClass(oldClass).addClass(newClass);
                  posTop = elTop - boxHeight;
                  ttArrow.css({top:(boxHeight - 12) + 'px'});
              }else{
                  ttArrow.css({top:0});
              }
            }

            checkTop = function(oldClass, newClass){
              if (posTop < scrollTop) {
                  box.removeClass(oldClass).addClass(newClass);
                  posTop = elTop - boxHeight;
                  ttArrow.css({top:(boxHeight - 12) + 'px'});
              }else{
                  ttArrow.css({top:0});
              }
            }

            checkRight = function(oldClass, newClass) {
                if (posLeft + boxWidth > windowWidth) {
                    box.removeClass(oldClass).addClass(newClass);
                    posLeft = elLeft - boxWidth;
                }
            }

            checkLeft = function(oldClass, newClass) {
                if (posLeft < 0) {
                    box.removeClass(oldClass).addClass(newClass);
                    posLeft = elRight + optionDistance;
                }
            }
            
            var positions = options.position.split(' ');
            
            box.addClass('pos-'+positions.join('-').toLowerCase());
            
            if (positions[0] == 'fixed') {
                // Fixed position calculations
            }else{

                if (positions.length == 1) {
                    positions[1] = 'center'
                }

                switch (positions[0]) {
                  case 'left':
                      //posLeft = elLeft - boxWidth;
                      box.addClass('posLeft');
                      posLeft = elLeft - boxWidth;
                      posTop = elTop - (boxHeight / 2);
                      ttArrow.attr('style','');
                      checkLeft('pos-left','pos-right');
                      break;
                  case 'right':
                      //posLeft = elRight + optionDistance;
                	  box.addClass('posRight');
                      posLeft = elRight + optionDistance;
                      posTop = elTop - (boxHeight / 2);
                      ttArrow.attr('style','');
                      checkRight('pos-right','pos-left');
                      break;
                  case 'top':
                      //posTop = elTop - optionDistance - boxHeight;
                	  box.addClass('posTop');
                      posLeft = elLeft - (boxWidth / 2) + (elWidth / 2);
                      posTop = elTop - optionDistance - boxHeight;
                      checkTop('pos-top-right','pos-bottom-right');
                      break;
                  case 'bottom':
                     // posTop = elBottom + optionDistance;
                      //checkBottom('pos-bottom','pos-top');
                      
                      box.addClass('posBottom');
                      posLeft = elLeft - (boxWidth / 2) + (elWidth / 2);
                      posTop = elBottom + optionDistance;
                      checkBottom('pos-bottom-right','pos-top-right');
                      break;
                  case 'center':
                      if (options.location == 'absolute') {
                          posLeft = (windowWidth - boxWidth) / 2;
                          posTop = scrollTop + ((windowHeight - boxHeight) / 2);
                      }else{
                          posLeft = elLeft + (elWidth / 2) - (boxWidth / 2);
                          posTop = elTop + (elHeight / 2) - (boxHeight / 2);
                      }
                      break;
                }

                switch (positions[1]) {
                  case 'right':
                    posLeft = elLeft;
                    if ((elWidth / 2) < (ttLeftWidth + (ttArrowWidth / 2))) {
                        posLeft -= (ttLeftWidth + (ttArrowWidth > elWidth ? ttArrowWidth - elWidth : 0));
                    }
                    break;
                  case 'left':
                    break;
                  case 'top':
                    break;
                  case 'bottom':
                    break;
                  case 'center':
                      if (options.location == 'absolute') {
                          if (!posLeft) {
                              posLeft = (windowWidth - boxWidth) / 2;
                          }else{
                              posTop = scrollTop + ((windowHeight - boxHeight) / 2);
                          }
                      }else{
                          if (!posLeft) {
                              posLeft = elLeft + (elWidth / 2) - (boxWidth / 2);
                          }else{
                              posTop = elTop + (elHeight / 2) - (boxHeight / 2);
                          }
                      }
                   
                    break;
                }
            }
            /*switch (options.position) {
              case 'center':
                  box.addClass('posCenter');
                  if (options.location == 'absolute') {
                    posLeft = (windowWidth - boxWidth) / 2;
                    posTop = scrollTop + ((windowHeight - boxHeight) / 2);
                  }
                  break;
              case 'bottom':
                  box.addClass('posBottom');
                  posLeft = elLeft - (boxWidth / 2) + (elWidth / 2);
                  posTop = elBottom + optionDistance;
                  checkBottom('posBottom','posTop');
                  break;
              case 'top':
                  box.addClass('posTop');
                  posLeft = elLeft - (boxWidth / 2) + (elWidth / 2);
                  posTop = elTop - optionDistance - boxHeight;
                  checkTop('posTop','posBottom');
                  break;
              case 'left':
                  box.addClass('posLeft');
                  posLeft = elLeft - boxWidth;
                  posTop = elTop - (boxHeight / 2);
                  ttArrow.attr('style','');
                  checkLeft('posLeft','posRight');
                  break;
              case 'right':
                  box.addClass('posRight');
                  posLeft = elRight + optionDistance;
                  posTop = elTop - (boxHeight / 2);
                  ttArrow.attr('style','');
                  checkRight('posRight','posLeft');
                  break;
             default:
                  box.addClass('posBottomRight');
                  posLeft = elLeft;
                  if ((elWidth / 2) < (ttLeftWidth + (ttArrowWidth / 2))) {
                      posLeft -= (ttLeftWidth + (ttArrowWidth > elWidth ? ttArrowWidth - elWidth : 0));
                  }
                  posTop = elBottom + optionDistance;
                  checkBottom('posBottomRight','posTopRight');
            }*/

            // Set box width if it set
            if (options.width != 'auto') {
                contentContainer.css({width: options.width+'px'});
            }

            if (options.modal) {
                modalBackground.show();
            }
           
            if (box.hasClass('ttVisible')) {
                // Set box position
                box.css({
                    left: posLeft+'px',
                    top: posTop+'px'
                });
            }else{
                // Show box
                timeOut = setTimeout(function(){
                    // Set box position
                    box.css({
                        left: posLeft+'px',
                        top: posTop+'px'
                    }).addClass('ttVisible');
                }, options.openDelay);
            }

        }).live('ttHide', function(e) {
            clearTimeout(timeOut);
            timeOut = setTimeout(function(){
                modalBackground.hide();
                box.css({top:'-10000px'}).removeClass('ttVisible');
            }, options.closeDelay);
        }).live(options.openEvent, function() {
        	 self = $(this);
        	 
        	 //FIXME Bunun burada olmaması lazım! (Geçici Çözüm Ürettik) (Doruk)
	    	 self.each(function(){
	             var element = $(this),
	             title = 'title';
	
	             if (element.attr(title)) {
	                 element.data(title, element.attr(title));
	                 // Clear title attribute
	                 element.removeAttr(title);
	             }
	             
	             //Eğer href "#" ise preventDefault() yapıyoruz (Doruk)
	             
	             if(element.attr("href") == "#"){            	 
	             	element.click(function(e){
	             		e.preventDefault();
	             	});
	             }
	         });        	
        	
            self.trigger('ttShow');
        }).live(options.closeEvent, function() {
            self.trigger('ttHide');
        });

        return self;
    };
})(jQuery);
